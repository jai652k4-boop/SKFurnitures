import mongoose from "mongoose";

const chatConversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null  // Null for guest users
    },
    sessionId: {
        type: String,
        unique: true,
        sparse: true,  // Allow null values
        index: true
    },
    messages: [{
        role: {
            type: String,
            enum: ["user", "assistant", "system"],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for faster queries
chatConversationSchema.index({ user: 1, isActive: 1 });
chatConversationSchema.index({ sessionId: 1, isActive: 1 });

export default mongoose.model("ChatConversation", chatConversationSchema);
