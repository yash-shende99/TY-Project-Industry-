import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    owner: { type: String, required: true },
    name: { type: String, required: true }
}, { timestamps: true });

// Ensure a user cannot duplicate category names
categorySchema.index({ owner: 1, name: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
