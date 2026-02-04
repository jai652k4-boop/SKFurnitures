import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

if (!OPENROUTER_API_KEY) {
    console.warn('⚠️ [OPENROUTER] API key not set. Chat feature will not work.');
}

export const chatCompletion = async (messages, model = 'openai/gpt-3.5-turbo') => {
    try {
        console.log('🤖 [OPENROUTER] Sending request to AI...');

        const response = await axios.post(
            OPENROUTER_API_URL,
            {
                model,
                messages,
                temperature: 0.7,
                max_tokens: 1000
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
                    'X-Title': 'SK Furniture Assistant',
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ [OPENROUTER] AI response received');
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('❌ [OPENROUTER] API Error:', error.response?.data || error.message);
        throw new Error('AI service temporarily unavailable. Please try again.');
    }
};

export default { chatCompletion };
