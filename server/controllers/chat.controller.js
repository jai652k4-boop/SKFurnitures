import ChatConversation from '../models/ChatConversation.js';
import { chatCompletion } from '../config/openrouter.js';
import { SYSTEM_PROMPT, buildContextPrompt } from '../config/systemPrompt.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Helper function to generate session ID for guest users
function generateSessionId() {
    return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Helper function to extract keywords from user message
function extractKeywords(message) {
    const stopWords = ['i', 'want', 'need', 'show', 'me', 'a', 'an', 'the', 'for', 'under', 'above', 'below', 'with', 'in', 'is', 'are', 'can', 'you', 'please', 'help', 'find'];
    const words = message.toLowerCase().split(/\s+/);
    const keywords = words.filter(w => !stopWords.includes(w) && w.length > 2);
    return keywords.join('|');
}

// Create or get existing conversation
export const getOrCreateConversation = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { sessionId } = req.body;

        let conversation;

        if (userId) {
            // Authenticated user - find active conversation
            conversation = await ChatConversation.findOne({
                user: userId,
                isActive: true
            });
        } else if (sessionId) {
            // Guest user - find by session ID
            conversation = await ChatConversation.findOne({
                sessionId,
                isActive: true
            });
        }

        // Create new conversation if not found
        if (!conversation) {
            conversation = await ChatConversation.create({
                user: userId || null,
                sessionId: userId ? null : (sessionId || generateSessionId()),
                messages: [],
                isActive: true,
                lastMessageAt: new Date()
            });
        }

        res.json({
            success: true,
            data: {
                _id: conversation._id,
                sessionId: conversation.sessionId,
                messages: conversation.messages,
                createdAt: conversation.createdAt
            }
        });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Send message and get AI response
export const sendMessage = async (req, res) => {
    try {
        const { conversationId, message } = req.body;
        const userId = req.user?._id;

        // Validate input
        if (!conversationId || !message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Conversation ID and message are required'
            });
        }

        // Find conversation
        const conversation = await ChatConversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        // Add user message to conversation
        conversation.messages.push({
            role: 'user',
            content: message.trim(),
            timestamp: new Date()
        });

        // Gather context data
        let contextData = {
            user: null,
            orders: null,
            cart: []
        };

        if (userId) {
            contextData.user = req.user;
            contextData.cart = req.user?.cart || [];

            // Get recent orders for authenticated users
            contextData.orders = await Order.find({ user: userId })
                .sort('-createdAt')
                .limit(5)
                .select('orderNumber status paymentStatus totalAmount items createdAt');
        }

        // Search for relevant products based on message keywords
        const productKeywords = extractKeywords(message);
        let relevantProducts = [];

        if (productKeywords) {
            relevantProducts = await Product.find({
                $or: [
                    { name: { $regex: productKeywords, $options: 'i' } },
                    { category: { $regex: productKeywords, $options: 'i' } },
                    { description: { $regex: productKeywords, $options: 'i' } }
                ],
                isActive: true
            })
                .limit(10)
                .select('name price category stock averageRating totalReviews size images');
        }

        // Build context prompt with JSON format
        const contextPrompt = buildContextPrompt(
            contextData.user,
            relevantProducts,
            contextData.orders,
            contextData.cart
        );

        // Build AI messages with recommended pattern
        const aiMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'system', content: contextPrompt },
            ...conversation.messages.slice(-10).map(m => ({
                role: m.role,
                content: m.content
            }))
        ];

        console.log('💬 [CHAT] Processing message:', message);
        console.log('🔍 [CHAT] Found products:', relevantProducts.length);

        // Get AI response
        const aiResponse = await chatCompletion(aiMessages);

        // Add assistant message to conversation
        conversation.messages.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
            metadata: {
                productsShown: relevantProducts.map(p => p._id),
                productCount: relevantProducts.length
            }
        });

        conversation.lastMessageAt = new Date();
        await conversation.save();

        console.log('✅ [CHAT] Response sent successfully');

        res.json({
            success: true,
            data: {
                message: aiResponse,
                products: relevantProducts,
                conversationId: conversation._id,
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('❌ [CHAT] Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'I apologize, but I encountered an error. Please try again in a moment.'
        });
    }
};

// Get conversation history
export const getConversationHistory = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const conversation = await ChatConversation.findById(conversationId)
            .select('messages createdAt updatedAt isActive');

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        res.json({
            success: true,
            data: conversation
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// End conversation
export const endConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const conversation = await ChatConversation.findById(conversationId);

        if (conversation) {
            conversation.isActive = false;
            await conversation.save();
        }

        res.json({
            success: true,
            message: 'Conversation ended successfully'
        });
    } catch (error) {
        console.error('End conversation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default {
    getOrCreateConversation,
    sendMessage,
    getConversationHistory,
    endConversation
};
