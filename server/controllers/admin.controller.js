import { User, Product, Order, Payment } from '../models/index.js';
import { sendInvoiceEmail } from '../config/email.js';

// @desc    Get all orders (admin view)
// @route   GET /api/admin/orders
// @access  Admin
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

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Admin
export const getAnalytics = async (req, res, next) => {
    try {
        // Total users
        const totalUsers = await User.countDocuments();

        // Total products
        const totalProducts = await Product.countDocuments();

        // Total orders
        const totalOrders = await Order.countDocuments();

        // Today's orders
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: todayStart }
        });

        // Total revenue
        const revenueResult = await Order.aggregate([
            { $match: { status: { $in: ['confirmed', 'shipped', 'delivered'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Today's revenue
        const todayRevenueResult = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['confirmed', 'shipped', 'delivered'] },
                    createdAt: { $gte: todayStart }
                }
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const todayRevenue = todayRevenueResult[0]?.total || 0;

        // Recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name')
            .sort('-createdAt')
            .limit(10);

        // Order status breakdown
        const orderStatusBreakdown = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Top selling products
        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 }
        ]);

        // Populate product details
        const topProductsWithDetails = await Product.populate(topProducts, {
            path: '_id',
            select: 'name images price'
        });

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    todayOrders,
                    totalRevenue,
                    todayRevenue
                },
                recentOrders,
                orderStatusBreakdown,
                topProducts: topProductsWithDetails
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search } = req.query;

        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const users = await User.find(filter)
            .select('-cart -favorites')
            .sort('-createdAt')
            .limit(Number(limit))
            .skip(skip);

        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            data: users,
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

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
export const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User role updated',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Trigger status update email via Inngest (optional, won't fail if Inngest is down)
        try {
            const { inngest } = await import('../config/inngest.js');
            await inngest.send({
                name: 'order/status-update',
                data: {
                    orderId: order._id.toString(),
                    status: status,
                    userEmail: order.customerEmail || order.user?.email
                }
            });
            console.log(`📨 Status update event sent for order ${order._id}`);
        } catch (inngestError) {
            console.log('⚠️ Could not send status update email:', inngestError.message);
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

// @desc    Send invoice email to customer
// @route   POST /api/admin/billing/:id
// @access  Admin
export const sendInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate('user', 'name email phone')
            .populate('items.product', 'name images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Determine customer email
        const customerEmail = order.customerEmail || order.user?.email;

        if (!customerEmail) {
            return res.status(400).json({
                success: false,
                message: 'No customer email found for this order'
            });
        }

        // Send invoice email directly (same pattern as payment confirmation)
        try {
            await sendInvoiceEmail({
                order,
                customerEmail
            });

            // Update order to mark invoice as sent
            order.invoiceSent = true;
            await order.save();

            console.log(`✅ Invoice sent to ${customerEmail} for order ${order._id}`);

            res.status(200).json({
                success: true,
                message: 'Invoice sent successfully',
                data: order
            });
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError.message);
            return res.status(500).json({
                success: false,
                message: `Failed to send invoice email: ${emailError.message}`
            });
        }
    } catch (error) {
        next(error);
    }
};

export default {
    getAllOrders,
    getAnalytics,
    getAllUsers,
    updateUserRole,
    updateOrderStatus,
    sendInvoice
};
