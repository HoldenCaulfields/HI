import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String }, // null for guest users
  email: { type: String, sparse: true },
  isGuest: { type: Boolean, default: false },
  avatar: { type: String, default: null },
  bio: { type: String, maxlength: 500 },
  interests: [{ type: String }], // tags user quan tâm
  searchHistory: [{
    query: String,
    timestamp: { type: Date, default: Date.now }
  }],
  reputation: { type: Number, default: 0 }, // points từ answers được liked
  createdAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

// Index để tìm kiếm nhanh
UserSchema.index({ username: 1 });
UserSchema.index({ 'searchHistory.query': 1 });
UserSchema.index({ interests: 1 });

export default mongoose.model('User', UserSchema);