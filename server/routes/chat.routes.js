import express from 'express';
import {
    getOrCreateConversation,
    sendMessage,
    getConversationHistory,
    endConversation
} from '../controllers/chat.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Chat routes (support both authenticated and guest users)
router.post('/conversation', optionalAuth, getOrCreateConversation);
router.post('/message', optionalAuth, sendMessage);
router.get('/conversation/:conversationId', optionalAuth, getConversationHistory);
router.post('/conversation/:conversationId/end', optionalAuth, endConversation);

export default router;
