import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories
} from '../controllers/product.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories/all', getCategories);
router.get('/:id', getProductById);

// Admin routes - with image upload middleware
router.post('/',
    (req, res, next) => {
        console.log('=== POST /products - START ===');
        console.log('Headers:', req.headers);
        next();
    },
    requireAuth,
    (req, res, next) => {
        console.log('=== After requireAuth ===');
        console.log('User:', req.user?._id);
        next();
    },
    requireAdmin,
    (req, res, next) => {
        console.log('=== After requireAdmin ===');
        next();
    },
    uploadMultiple,
    (req, res, next) => {
        console.log('=== After uploadMultiple ===');
        console.log('Files:', req.files?.length);
        console.log('Body:', req.body);
        next();
    },
    createProduct
);
router.put('/:id', requireAuth, requireAdmin, uploadMultiple, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
