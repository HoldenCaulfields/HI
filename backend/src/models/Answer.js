import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    keyword: { type: String, index: true },
    content: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Answer', AnswerSchema);