import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ owner: req.user.email });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }
        
        let existing = await Category.findOne({ owner: req.user.email, name: name });
        if (existing) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const newCategory = new Category({
            owner: req.user.email,
            name: name
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
