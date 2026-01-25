import { inngest } from '../config/inngest.js';
import { Order, User } from '../models/index.js';
import { sendOrderConfirmationEmail } from '../config/email.js';

// Send order confirmation event
export const sendOrderConfirmation = inngest.createFunction(
    { id: 'send-order-confirmation' },
    { event: 'order/confirmation' },
    async ({ event }) => {
        const { orderId, userEmail, userName } = event.data;

        try {
            // Fetch complete order data
            const order = await Order.findById(orderId);

            if (!order) {
                console.error(`[INNGEST] Order ${orderId} not found`);
                return { success: false, orderId, error: 'Order not found' };
            }

            // Send email using the email service
            await sendOrderConfirmationEmail({
                order,
                customerEmail: userEmail || order.user.email
            });

            return { success: true, orderId };
        } catch (error) {
            console.error(`[INNGEST] Failed to send confirmation email:`, error.message);
            return { success: false, orderId, error: error.message };
        }
    }
);

// Send order status update notification
export const sendOrderStatusUpdate = inngest.createFunction(
    { id: 'send-order-status-update' },
    { event: 'order/status-update' },
    async ({ event }) => {
        const { orderId, status, userEmail } = event.data;

        try {
            const order = await Order.findById(orderId).populate('user', 'email name');

            if (!order) {
                console.error(`[INNGEST] Order ${orderId} not found for status update`);
                return { success: false, orderId, status };
            }

            const email = userEmail || order.user?.email;

            if (!email) {
                console.warn(`[INNGEST] No email found for order ${orderId}`);
                return { success: false, orderId, status, error: 'No email found' };
            }

            // Create status update email HTML
            const statusLabels = {
                'confirmed': 'Confirmed',
                'processing': 'Processing',
                'shipped': 'Shipped',
                'delivered': 'Delivered',
                'cancelled': 'Cancelled'
            };

            const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Status Update</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial; background: #f4f4f4;">
                <table style="width: 100%; background: #f4f4f4;">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table style="width: 600px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                    <td style="padding: 40px; color: white; text-align: center;">
                                        <h1 style="margin: 0; font-size: 28px;">Order Status Update</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px;">
                                        <p>Hi ${order.shippingAddress.name},</p>
                                        <p>Your order <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> status has been updated.</p>
                                        
                                        <div style="background: #f0f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                                            <p style="margin: 0; font-size: 16px; font-weight: 600;">Current Status: <span style="color: #667eea;">${statusLabels[status] || status}</span></p>
                                        </div>
                                        
                                        <p style="color: #666; margin-top: 20px;">You can track your order status in your account dashboard.</p>
                                    </td>
                                </tr>
                                <tr style="background: #f8f9fa; border-top: 1px solid #eee;">
                                    <td style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
                                        <p>© ${new Date().getFullYear()} SK Furniture. All rights reserved.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>`;

            // Send email
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.default.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: process.env.SMTP_PORT || 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            await transporter.sendMail({
                from: `"${process.env.FROM_NAME || 'SK Furniture'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
                to: email,
                subject: `Order #${order._id.toString().slice(-8).toUpperCase()} - ${statusLabels[status] || status}`,
                html: emailHtml
            });

            return { success: true, orderId, status };
        } catch (error) {
            console.error(`[INNGEST] Failed to send status update email:`, error.message);
            return { success: false, orderId, status, error: error.message };
        }
    }
);

export const generateInvoice = inngest.createFunction(
    { id: 'generate-invoice' },
    { event: 'billing/generate' },
    async ({ event }) => {
        const { orderId } = event.data;

        try {
            const order = await Order.findById(orderId)
                .populate('user', 'name email phone');

            if (!order || !order.user) {
                console.error(`[INNGEST] Order ${orderId} or user not found for invoice generation`);
                return { success: false, orderId, error: 'Order or user not found' };
            }

            const invoiceHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invoice</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial; background: #f4f4f4;">
                <table style="width: 100%; background: #f4f4f4;">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table style="width: 600px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                    <td style="padding: 40px; color: white;">
                                        <h1 style="margin: 0; font-size: 32px;">INVOICE</h1>
                                        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">SK Furniture</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px;">
                                        <table style="width: 100%; margin-bottom: 30px;">
                                            <tr>
                                                <td>
                                                    <p><strong>Invoice #</strong><br>${order._id.toString().slice(-8).toUpperCase()}</p>
                                                </td>
                                                <td align="right">
                                                    <p><strong>Date</strong><br>${new Date(order.createdAt).toLocaleDateString()}</p>
                                                </td>
                                            </tr>
                                        </table>

                                        <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
                                            <tr style="border-bottom: 2px solid #eee;">
                                                <td style="padding: 10px 0;"><strong>Bill To:</strong></td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0;">${order.user.name}<br>${order.shippingAddress.street}<br>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>Phone: ${order.shippingAddress.phone}</td>
                                            </tr>
                                        </table>

                                        <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
                                            <tr style="background: #f8f9fa; border-bottom: 2px solid #667eea;">
                                                <th style="padding: 12px; text-align: left; font-weight: 600;">Item</th>
                                                <th style="padding: 12px; text-align: center; font-weight: 600;">Qty</th>
                                                <th style="padding: 12px; text-align: right; font-weight: 600;">Price</th>
                                                <th style="padding: 12px; text-align: right; font-weight: 600;">Total</th>
                                            </tr>
                                            ${order.items.map(item => `
                                            <tr style="border-bottom: 1px solid #eee;">
                                                <td style="padding: 12px;">${item.name}</td>
                                                <td style="padding: 12px; text-align: center;">${item.quantity}</td>
                                                <td style="padding: 12px; text-align: right;">₹${item.price}</td>
                                                <td style="padding: 12px; text-align: right;">₹${item.price * item.quantity}</td>
                                            </tr>`).join('')}
                                            <tr style="border-top: 2px solid #667eea;">
                                                <td colspan="3" style="padding: 12px; text-align: right; font-weight: 600;">Subtotal</td>
                                                <td style="padding: 12px; text-align: right;">₹${order.subtotal}</td>
                                            </tr>
                                            <tr>
                                                <td colspan="3" style="padding: 12px; text-align: right; font-weight: 600;">Delivery Charge</td>
                                                <td style="padding: 12px; text-align: right;">₹${order.deliveryCharge}</td>
                                            </tr>
                                            <tr style="background: #f0f9ff;">
                                                <td colspan="3" style="padding: 12px; text-align: right; font-weight: 700; color: #667eea;">Total</td>
                                                <td style="padding: 12px; text-align: right; font-weight: 700; color: #667eea;">₹${order.totalAmount}</td>
                                            </tr>
                                        </table>

                                        <p style="color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
                                            Thank you for your business! If you have any questions about this invoice, please contact us.
                                        </p>
                                    </td>
                                </tr>
                                <tr style="background: #f8f9fa; border-top: 1px solid #eee;">
                                    <td style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
                                        <p>© ${new Date().getFullYear()} SK Furniture. All rights reserved.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>`;

            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.default.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: process.env.SMTP_PORT || 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            await transporter.sendMail({
                from: `"${process.env.FROM_NAME || 'SK Furniture'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
                to: order.user.email,
                subject: `Invoice #${order._id.toString().slice(-8).toUpperCase()} - SK Furniture`,
                html: invoiceHtml
            });

            return { success: true, orderId };
        } catch (error) {
            console.error(`[INNGEST] Failed to generate invoice:`, error.message);
            return { success: false, orderId, error: error.message };
        }
    }
);

export const functions = [
    sendOrderConfirmation,
    sendOrderStatusUpdate,
    generateInvoice
];

export default functions;
