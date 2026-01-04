import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        name: String,      // snapshot
        price: Number,    // snapshot
        quantity: Number,
        image: String
    }],

    subtotal: Number,
    deliveryCharge: { type: Number, default: 0 },
    totalAmount: Number,

    paymentType: {
        type: String,
        enum: ["advance", "full"],
        required: true
    },

    status: {
        type: String,
        enum: ['pending_payment', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: "pending"
    },

    shippingAddress: {
        name: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        pincode: String
    },

    // Payment tracking fields
    paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'completed', 'failed'],
        default: 'pending'
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    remainingAmount: {
        type: Number,
        default: 0
    },
    customerEmail: String,  // From Stripe checkout

    // Invoice tracking
    invoiceSent: {
        type: Boolean,
        default: false
    },
    orderNumber: {
        type: String,
        unique: true
    },

    metadata: {
        sessionId: String  // Store Stripe session ID to prevent duplicate orders
    }
}, { timestamps: true });

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

export default mongoose.model("Order", orderSchema);
