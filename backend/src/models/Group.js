import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    keywords: { type: [String], default: [] },
    membersCount: { type: Number, default: 0 },
    activeNow: { type: Number, default: 0 },
    lastMessageAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Group', GroupSchema);