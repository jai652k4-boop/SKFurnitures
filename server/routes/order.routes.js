import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrder,
    getOrderBySession,
    cancelOrder,
    confirmOrder,
    updateOrderStatus,
    getAllOrders
} from '../controllers/order.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// User order routes
router.post('/', requireAuth, createOrder);
router.get('/', requireAuth, getMyOrders);
router.get('/by-session/:sessionId', requireAuth, getOrderBySession);
router.get('/:id', requireAuth, getOrder);
router.put('/:id/cancel', requireAuth, cancelOrder);
router.put('/:id/confirm', requireAuth, confirmOrder);

// Admin routes
router.get('/admin/all', requireAuth, requireAdmin, getAllOrders);
router.put('/:id/status', requireAuth, requireAdmin, updateOrderStatus);

export default router;
