import nodemailer from 'nodemailer';

// Create reusable transporter
let transporter = null;

const createTransporter = () => {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    return transporter;
};

export const sendOrderConfirmationEmail = async (orderData) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('⚠️ [EMAIL] SMTP not configured, skipping email');
            return;
        }

        const transport = createTransporter();
        const { order, customerEmail } = orderData;

        // Create beautiful email HTML
        const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 50px 40px;
            text-align: center;
        }
        
        .success-icon {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            font-size: 48px;
        }
        
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 10px 0;
        }
        
        .content { padding: 40px; }
        
        .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .message {
            color: #6b7280;
            margin-bottom: 30px;
        }
        
        .info-box {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .order-details {
            background: #ffffff;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
        }
        
        .order-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 2px dashed #e5e7eb;
        }
        
        .order-number {
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
        }
        
        .item-row {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .total-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #667eea;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
        
        .total-row.final {
            font-size: 22px;
            font-weight: 700;
            color: #667eea;
            padding-top: 15px;
        }
        
        .payment-status {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 2px solid #86efac;
            border-radius: 12px;
            padding: 25px;
            margin-top: 25px;
        }
        
        .payment-status.partial {
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border-color: #fcd34d;
        }
        
        .badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
        }
        
        .badge-success {
            background: #10b981;
            color: white;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .badge-warning {
            background: #f59e0b;
            color: white;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        
        .footer {
            background: #1f2937;
            color: #9ca3af;
            text-align: center;
            padding: 30px 40px;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="success-icon">🎉</div>
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase</p>
        </div>
        
        <div class="content">
            <p class="greeting">Hi ${order.shippingAddress.name},</p>
            <p class="message">Your order has been confirmed and will be delivered to your address.</p>
            
            <div class="info-box">
                <strong>📍 Delivery Address</strong><br>
                <p style="margin-top: 8px;">${order.shippingAddress.street}<br>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>Phone: ${order.shippingAddress.phone}</p>
            </div>
            
            <div class="order-details">
                <div class="order-header">
                    <div class="order-number">Order #${order._id.toString().slice(-8).toUpperCase()}</div>
                    <div style="color: #9ca3af;">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                
                ${order.items.map(item => `<div class="item-row"><span>${item.name} × ${item.quantity}</span><span>₹${item.price * item.quantity}</span></div>`).join('')}
                
                <div class="total-section">
                    <div class="total-row"><span>Subtotal</span><span>₹${order.subtotal}</span></div>
                    <div class="total-row"><span>Delivery</span><span>${order.deliveryCharge === 0 ? 'FREE' : '₹' + order.deliveryCharge}</span></div>
                    <div class="total-row final"><span>Total</span><span>₹${order.totalAmount}</span></div>
                </div>
                
                <div class="payment-status ${order.paymentStatus === 'partial' ? 'partial' : ''}">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="font-weight: 600;">💳 Payment Status</span>
                        <span class="badge ${order.paymentStatus === 'completed' ? 'badge-success' : 'badge-warning'}">${order.paymentStatus === 'completed' ? 'Fully Paid' : 'Partially Paid'}</span>
                    </div>
                    <div style="display: flex; justify-between; padding: 8px 0;"><span>Paid Amount</span><span style="color: #10b981; font-weight: 700;">₹${order.paidAmount}</span></div>
                    ${order.remainingAmount > 0 ? `<div style="display: flex; justify-between; padding: 8px 0;"><span>Remaining</span><span style="color: #f59e0b; font-weight: 700;">₹${order.remainingAmount}</span></div>` : ''}
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong style="color: #fff;">SK Furniture</strong></p>
            <p>&copy; ${new Date().getFullYear()} SK Furniture. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

        const mailOptions = {
            from: `"${process.env.FROM_NAME || 'SK Furniture'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
            to: customerEmail,
            subject: `Order Confirmation #${order._id.toString().slice(-8).toUpperCase()}`,
            html: emailHtml
        };

        await transport.sendMail(mailOptions);
        console.log(`✅ [EMAIL] Order confirmation sent to ${customerEmail}`);
    } catch (error) {
        console.error('❌ [EMAIL] Error sending email:', error.message);
    }
};

export const sendInvoiceEmail = async (orderData) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('⚠️ [EMAIL] SMTP not configured, skipping invoice email');
            return;
        }

        const transport = createTransporter();
        const { order, customerEmail } = orderData;

        // Create invoice email HTML
        const invoiceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
        }
        
        .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
        }
        
        .header h1 {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 14px;
        }
        
        .content { padding: 40px; }
        
        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .bill-to {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        .items-table th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #667eea;
        }
        
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .total-section {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
        
        .total-row.final {
            font-size: 22px;
            font-weight: 700;
            color: #667eea;
            padding-top: 15px;
            border-top: 2px solid #667eea;
            margin-top: 10px;
        }
        
        .footer {
            background: #1f2937;
            color: #9ca3af;
            text-align: center;
            padding: 30px 40px;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>📄 INVOICE</h1>
            <p>SK Furniture - Your Trusted Furniture Partner</p>
        </div>
        
        <div class="content">
            <div class="invoice-info">
                <div>
                    <strong>Invoice #</strong><br>
                    <span style="font-size: 18px; color: #667eea; font-weight: 700;">${order.orderNumber || order._id.toString().slice(-8).toUpperCase()}</span>
                </div>
                <div style="text-align: right;">
                    <strong>Date</strong><br>
                    ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>
            
            <div class="bill-to">
                <strong style="font-size: 16px; margin-bottom: 10px; display: block;">📍 Bill To:</strong>
                <p style="margin: 0;">
                    <strong>${order.shippingAddress.name}</strong><br>
                    ${order.shippingAddress.street}<br>
                    ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>
                    Phone: ${order.shippingAddress.phone}
                </p>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Price</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td style="text-align: center;">${item.quantity}</td>
                        <td style="text-align: right;">₹${item.price.toLocaleString()}</td>
                        <td style="text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
            
            <div class="total-section">
                <div class="total-row"><span>Subtotal</span><span>₹${order.subtotal.toLocaleString()}</span></div>
                <div class="total-row"><span>Delivery Charge</span><span>${order.deliveryCharge === 0 ? 'FREE' : '₹' + order.deliveryCharge}</span></div>
                <div class="total-row final"><span>Total Amount</span><span>₹${order.totalAmount.toLocaleString()}</span></div>
            </div>
            
            <p style="margin-top: 30px; color: #6b7280; font-size: 14px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                Thank you for your business! If you have any questions about this invoice, please contact us at ${process.env.FROM_EMAIL || process.env.SMTP_USER}.
            </p>
        </div>
        
        <div class="footer">
            <p><strong style="color: #fff;">SK Furniture</strong></p>
            <p>&copy; ${new Date().getFullYear()} SK Furniture. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

        const mailOptions = {
            from: `"${process.env.FROM_NAME || 'SK Furniture'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
            to: customerEmail,
            subject: `Invoice #${order.orderNumber || order._id.toString().slice(-8).toUpperCase()} - SK Furniture`,
            html: invoiceHtml
        };

        await transport.sendMail(mailOptions);
        console.log(`✅ [EMAIL] Invoice sent to ${customerEmail}`);
    } catch (error) {
        console.error('❌ [EMAIL] Error sending invoice:', error.message);
        throw error; // Re-throw so the controller can handle it
    }
};

export default { sendOrderConfirmationEmail, sendInvoiceEmail };