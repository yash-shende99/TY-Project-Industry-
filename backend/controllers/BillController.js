import Product from "../models/Product.js";
import Bill from "../models/Bill.js";




export const CreateBill = async (req, res) => {
    const owner = req.user.email; 

    try {
        const { clientName, clientGstin, poNumber, deliveryChallanNumber, items, gstPercentage = 18 } = req.body;

        const invoiceNumber = `INV-${Date.now()}`;

        let subTotal = 0;
        let netQuantity = 0;
        const productsToUpdate = [];

        // Phase 1: Verification
        for (const item of items) {
            const product = await Product.findOne({ _id: item.productId, owner });
            if (!product) {
                return res.status(404).json({ message: `Product ${item.productName || item.productId} not found` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }

            const itemRate = item.rate || item.price || 0;
            subTotal += itemRate * item.quantity;
            netQuantity += item.quantity;
            
            product.quantity -= item.quantity;
            productsToUpdate.push(product);
        }

        const gstAmount = (subTotal * gstPercentage) / 100;
        const grandTotal = subTotal + gstAmount;

        const invoice = new Bill({
            owner,
            invoiceNumber,
            clientName,
            clientGstin: clientGstin || 'UNREGISTERED',
            poNumber,
            deliveryChallanNumber,
            items,
            subTotal,
            gstPercentage,
            gstAmount,
            grandTotal,
            netQuantity,
            date: new Date(),
            history: [] // B2B payments are usually separated from instant deposit
        });

        // Phase 2: Validate invoice before touching database stock
        await invoice.validate();

        // Phase 3: Execute DB writes
        for (const product of productsToUpdate) {
            await product.save();
        }
        await invoice.save();

        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

export const GetBill = async (req, res) => {
    const owner = req.user.email;
    try {
        const data = await Bill.find({ owner }).sort({ date: -1 }); 
        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "No invoices found for this user" });
        }
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: "Server Error", error });
    }
};


export const UpdateBill = async (req, res) => {


    const { billId } = req.params;
    const { history } = req.body;

    try {
        const bill = await Bill.findById(billId);  // Simplified findById call

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        bill.deposit += history; // Update deposit amount

        const newHistoryEntry = {
            date: history.date || new Date(),
            depositHistory: history || 0,
            paymentMethod: history.paymentMethod || 'Cash'
        };

        bill.history.push(newHistoryEntry);
        await bill.save();

        res.status(200).json({
            message: "History updated successfully",
            bill
        });

    } catch (error) {
        console.error("Error updating customer history:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

