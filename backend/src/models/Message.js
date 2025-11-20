import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['text', 'image', 'video', 'link'], default: 'text' },
    content: { type: String },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', MessageSchema);