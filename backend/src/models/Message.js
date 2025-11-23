import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderName: String, // cache để không phải populate
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'video', 'file'], default: 'text' },
  fileUrl: String, // nếu type là image/video/file
  isDeleted: { type: Boolean, default: false },
  reactions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'] }
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

MessageSchema.index({ groupId: 1, createdAt: -1 });

export default mongoose.model('Message', MessageSchema);