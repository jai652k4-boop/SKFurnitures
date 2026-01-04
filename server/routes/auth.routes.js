import express from 'express';
import {
    getMe,
    updateProfile,
    logout,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCart,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    updateCart
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);
router.post('/logout', requireAuth, logout);

// Cart routes
router.post('/cart/add', requireAuth, addToCart);
router.put('/cart/update', requireAuth, updateCartItem);
router.delete('/cart/remove/:productId', requireAuth, removeFromCart);
router.get('/cart', requireAuth, getCart);
router.post('/cart/sync', requireAuth, updateCart);

// Favorites routes
router.post('/favorites/add', requireAuth, addToFavorites);
router.delete('/favorites/remove/:productId', requireAuth, removeFromFavorites);
router.get('/favorites', requireAuth, getFavorites);

export default router;
