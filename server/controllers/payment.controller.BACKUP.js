import { Order, Payment } from '../models/index.js';
import stripe from '../config/stripe.js';

export const createPaymentIntent = async (req, res, next) => {
    try {
        const { orderData, paymentType } = req.body;
        const { items, shippingAddressId } = orderData;

        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Order.db.model('Product').findById(item.product);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            subtotal += product.price * item.quantity;
            orderItems.push({
                product: item.product,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0] || ''
            });
        }

        const deliveryCharge = subtotal > 999 ? 0 : 50;
        const totalAmount = subtotal + deliveryCharge;

        const payType = paymentType || 'full';
        let amount = payType === 'advance' ? Math.ceil(totalAmount / 2) : totalAmount;

        const address = await Order.db.model('Address').findById(shippingAddressId);
        if (!address || address.user.toString() !== req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Invalid shipping address' });
        }

        const lineItems = [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: `Furniture Order`,
                    description: `${orderItems.length} item(s) - ${payType === 'advance' ? '50% Advance' : 'Full'} Payment`
                },
                unit_amount: Math.round(amount * 100),
            },
            quantity: 1
        }];

        const metadata = {
            userId: req.user._id.toString(),
            paymentType: payType,
            orderData: JSON.stringify({
                items: orderItems,
                subtotal,
                deliveryCharge,
                totalAmount,
                shippingAddress: {
                    name: address.name,
                    phone: address.phone,
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode
                }
            })
        };

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/checkout?canceled=true`,
            locale: 'auto',
            metadata
        });

        console.log('✅ [PAYMENT] Stripe session created (order will be created after payment)');

        res.status(200).json({
            success: true,
            url: session.url,
            sessionId: session.id
        });
    } catch (error) {
        console.error('❌ [PAYMENT] Error:', error);
        next(error);
    }
};

export const confirmCheckoutSession = async (req, res, next) => {
    try {
        const { sessionId } = req.body;

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ success: false, message: 'Payment not completed' });
        }

        const userId = session.metadata.userId;
        const paymentType = session.metadata.paymentType;
        const orderDataStr = session.metadata.orderData;

        if (userId !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const existingOrder = await Order.findOne({ 'metadata.sessionId': sessionId });
        if (existingOrder) {
            return res.json({ success: true, data: existingOrder, message: 'Order already created' });
        }

        const orderData = JSON.parse(orderDataStr);

        const order = await Order.create({
            user: userId,
            items: orderData.items,
            subtotal: orderData.subtotal,
            deliveryCharge: orderData.deliveryCharge,
            totalAmount: orderData.totalAmount,
            paymentType: paymentType,
            shippingAddress: orderData.shippingAddress,
            status: 'confirmed',
            metadata: { sessionId }
        });

        const Product = Order.db.model('Product');
        for (const item of orderData.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: {
                    stock: -item.quantity,
                    purchaseCount: item.quantity
                }
            });
        }

        const User = Order.db.model('User');
        await User.findByIdAndUpdate(userId, { cart: [] });

        console.log(`Order ${order._id} created and confirmed`);

        res.json({ success: true, data: order });
    } catch (error) {
        console.error('Error confirming session:', error);
        next(error);
    }
};

export default {
    createPaymentIntent,
    confirmCheckoutSession
};
