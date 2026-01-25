import { Order, Payment } from '../models/index.js';
import stripe from '../config/stripe.js';
import { sendOrderConfirmationEmail } from '../config/email.js';
import { inngest } from '../config/inngest.js';

export const createPaymentIntent = async (req, res, next) => {
    try {
        const { orderData, paymentType } = req.body;
        const { items, shippingAddressId } = orderData;

        // Validate items and calculate totals
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

        // Determine payment amount
        const payType = paymentType || 'full';
        let amount = payType === 'advance' ? Math.ceil(totalAmount / 2) : totalAmount;

        // Get shipping address
        const address = await Order.db.model('Address').findById(shippingAddressId);
        if (!address || address.user.toString() !== req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Invalid shipping address' });
        }

        // Create line items for Stripe
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

        // Store ALL order data in metadata (will create order in webhook)
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

        // Create Stripe Checkout Session
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
            return res.json({ success: true, data: existingOrder });
        }

        const orderData = JSON.parse(orderDataStr);
        const totalAmount = orderData.totalAmount;

        // Calculate payment amounts based on payment type
        let paidAmount, remainingAmount, paymentStatus;
        if (paymentType === 'advance') {
            paidAmount = Math.ceil(totalAmount / 2);
            remainingAmount = totalAmount - paidAmount;
            paymentStatus = 'partial';
        } else {
            paidAmount = totalAmount;
            remainingAmount = 0;
            paymentStatus = 'completed';
        }

        const order = await Order.create({
            user: userId,
            items: orderData.items,
            subtotal: orderData.subtotal,
            deliveryCharge: orderData.deliveryCharge,
            totalAmount: totalAmount,
            paymentType: paymentType,
            shippingAddress: orderData.shippingAddress,
            status: 'confirmed',
            paymentStatus: paymentStatus,
            paidAmount: paidAmount,
            remainingAmount: remainingAmount,
            customerEmail: session.customer_details?.email || session.customer_email,
            metadata: { sessionId }
        });

        const Product = Order.db.model('Product');
        for (const item of orderData.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity, purchaseCount: item.quantity }
            });
        }

        const User = Order.db.model('User');
        await User.findByIdAndUpdate(userId, { cart: [] });

        // Create Payment record
        await Payment.create({
            order: order._id,
            user: userId,
            amount: paidAmount,
            paymentType: paymentType,
            method: 'stripe',
            status: 'completed',
            stripePaymentIntentId: sessionId
        });

        // Send confirmation email
        try {
            if (order.customerEmail) {
                await sendOrderConfirmationEmail({
                    order,
                    customerEmail: order.customerEmail
                });

            } else {

            }
        } catch (emailError) {
            console.error('❌ Email error:', emailError.message);
            // Don't fail the request if email fails
        }

        // Trigger Inngest event for order confirmation
        try {
            await inngest.send({
                name: 'order/confirmation',
                data: {
                    orderId: order._id.toString(),
                    userEmail: order.customerEmail,
                    userName: order.shippingAddress.name,
                    orderNumber: order._id.toString().slice(-8).toUpperCase(),
                    totalAmount: order.totalAmount
                }
            });

        } catch (inngestError) {
            console.error('⚠️ Inngest event error:', inngestError.message);
        }

        res.json({ success: true, data: order });
    } catch (error) {
        console.error('❌ Error confirming session:', error);
        next(error);
    }
};

export const createRemainingPayment = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check authorization
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Check if payment is partial
        if (order.paymentStatus !== 'partial') {
            return res.status(400).json({
                success: false,
                message: 'Order is already fully paid or payment not required'
            });
        }

        if (order.remainingAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No remaining amount to pay'
            });
        }

        // Create line items for Stripe
        const lineItems = [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: `Remaining Payment for Order #${order._id.toString().slice(-8).toUpperCase()}`,
                    description: `Complete payment for your order`
                },
                unit_amount: Math.round(order.remainingAmount * 100),
            },
            quantity: 1
        }];

        // Create Stripe Checkout Session for remaining payment
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-failed?canceled=true`,
            locale: 'auto',
            metadata: {
                orderId: order._id.toString(),
                userId: req.user._id.toString(),
                paymentType: 'remaining',
                isRemainingPayment: 'true'
            }
        });

        res.status(200).json({
            success: true,
            url: session.url,
            sessionId: session.id,
            amount: order.remainingAmount
        });
    } catch (error) {
        console.error('❌ [PAYMENT] Error creating remaining payment:', error);
        next(error);
    }
};

export const confirmPaymentSuccess = async (req, res, next) => {
    try {
        const { paymentIntentId } = req.body;

        // Find payment by Stripe payment intent ID
        const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            payment.status = 'completed';
            await payment.save();

            // Update order status to confirmed if full payment or advance
            if (payment.paymentType === 'full' || payment.paymentType === 'advance') {
                await Order.findByIdAndUpdate(payment.order, { status: 'confirmed' });
            }

            res.status(200).json({
                success: true,
                message: 'Payment confirmed',
                data: payment
            });
        } else {
            payment.status = 'failed';
            await payment.save();

            res.status(400).json({
                success: false,
                message: 'Payment not successful',
                status: paymentIntent.status
            });
        }
    } catch (error) {
        next(error);
    }
};

export const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            // Get data from metadata
            const userId = session.metadata.userId;
            const paymentType = session.metadata.paymentType;
            const orderDataStr = session.metadata.orderData;
            const isRemainingPayment = session.metadata.isRemainingPayment === 'true';
            const orderId = session.metadata.orderId;

            if (isRemainingPayment && orderId) {
                // Handle remaining payment
                try {
                    const order = await Order.findById(orderId);
                    if (order) {
                        const paidAmount = session.amount_total / 100;

                        // Update order
                        order.paidAmount = order.totalAmount;
                        order.remainingAmount = 0;
                        order.paymentStatus = 'completed';
                        await order.save();

                        // Create payment record
                        await Payment.create({
                            order: orderId,
                            user: order.user,
                            amount: paidAmount,
                            paymentType: 'remaining',
                            method: 'stripe',
                            status: 'completed',
                            stripePaymentIntentId: session.id
                        });

                        // Send status update email via Inngest
                        try {
                            await inngest.send({
                                name: 'order/status-update',
                                data: {
                                    orderId: orderId,
                                    status: 'completed',
                                    userEmail: order.customerEmail
                                }
                            });

                        } catch (inngestErr) {
                            console.error('⚠️ [WEBHOOK] Inngest error:', inngestErr.message);
                        }
                    }
                } catch (err) {
                    console.error('❌ [WEBHOOK] Error processing remaining payment:', err);
                }
            } else if (userId && orderDataStr) {
                // Initial payment - webhook backup (confirmCheckoutSession should handle this)
                const existingOrder = await Order.findOne({ 'metadata.sessionId': session.id });
                if (existingOrder) {

                    // Send confirmation email if not already sent
                    try {
                        if (existingOrder.customerEmail) {
                            await sendOrderConfirmationEmail({
                                order: existingOrder,
                                customerEmail: existingOrder.customerEmail
                            });

                        }
                    } catch (emailErr) {
                        console.error('❌ [WEBHOOK] Email error:', emailErr.message);
                    }
                } else {

                    try {
                        const paymentType = session.metadata.paymentType;
                        const orderData = JSON.parse(orderDataStr);
                        const totalAmount = orderData.totalAmount;

                        // Calculate payment amounts
                        let paidAmount, remainingAmount, paymentStatus;
                        if (paymentType === 'advance') {
                            paidAmount = Math.ceil(totalAmount / 2);
                            remainingAmount = totalAmount - paidAmount;
                            paymentStatus = 'partial';
                        } else {
                            paidAmount = totalAmount;
                            remainingAmount = 0;
                            paymentStatus = 'completed';
                        }

                        // Create order via webhook
                        const newOrder = await Order.create({
                            user: userId,
                            items: orderData.items,
                            subtotal: orderData.subtotal,
                            deliveryCharge: orderData.deliveryCharge,
                            totalAmount: totalAmount,
                            paymentType: paymentType,
                            shippingAddress: orderData.shippingAddress,
                            status: 'confirmed',
                            paymentStatus: paymentStatus,
                            paidAmount: paidAmount,
                            remainingAmount: remainingAmount,
                            customerEmail: session.customer_details?.email || session.customer_email,
                            metadata: { sessionId: session.id }
                        });

                        // Update product stocks
                        const Product = Order.db.model('Product');
                        for (const item of orderData.items) {
                            await Product.findByIdAndUpdate(item.product, {
                                $inc: { stock: -item.quantity, purchaseCount: item.quantity }
                            });
                        }

                        // Clear user cart
                        const User = Order.db.model('User');
                        await User.findByIdAndUpdate(userId, { cart: [] });

                        // Create payment record
                        await Payment.create({
                            order: newOrder._id,
                            user: userId,
                            amount: paidAmount,
                            paymentType: paymentType,
                            method: 'stripe',
                            status: 'completed',
                            stripePaymentIntentId: session.id
                        });

                        // Send confirmation email
                        try {
                            await sendOrderConfirmationEmail({
                                order: newOrder,
                                customerEmail: newOrder.customerEmail
                            });

                        } catch (emailErr) {
                            console.error('❌ [WEBHOOK] Email error:', emailErr.message);
                        }

                        // Trigger Inngest event
                        try {
                            await inngest.send({
                                name: 'order/confirmation',
                                data: {
                                    orderId: newOrder._id.toString(),
                                    userEmail: newOrder.customerEmail,
                                    userName: newOrder.shippingAddress.name,
                                    orderNumber: newOrder._id.toString().slice(-8).toUpperCase(),
                                    totalAmount: newOrder.totalAmount
                                }
                            });

                        } catch (inngestErr) {
                            console.error('⚠️ [WEBHOOK] Inngest event error:', inngestErr.message);
                        }
                    } catch (createErr) {
                        console.error('❌ [WEBHOOK] Failed to create order via webhook:', createErr.message);
                    }
                }
            }
            break;

        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;

            // Update payment status
            const payment = await Payment.findOne({
                stripePaymentIntentId: paymentIntent.id
            });

            if (payment) {
                payment.status = 'completed';
                await payment.save();

                // Update order status
                if (payment.paymentType === 'full' || payment.paymentType === 'advance') {
                    await Order.findByIdAndUpdate(payment.order, { status: 'confirmed' });
                }
            }
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;

            await Payment.findOneAndUpdate(
                { stripePaymentIntentId: failedPayment.id },
                { status: 'failed' }
            );
            break;

        default:

    }

    res.json({ received: true });
};

export const getPaymentHistory = async (req, res, next) => {
    try {
        const payments = await Payment.find({ user: req.user._id })
            .populate('order', 'items totalAmount status')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: payments
        });
    } catch (error) {
        next(error);
    }
};

export const getPaymentById = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('order')
            .populate('user', 'name email');

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // Check authorization
        if (payment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createPaymentIntent,
    createRemainingPayment,
    confirmPaymentSuccess,
    handleWebhook,
    getPaymentHistory,
    getPaymentById
};
