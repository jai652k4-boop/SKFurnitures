import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    size: { type: String, enum: ["x", "l", "s"], required: false },
    isActive: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    purchaseCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
