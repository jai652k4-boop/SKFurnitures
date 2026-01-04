// Professional Email Templates

export const welcomeTemplate = (user) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Sri Velu Mess</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">🍽️ Sri Velu Mess</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Authentic South Indian Cuisine</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Welcome, ${user.name}! 🎉</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We're thrilled to have you join our family! At Sri Velu Mess, we serve authentic, home-style South Indian food prepared with love and the finest ingredients.
              </p>
              
              <div style="background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%); border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">🌟 What's waiting for you:</h3>
                <ul style="color: #666; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Pre-order your meals before arriving</li>
                  <li>Real-time order tracking</li>
                  <li>Secure online payments</li>
                  <li>Exclusive offers and discounts</li>
                </ul>
              </div>
              
              <a href="${process.env.CLIENT_URL}/menu" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 20px;">
                Explore Our Menu
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">
                📍 SK Furnitures, Erode, Tamil Nadu
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Sri Velu Mess. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Admin Order Notification Template
export const adminOrderNotificationTemplate = (order) => {
  const paymentTypeLabel = order.paymentType === 'full' ? 'Full Payment' : '50% Advance Payment';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 60px; margin-bottom: 10px;">🔔</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New Order Received!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">#${order.orderNumber}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Customer Info -->
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Customer Details</h3>
              <table style="width: 100%; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Name:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600; text-align: right;">${order.user?.name || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${order.user?.email || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Phone:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${order.user?.phone || 'N/A'}</td>
                </tr>
              </table>
              
              <!-- Order Items -->
              <h3 style="color: #333; margin: 25px 0 15px 0; font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                ${order.items.map(item => `
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 12px 0; color: #333; font-size: 14px;">${item.name}</td>
                    <td style="padding: 12px 0; color: #666; font-size: 14px; text-align: center;">× ${item.quantity}</td>
                    <td style="padding: 12px 0; color: #333; font-size: 14px; text-align: right; font-weight: 600;">₹${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </table>
              
              <!-- Order Summary -->
              <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <table style="width: 100%;">
                  ${order.deliveryCharge > 0 ? `
                    <tr>
                      <td style="padding: 5px 0; color: #666; font-size: 14px;">Subtotal:</td>
                      <td style="padding: 5px 0; color: #333; font-size: 14px; text-align: right; font-weight: 600;">₹${(order.totalAmount - order.deliveryCharge).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0; color: #666; font-size: 14px;">Delivery Charge:</td>
                      <td style="padding: 5px 0; color: #333; font-size: 14px; text-align: right; font-weight: 600;">₹${order.deliveryCharge.toFixed(2)}</td>
                    </tr>
                  ` : ''}
                  <tr style="border-top: 2px solid #ddd;">
                    <td style="padding: 12px 0 5px 0; color: #333; font-size: 16px; font-weight: 700;">Total Amount:</td>
                    <td style="padding: 12px 0 5px 0; color: #e74c3c; font-size: 18px; text-align: right; font-weight: 700;">₹${order.totalAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666; font-size: 14px;">Payment Type:</td>
                    <td style="padding: 5px 0; color: ${order.paymentType === 'full' ? '#11998e' : '#667eea'}; font-size: 14px; text-align: right; font-weight: 600;">${paymentTypeLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666; font-size: 14px;">Advance Paid:</td>
                    <td style="padding: 5px 0; color: #11998e; font-size: 14px; text-align: right; font-weight: 600;">₹${order.advanceAmount.toFixed(2)}</td>
                  </tr>
                  ${order.remainingAmount > 0 ? `
                    <tr>
                      <td style="padding: 5px 0; color: #666; font-size: 14px;">Remaining Amount:</td>
                      <td style="padding: 5px 0; color: #e74c3c; font-size: 14px; text-align: right; font-weight: 600;">₹${order.remainingAmount.toFixed(2)}</td>
                    </tr>
                  ` : `
                    <tr>
                      <td colspan="2" style="padding: 10px 0; color: #11998e; font-size: 14px; text-align: center; font-weight: 600;">✅ FULLY PAID</td>
                    </tr>
                  `}
                </table>
              </div>
              
              <!-- Preparation Time -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="color: rgba(255,255,255,0.8); margin: 0 0 5px 0; font-size: 14px;">⏱️ Estimated Preparation Time</p>
                <p style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">${order.estimatedPrepTime} minutes</p>
              </div>
              
              ${order.specialInstructions ? `
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="color: #856404; margin: 0; font-size: 14px; font-weight: 600;">📝 Special Instructions:</p>
                  <p style="color: #856404; margin: 5px 0 0 0; font-size: 14px;">${order.specialInstructions}</p>
                </div>
              ` : ''}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">
                📍 Sri Velu Mess Admin Panel
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                Order placed at: ${new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};


export const orderConfirmationTemplate = (user, order) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 60px; margin-bottom: 10px;">✅</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Order Confirmed!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">#${order.orderNumber}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Hi <strong>${user.name}</strong>, thank you for your order! We've received it and our chefs are getting ready to prepare your delicious meal.
              </p>
              
              <!-- Order Status -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="color: rgba(255,255,255,0.8); margin: 0 0 5px 0; font-size: 14px;">Estimated Preparation Time</p>
                <p style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">${order.estimatedPrepTime} minutes</p>
              </div>
              
              <!-- Order Items -->
              <h3 style="color: #333; margin: 25px 0 15px 0; font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${order.items.map(item => `
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 12px 0; color: #333; font-size: 14px;">${item.name} × ${item.quantity}</td>
                    <td style="padding: 12px 0; color: #666; font-size: 14px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
                ${order.deliveryCharge > 0 ? `
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 12px 0; color: #333; font-size: 14px;">Delivery Charge (Bulk Order)</td>
                    <td style="padding: 12px 0; color: #666; font-size: 14px; text-align: right;">₹${order.deliveryCharge.toFixed(2)}</td>
                  </tr>
                ` : ''}
                <tr>
                  <td style="padding: 15px 0; color: #333; font-size: 16px; font-weight: 700;">Total</td>
                  <td style="padding: 15px 0; color: #667eea; font-size: 18px; font-weight: 700; text-align: right;">₹${order.totalAmount.toFixed(2)}</td>
                </tr>
              </table>
              
              <!-- Payment Info -->
              <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <h4 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">💳 Payment Details</h4>
                <table style="width: 100%;">
                  <tr>
                    <td style="color: #666; padding: 5px 0; font-size: 14px;">Advance Paid (50%)</td>
                    <td style="color: #11998e; padding: 5px 0; font-size: 14px; text-align: right; font-weight: 600;">₹${order.advanceAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; padding: 5px 0; font-size: 14px;">Remaining Amount</td>
                    <td style="color: #e74c3c; padding: 5px 0; font-size: 14px; text-align: right; font-weight: 600;">₹${order.remainingAmount.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
              
              <a href="${process.env.CLIENT_URL}/orders/${order._id}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Track Your Order
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">
                📍 Sri Velu Mess, Erode, Tamil Nadu
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Sri Velu Mess. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const orderReadyTemplate = (user, order) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 60px; margin-bottom: 10px;">🍴</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Your Order is Ready!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">#${order.orderNumber}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <p style="color: #666; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
                Great news, <strong>${user.name}</strong>! 🎉<br>
                Your delicious meal is ready and waiting for you.
              </p>
              
              <div style="background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%); border-radius: 12px; padding: 25px; margin: 25px 0;">
                <p style="color: #333; font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">
                  💰 Remaining Amount to Pay
                </p>
                <p style="color: #e74c3c; font-size: 32px; font-weight: 700; margin: 0;">
                  ₹${order.remainingAmount.toFixed(2)}
                </p>
              </div>
              
              <p style="color: #999; font-size: 14px; margin: 25px 0;">
                Please collect your order from our counter.<br>
                Don't forget to pay the remaining amount!
              </p>
              
              <a href="${process.env.CLIENT_URL}/orders/${order._id}" style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View Order Details
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">
                📍 Sri Velu Mess, Erode, Tamil Nadu
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Sri Velu Mess. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const invoiceTemplate = (user, order) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); padding: 40px 30px;">
              <table style="width: 100%;">
                <tr>
                  <td>
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🍽️ Sri Velu Mess</h1>
                    <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Authentic South Indian Cuisine</p>
                  </td>
                  <td style="text-align: right;">
                    <p style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">INVOICE</p>
                    <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">#${order.orderNumber}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Customer & Order Info -->
              <table style="width: 100%; margin-bottom: 30px;">
                <tr>
                  <td style="vertical-align: top; width: 50%;">
                    <h3 style="color: #333; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Bill To</h3>
                    <p style="color: #666; font-size: 14px; margin: 0; line-height: 1.6;">
                      <strong>${user.name}</strong><br>
                      ${user.email}<br>
                      ${user.phone || ''}
                    </p>
                  </td>
                  <td style="vertical-align: top; width: 50%; text-align: right;">
                    <h3 style="color: #333; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Details</h3>
                    <p style="color: #666; font-size: 14px; margin: 0; line-height: 1.6;">
                      Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}<br>
                      Time: ${new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Items Table -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 12px; text-align: left; color: #333; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #ddd;">Item</th>
                    <th style="padding: 12px; text-align: center; color: #333; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #ddd;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #333; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #ddd;">Price</th>
                    <th style="padding: 12px; text-align: right; color: #333; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #ddd;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(item => `
                    <tr>
                      <td style="padding: 12px; color: #333; font-size: 14px; border-bottom: 1px solid #f0f0f0;">${item.name}</td>
                      <td style="padding: 12px; color: #666; font-size: 14px; text-align: center; border-bottom: 1px solid #f0f0f0;">${item.quantity}</td>
                      <td style="padding: 12px; color: #666; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">₹${item.price.toFixed(2)}</td>
                      <td style="padding: 12px; color: #333; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">₹${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <!-- Totals -->
              <table style="width: 100%; max-width: 300px; margin-left: auto;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Subtotal</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">₹${(order.totalAmount - order.deliveryCharge).toFixed(2)}</td>
                </tr>
                ${order.deliveryCharge > 0 ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Delivery Charge</td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">₹${order.deliveryCharge.toFixed(2)}</td>
                  </tr>
                ` : ''}
                <tr style="border-top: 2px solid #333;">
                  <td style="padding: 12px 0; color: #333; font-size: 18px; font-weight: 700;">Grand Total</td>
                  <td style="padding: 12px 0; color: #2c3e50; font-size: 20px; font-weight: 700; text-align: right;">₹${order.totalAmount.toFixed(2)}</td>
                </tr>
              </table>
              
              <!-- Payment Status -->
              <div style="background-color: ${order.fullyPaid ? '#d4edda' : '#fff3cd'}; border-radius: 8px; padding: 15px; margin-top: 30px; text-align: center;">
                <p style="color: ${order.fullyPaid ? '#155724' : '#856404'}; margin: 0; font-size: 14px; font-weight: 600;">
                  ${order.fullyPaid ? '✅ PAID IN FULL' : `⚠️ Remaining Balance: ₹${order.remainingAmount.toFixed(2)}`}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
                Thank you for dining with us! 🙏
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                📍 Sri Velu Mess, Erode, Tamil Nadu<br>
                © ${new Date().getFullYear()} Sri Velu Mess. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const orderStatusTemplate = (user, order, status) => {
  const statusMessages = {
    confirmed: { emoji: '✅', message: 'Your order has been confirmed!', color: '#11998e' },
    accepted: { emoji: '👨‍🍳', message: 'A chef has accepted your order!', color: '#667eea' },
    cooking: { emoji: '🍳', message: 'Your food is being prepared!', color: '#f093fb' },
    ready: { emoji: '🍴', message: 'Your order is ready for pickup!', color: '#38ef7d' },
    completed: { emoji: '🎉', message: 'Order completed. Thank you!', color: '#2c3e50' },
    cancelled: { emoji: '❌', message: 'Your order has been cancelled.', color: '#e74c3c' }
  };

  const statusInfo = statusMessages[status] || { emoji: '📋', message: 'Order status updated', color: '#666' };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: ${statusInfo.color}; padding: 40px 30px; text-align: center;">
              <div style="font-size: 60px; margin-bottom: 10px;">${statusInfo.emoji}</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">${statusInfo.message}</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Order #${order.orderNumber}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <p style="color: #666; font-size: 16px; margin: 0 0 25px 0;">
                Hi <strong>${user.name}</strong>, we wanted to let you know that your order status has been updated.
              </p>
              
              <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px; display: inline-block;">
                <p style="color: #333; margin: 0; font-size: 14px;">Current Status</p>
                <p style="color: ${statusInfo.color}; margin: 10px 0 0 0; font-size: 24px; font-weight: 700; text-transform: uppercase;">${status}</p>
              </div>
              
              <p style="margin-top: 30px;">
                <a href="${process.env.CLIENT_URL}/orders/${order._id}" style="display: inline-block; background-color: ${statusInfo.color}; color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  View Order Details
                </a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">
                📍 Sri Velu Mess, Erode, Tamil Nadu
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Sri Velu Mess. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export default {
  welcomeTemplate,
  adminOrderNotificationTemplate,
  orderConfirmationTemplate,
  orderReadyTemplate,
  invoiceTemplate,
  orderStatusTemplate
};
