import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    
    // Basic Info
    name: { type: String, required: true },
    category: { type: String, required: true }, // From dynamic category list
    productCode: { type: String, required: true }, // Internal ID
    
    // Engineering Details
    materialType: { type: String, required: true }, // MS, EN8, Brass, etc.
    dimensions: { type: String, required: true }, // Length, Diameter, Thread size
    drawingNumber: { type: String, required: true }, // Mandatory for manufacturing
    tolerance: { type: String }, // Optional but powerful
    
    // Production Tracking
    batchNumber: { type: String, required: true },
    heatNumber: { type: String }, // Applicable for metals
    manufacturingDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['In Production', 'Ready', 'Dispatched'],
        default: 'Ready'
    },
    
    // Inventory
    quantity: { type: Number, required: true }, // Quantity in Stock
    minStockLevel: { type: Number, required: true },
    
    dateAdded: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
    this.dateUpdated = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;