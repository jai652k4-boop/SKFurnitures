import express from 'express';
import {
    getUserAddresses,
    createAddress,
    updateAddress,
    deleteAddress
} from '../controllers/address.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All address routes require authentication
router.get('/', requireAuth, getUserAddresses);
router.post('/', requireAuth, createAddress);
router.put('/:id', requireAuth, updateAddress);
router.delete('/:id', requireAuth, deleteAddress);

export default router;
