import express from 'express';
import {
    getAllOrders,
    getAnalytics,
    getAllUsers,
    updateUserRole,
    updateOrderStatus,
    sendInvoice
} from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(requireAuth);
router.use(requireAdmin);

// Analytics
router.get('/analytics', getAnalytics);

// Orders management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Billing
router.post('/billing/:id', sendInvoice);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

export default router;
