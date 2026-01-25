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
        next();
    },
    requireAuth,
    (req, res, next) => {
        next();
    },
    requireAdmin,
    (req, res, next) => {
        next();
    },
    uploadMultiple,
    (req, res, next) => {
        next();
    },
    createProduct
);
router.put('/:id', requireAuth, requireAdmin, uploadMultiple, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
