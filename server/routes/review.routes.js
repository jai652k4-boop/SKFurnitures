import express from 'express';
import {
    createReview,
    getProductReviews,
    getUserReviews,
    deleteReview,
    checkCanReview
} from '../controllers/review.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Review routes
router.post('/', requireAuth, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/can-review/:productId', requireAuth, checkCanReview);
router.get('/user', requireAuth, getUserReviews);
router.delete('/:id', requireAuth, deleteReview);

export default router;
