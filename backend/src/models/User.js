import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, index: true},
    password: {type: String, default: null},
    avatar: {type: String, default: null},
    googleId: { type: String, default: null },
    isGuest: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    keywordsSearched: { type: [String], default: [] },
});

export default mongoose.model('User', UserSchema);