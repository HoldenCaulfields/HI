import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  query: { type: String, required: true }, // từ khóa gốc
  description: { type: String, maxlength: 1000 },
  tags: [{ type: String }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  membersCount: { type: Number, default: 0 },
  activeNow: { type: Number, default: 0 }, // số người online
  avatar: { type: String },
  coverImage: { type: String },
  isPrivate: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastMessageAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Middleware để tự động cập nhật membersCount
GroupSchema.pre('save', function(next) {
  if (this.isModified('members')) {
    this.membersCount = this.members.length;
  }
  next();
});

GroupSchema.index({ query: 1 });
GroupSchema.index({ tags: 1 });
GroupSchema.index({ membersCount: -1, activeNow: -1 });

export default mongoose.model('Group', GroupSchema);