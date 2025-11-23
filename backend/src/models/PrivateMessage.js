import mongoose from 'mongoose';

const PrivateMessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true }, // format: "userId1-userId2" (sorted)
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'video', 'file'], default: 'text' },
  fileUrl: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

PrivateMessageSchema.index({ roomId: 1, createdAt: -1 });
PrivateMessageSchema.index({ receiverId: 1, isRead: 1 });

export default mongoose.model('PrivateMessage', PrivateMessageSchema);