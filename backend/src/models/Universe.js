import mongoose from 'mongoose';

const UniverseSchema = new mongoose.Schema({
  query: { type: String, required: true, unique: true },
  nodes: [{
    id: String,
    label: String,
    type: { type: String, enum: ['ROOT', 'USER', 'GROUP', 'ANSWER', 'KEYWORD'] },
    x: Number,
    y: Number,
    vx: { type: Number, default: 0 },
    vy: { type: Number, default: 0 },
    radius: Number,
    color: String,
    details: String,
    refId: mongoose.Schema.Types.ObjectId // reference to User/Group/Answer
  }],
  links: [{
    source: String,
    target: String
  }],
  theme: {
    background: String,
    bgGradient: String,
    lineColor: String,
    fontColor: String,
    particleColor: String,
    vibeDescription: String,
    nodeColors: {
      ROOT: String,
      USER: String,
      GROUP: String,
      ANSWER: String
    }
  },
  activeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  visitCount: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

UniverseSchema.index({ query: 1 });

export default mongoose.model('Universe', UniverseSchema);