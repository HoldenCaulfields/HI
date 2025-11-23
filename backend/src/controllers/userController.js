import User from '../models/User.js';
import Answer from '../models/Answer.js';

export async function getUserProfile(req, res) {
    try {
        const { username } = req.params;
        
        const user = await User.findOne({ username })
            .select('-password')
            .lean();
        
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Get user's answers
        const answers = await Answer.find({ author: user._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        res.json({
            ...user,
            answersCount: answers.length,
            recentAnswers: answers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function updateProfile(req, res) {
    try {
        const userId = req.user.id;
        const { bio, interests, avatar } = req.body;

        const updates = {};
        if (bio !== undefined) updates.bio = bio;
        if (interests !== undefined) updates.interests = interests;
        if (avatar !== undefined) updates.avatar = avatar;

        const user = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getTopUsers(req, res) {
    try {
        const { limit = 20 } = req.query;

        const users = await User.find({ isGuest: false })
            .sort({ reputation: -1 })
            .limit(parseInt(limit))
            .select('username avatar bio reputation')
            .lean();

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
