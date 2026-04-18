import Product from "../models/Product.js";
import Invoice from "../models/Bill.js";

export const getAnalysisData = async (req, res) => {
    try {
        const owner = req.user.email;

        // 1. Stock Levels vs Thresholds (Bar Chart)
        const productsRaw = await Product.find({ owner }).limit(30);
        const stockLevels = productsRaw.map(p => ({
            name: p.name,
            quantity: p.quantity,
            threshold: p.minStockLevel || 0
        }));

        // 2. Stock Status Overview (Pie Chart) -> Ready vs In Production vs Dispatched
        const statusAggregate = await Product.aggregate([
            { $match: { owner: owner } },
            { $group: { _id: "$status", value: { $sum: 1 } } }
        ]);
        const stockStatus = statusAggregate.map(s => ({
            name: s._id || 'Unknown',
            value: s.value
        }));

        // 3. Category Distribution (Pie Chart)
        const categoryAggregate = await Product.aggregate([
            { $match: { owner: owner } },
            { $group: { _id: "$category", value: { $sum: 1 } } }
        ]);
        const categories = categoryAggregate.map(c => ({
            name: c._id || 'Uncategorized',
            value: c.value
        }));

        // 4. Sales Timelines
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const salesAggregate = await Invoice.aggregate([
            { $match: { owner: owner, date: { $gte: thirtyDaysAgo } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalRevenue: { $sum: "$grandTotal" },
                    totalQuantity: { $sum: "$netQuantity" },
                    transactions: { $sum: 1 }
                } 
            },
            { $sort: { "_id": 1 } }
        ]);

        const salesTimeline = [];
        for (let i = 0; i < 30; i++) {
            const current = new Date(thirtyDaysAgo);
            current.setDate(current.getDate() + i);
            const dateStr = current.toISOString().split('T')[0];
            const matchingData = salesAggregate.find(d => d._id === dateStr);
            
            salesTimeline.push({
                date: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: matchingData ? matchingData.totalRevenue : 0,
                quantitySold: matchingData ? matchingData.totalQuantity : 0,
                transactions: matchingData ? matchingData.transactions : 0
            });
        }

        // 5. Top Selling Products (Bar/Pie Chart)
        const topProductsAggregate = await Invoice.aggregate([
            { $match: { owner: owner } },
            { $unwind: "$items" },
            { $group: { _id: "$items.productName", quantitySold: { $sum: "$items.quantity" }, revenue: { $sum: "$items.total" } } },
            { $sort: { quantitySold: -1 } },
            { $limit: 10 }
        ]);
        
        const topProducts = topProductsAggregate.map(p => ({
            name: p._id,
            quantitySold: p.quantitySold,
            revenue: p.revenue
        }));

        res.status(200).json({
            stockLevels,
            stockStatus,
            categories,
            salesTimeline,
            topProducts
        });

    } catch (error) {
        console.error("Error fetching analysis data:", error);
        res.status(500).json({
            message: "Failed to load dynamic analysis charts",
            error: error.message
        });
    }
};
