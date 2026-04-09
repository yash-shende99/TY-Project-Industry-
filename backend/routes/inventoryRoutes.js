import express from 'express';
import ensureAutheticate from "../Middleware/auth.js";
import { DeleteProduct,UpdateProduct,ProductList,AddProduct} from '../controllers/InventoryController.js';
import { getCategories, addCategory } from '../controllers/CategoryController.js';

const router = express.Router();

// Add a new product
router.post('/add', ensureAutheticate, AddProduct);

// List all products with optional search functionality
router.get('/list', ensureAutheticate, ProductList);

// Update product quantity, actualPrice, and sellingPrice
router.put('/update-product/:id', ensureAutheticate, UpdateProduct);

// Delete a product
router.delete('/delete/:id', ensureAutheticate,DeleteProduct);

// Categories
router.get('/categories', ensureAutheticate, getCategories);
router.post('/categories', ensureAutheticate, addCategory);

export default router;


