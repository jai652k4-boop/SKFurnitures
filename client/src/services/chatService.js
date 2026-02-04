import api from './api';

// Create or get existing conversation
export const createConversation = async (sessionId) => {
    const { data } = await api.post('/chat/conversation', { sessionId });
    return data;
};

// Send message to chat
export const sendChatMessage = async (conversationId, message) => {
    const { data } = await api.post('/chat/message', {
        conversationId,
        message
    });
    return data;
};

// Get conversation history
export const getConversationHistory = async (conversationId) => {
    const { data } = await api.get(`/chat/conversation/${conversationId}`);
    return data;
};

// End conversation
export const endConversation = async (conversationId) => {
    const { data } = await api.post(`/chat/conversation/${conversationId}/end`);
    return data;
};

export default {
    createConversation,
    sendChatMessage,
    getConversationHistory,
    endConversation
};
