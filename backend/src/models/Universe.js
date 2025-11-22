import mongoose from "mongoose";

const NodeSchema = new mongoose.Schema({
  id: String,
  label: String,
  type: String, // ROOT, ANSWER, USER, GROUP, KEYWORD
  x: Number,
  y: Number,
  vx: { type: Number, default: 0 },
  vy: { type: Number, default: 0 },
  radius: Number,
  val: Number,
  color: String,
  details: String,
  img: String
});

const LinkSchema = new mongoose.Schema({
  source: String,
  target: String,
  value: Number
});

const ThemeSchema = new mongoose.Schema({
  name: String,
  background: String,
  lineColor: String,
  particleColor: String,
  fontColor: String,
  vibeDescription: String,
  // Changed from Map to Object to ensure correct JSON serialization to client
  nodeColors: {
    ROOT: String,
    ANSWER: String,
    USER: String,
    GROUP: String,
    KEYWORD: String
  }
});

const UniverseSchema = new mongoose.Schema({
  query: { type: String, unique: true, required: true },
  theme: ThemeSchema,
  nodes: [NodeSchema],
  links: [LinkSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Universe', UniverseSchema);