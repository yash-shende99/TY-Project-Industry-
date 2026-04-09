import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    supplierName: { type: String, required: true },
    contactPerson: { type: String },
    phoneNumber: { type: String, required: true },
    address: { type: String },
    gstin: { type: String, required: true },
    
    // Material tracking
    materialSupplied: { type: String, required: true }, // EN8 Round Bars, etc.
    ratePerKg: { type: Number },
    lastPurchaseDate: { type: Date },
    
    totalPayment: { type: Number, default: 0 },
    depositAmount: { type: Number, default: 0 },
}, { timestamps: true }); 

const Supplier = mongoose.model("supplier", supplierSchema);

export default Supplier;
