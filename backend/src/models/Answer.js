import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  query: { type: String, required: true }, // từ khóa search gốc
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: String, // cache
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  loves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  lovesCount: { type: Number, default: 0 },
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  isBestAnswer: { type: Boolean, default: false }, // voted by community
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Middleware để cập nhật counts
AnswerSchema.pre('save', function(next) {
  if (this.isModified('likes')) this.likesCount = this.likes.length;
  if (this.isModified('loves')) this.lovesCount = this.loves.length;
  next();
});

AnswerSchema.index({ query: 1, likesCount: -1 });
AnswerSchema.index({ author: 1 });

export default mongoose.model('Answer', AnswerSchema);