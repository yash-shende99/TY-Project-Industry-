import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  owner: { type: String, required: true },  
  companyName: { type: String, required: true },
  contactPersonName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  gstin: { type: String, required: true },
  industryType: { 
      type: String,
      enum: ['Automotive', 'Construction', 'OEM', 'Vendor', 'Other'],
      default: 'Automotive'
  }
}, { timestamps: true }); 

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;