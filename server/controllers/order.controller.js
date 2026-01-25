import { Order, Product, User, Address } from '../models/index.js';
import { inngest } from '../config/inngest.js';

export const createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddressId, paymentType, specialInstructions } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order' });
        }

        // Get shipping address
        let shippingAddress;
        if (shippingAddressId) {
            const address = await Address.findById(shippingAddressId);
            if (!address || address.user.toString() !== req.user._id.toString()) {
                return res.status(400).json({ success: false, message: 'Invalid shipping address' });
            }
            shippingAddress = {
                name: address.name,
                phone: address.phone,
                street: address.street,
                city: address.city,
                state: address.state,
                pincode: address.pincode
            };
        } else if (req.body.shippingAddress) {
            shippingAddress = req.body.shippingAddress;
        } else {
            return res.status(400).json({ success: false, message: 'Shipping address is required' });
        }

        // Prepare order items with snapshots
        const orderItems = [];
        let subtotal = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            const itemPrice = product.price * item.quantity;
            subtotal += itemPrice;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0] || ''
            });

            // DON'T reduce stock here - only after successful payment
        }

        // Calculate delivery charge
        const deliveryCharge = subtotal > 999 ? 0 : 50; // Free delivery over 999
        const totalAmount = subtotal + deliveryCharge;

        // Create order with pending_payment status (won't show in orders until paid)
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            subtotal,
            deliveryCharge,
            totalAmount,
            paymentType: paymentType || 'full',
            shippingAddress,
            status: 'pending_payment' // Order won't appear until payment confirmed
        });

        // DON'T clear cart yet - only after successful payment

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const getMyOrders = async (req, res, next) => {
    try {
        // Only show orders that have been paid (exclude pending_payment)
        const orders = await Order.find({
            user: req.user._id,
            status: { $ne: 'pending_payment' } // Exclude unpaid orders
        })
            .populate('items.product', 'name images')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('items.product', 'name images');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check authorization (user owns order or admin)
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to access this order' });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const getOrderBySession = async (req, res, next) => {
    try {
        const order = await Order.findOne({ 'metadata.sessionId': req.params.sessionId })
            .populate('items.product', 'name images');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check authorization
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check authorization
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
        }

        // Check if order can be cancelled
        if (order.status === 'delivered' || order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order with status: ${order.status}`
            });
        }

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity,
                        purchaseCount: -item.quantity
                    }
                }
            );
        }

        order.status = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const confirmOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = 'confirmed';
        await order.save();

        // Send order confirmation email via Inngest
        await inngest.send({
            name: 'order/confirmation',
            data: {
                orderId: order._id.toString(),
                userEmail: order.user.email,
                userName: order.user.name,
                orderNumber: order._id.toString().slice(-8).toUpperCase(),
                totalAmount: order.totalAmount,
                items: order.items
            }
        });

        res.status(200).json({
            success: true,
            message: 'Order confirmed',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const skip = (page - 1) * limit;
        const orders = await Order.find(filter)
            .populate('user', 'name email phone')
            .populate('items.product', 'name')
            .sort('-createdAt')
            .limit(Number(limit))
            .skip(skip);

        const total = await Order.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            data: orders,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createOrder,
    getMyOrders,
    getOrder,
    cancelOrder,
    confirmOrder,
    updateOrderStatus,
    getAllOrders
};
