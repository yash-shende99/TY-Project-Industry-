import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    owner: { type: String, required: true },  
    invoiceNumber: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    dispatchDate: { type: Date },
    
    // Client Details
    clientName: { type: String, required: true },
    clientGstin: { type: String, required: true },
    poNumber: { type: String }, // Purchase Order Number
    deliveryChallanNumber: { type: String },
    
    items: [{
        productName: String,
        drawingNumber: String,
        batchNumber: String,
        quantity: Number,
        rate: Number,
        total: Number
    }],
    
    // Financials
    subTotal: { type: Number, required: true },
    gstPercentage: { type: Number, default: 18 },
    gstAmount: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    
    netQuantity: { type: Number, required: true },
    history: [{
        date: { type: Date, default: Date.now },
        depositHistory: { type: Number, default: 0 },
        paymentMethod: { 
            type: String, 
            enum: ['Bank Transfer', 'Cheque', 'Cash'], 
            default: 'Bank Transfer' 
        },
    }],
});

const Invoice = mongoose.model('Bill', invoiceSchema); // Keep collection named 'bills' to avoid breaking existing DB completely, but functionally it's invoices

export default Invoice;
