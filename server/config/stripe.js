import Stripe from 'stripe';

// Check if Stripe key is configured
if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ [STRIPE] STRIPE_SECRET_KEY is not set in environment variables!');
    console.warn('⚠️ [STRIPE] Payment functionality will not work without this key');
} else {

    console.log('🔑 [STRIPE] Key prefix:', process.env.STRIPE_SECRET_KEY.substring(0, 7) + '...');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
    apiVersion: '2023-10-16'
});

export const createPaymentIntent = async (amount, metadata = {}) => {
    try {

        console.log('💰 [STRIPE] Amount:', amount, '(₹', amount, ')');

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents/paise
            currency: 'inr',
            metadata,
            automatic_payment_methods: {
                enabled: true
            }
        });

        return paymentIntent;
    } catch (error) {
        console.error('🔥 [STRIPE] Payment intent creation failed!');
        console.error('❌ [STRIPE] Error type:', error.type);
        console.error('❌ [STRIPE] Error message:', error.message);
        console.error('❌ [STRIPE] Error code:', error.code);
        console.error('🔴 [STRIPE] Full error:', error);
        throw new Error(`Failed to create payment intent: ${error.message}`);
    }
};

export const confirmPayment = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    } catch (error) {
        console.error('Stripe confirm payment error:', error);
        throw new Error('Failed to confirm payment');
    }
};

export default stripe;
