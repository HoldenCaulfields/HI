import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['new_message', 'answer_liked', 'answer_commented', 'new_follower', 'group_invite'],
    required: true 
  },
  title: String,
  message: String,
  link: String, // URL to navigate to
  isRead: { type: Boolean, default: false },
  metadata: mongoose.Schema.Types.Mixed, // extra data
  createdAt: { type: Date, default: Date.now }
});

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export default mongoose.model('Notification', NotificationSchema);