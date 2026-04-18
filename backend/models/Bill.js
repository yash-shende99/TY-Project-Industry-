import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    owner: { type: String, required: true },  
    billNumber: { type: String, required: true, unique: true },
    invoiceNumber: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    dispatchDate: { type: Date },
    vehicleNumber: { type: String },
    
    // Client Details
    clientName: { type: String, required: true },
    customerName: { type: String }, // For backwards compatibility
    clientGstin: { type: String, required: true },
    phoneNumber: { type: String },
    customerId: { type: String }, // Used to map the invoice back to a specific customer profile
    poNumber: { type: String }, // Purchase Order Number
    poDate: { type: Date },
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
    deposit: { type: Number, default: 0 },
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
