import Invoice from "../models/Bill.js";
import Product from "../models/Product.js";
import Supplier from "../models/supplier.js";

export const getDashboardStats = async (req, res) => {
    try {
        const owner = req.user.email; // Extracted from decoded JWT

        // 1. Calculate Today's Sales
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const todaysSalesAggregate = await Invoice.aggregate([
            { $match: { owner: owner, date: { $gte: startOfToday, $lte: endOfToday } } },
            { $group: { _id: null, total: { $sum: "$grandTotal" } } }
        ]);
        const todaysSales = todaysSalesAggregate.length > 0 ? todaysSalesAggregate[0].total : 0;

        // 2. Calculate Monthly Revenue
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
        
        const monthlyRevenueAggregate = await Invoice.aggregate([
            { $match: { owner: owner, date: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: null, total: { $sum: "$grandTotal" } } }
        ]);
        const monthlyRevenue = monthlyRevenueAggregate.length > 0 ? monthlyRevenueAggregate[0].total : 0;

        // 3. Total Products and Suppliers
        const totalProducts = await Product.countDocuments({ owner });
        const activeSuppliers = await Supplier.countDocuments({ owner });

        // 4. Inventory Summary
        const lowStockProductsCount = await Product.countDocuments({ owner, $expr: { $lte: ["$quantity", "$minStockLevel"] } });
        
        const distinctCategories = await Product.distinct("category", { owner });
        const totalCategories = distinctCategories.length;

        const topSellingItemsAggregate = await Invoice.aggregate([
            { $match: { owner: owner } },
            { $unwind: "$items" },
            { $group: { _id: "$items.productName", quantitySold: { $sum: "$items.quantity" } } },
            { $sort: { quantitySold: -1 } },
            { $limit: 1 }
        ]);
        const topSellingItemCount = topSellingItemsAggregate.length > 0 ? topSellingItemsAggregate[0].quantitySold : 0;

        // 5. Recent Activities
        // Fetch latest bill
        const latestBill = await Invoice.findOne({ owner }).sort({ date: -1 });
        // Fetch latest supplier
        const latestSupplier = await Supplier.findOne({ owner }).sort({ createdAt: -1 });
        // Fetch most critical low stock product
        const criticalProduct = await Product.findOne({ owner, $expr: { $lte: ["$quantity", "$minStockLevel"] } }).sort({ quantity: 1 });

        const recentActivities = [];
        
        if (latestBill) {
            recentActivities.push({
                id: `sale-${latestBill._id}`,
                type: "sale",
                title: "Recent sale recorded",
                details: `Invoice #${latestBill.invoiceNumber} for ₹${latestBill.grandTotal}`,
                time: latestBill.date,
            });
        }
        
        if (criticalProduct) {
            recentActivities.push({
                id: `stock-${criticalProduct._id}`,
                type: "stock",
                title: "Low stock alert",
                details: `Product ${criticalProduct.name} only has ${criticalProduct.quantity} units left`,
                time: criticalProduct.dateUpdated || new Date(),
            });
        }
        
        if (latestSupplier) {
            recentActivities.push({
                id: `supplier-${latestSupplier._id}`,
                type: "supplier",
                title: "New supplier added",
                details: latestSupplier.supplierName,
                time: latestSupplier.createdAt || new Date(),
            });
        }

        // Sort combined recent activities by time descending
        recentActivities.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.status(200).json({
            stats: {
                todaysSales,
                monthlyRevenue,
                totalProducts,
                activeSuppliers
            },
            inventorySummary: {
                lowStockItems: lowStockProductsCount,
                totalCategories,
                topSellingTotal: topSellingItemCount
            },
            recentActivities
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({
            message: "Server error occurred while fetching dashboard stats",
            error: error.message
        });
    }
};
