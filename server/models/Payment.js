import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: Number,
    paymentType: {
        type: String,
        enum: ["advance", "full", "remaining"]
    },
    method: {
        type: String,
        enum: ["stripe", "cash"],
        default: "stripe"
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    stripePaymentIntentId: String
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
