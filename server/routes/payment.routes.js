import express from 'express';
import {
    createPaymentIntent,
    confirmCheckoutSession,
    createRemainingPayment,
    confirmPaymentSuccess,
    handleWebhook,
    getPaymentHistory,
    getPaymentById
} from '../controllers/payment.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Payment routes
router.post('/create-payment-intent', requireAuth, createPaymentIntent);
router.post('/confirm-session', requireAuth, confirmCheckoutSession);
router.post('/remaining/:orderId', requireAuth, createRemainingPayment);
router.post('/confirm', requireAuth, confirmPaymentSuccess);
router.get('/history', requireAuth, getPaymentHistory);
router.get('/:id', requireAuth, getPaymentById);

// Webhook route (no auth required, Stripe verifies)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
