
import SearchKeyword from '../models/SearchKeyword.js';
import Answer from '../models/Answer.js';
import Group from '../models/Group.js';

async function search(req, res) {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: 'Query required' });

        const query = q.toLowerCase().trim();

        // Find users who searched similar terms
        const users = await User.find({
            $or: [
                { 'searchHistory.query': { $regex: query, $options: 'i' } },
                { interests: { $in: [query] } }
            ]
        }).limit(20).select('username avatar bio interests');

        // Find relevant groups
        const groups = await Group.find({
            $or: [
                { query: { $regex: query, $options: 'i' } },
                { tags: { $in: [query] } },
                { name: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        // Find answers to similar questions
        const answers = await Answer.find({
            $or: [
                { query: { $regex: query, $options: 'i' } },
                { question: { $regex: query, $options: 'i' } }
            ]
        }).populate('author', 'username avatar').limit(10);

        res.json({
            users,
            groups: groups.map(g => ({
                id: g._id,
                name: g.name,
                members: g.members.length,
                tags: g.tags,
                onlineCount: g.onlineCount || 0
            })),
            answers: answers.map(a => ({
                id: a._id,
                question: a.question,
                content: a.content.substring(0, 200),
                author: a.author.username,
                likes: a.likes.length,
                loves: a.loves.length
            }))
        });

        // Save to user's search history (if authenticated)
        if (req.user) {
            await User.findByIdAndUpdate(req.user.id, {
                $push: {
                    searchHistory: {
                        query,
                        timestamp: new Date()
                    }
                }
            });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function trending(req, res) {
    try {
        const trends = await User.aggregate([
            { $unwind: '$searchHistory' },
            {
                $group: {
                    _id: '$searchHistory.query',
                    count: { $sum: 1 },
                    lastSearch: { $max: '$searchHistory.timestamp' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);

        res.json(trends.map(t => ({
            keyword: t._id,
            count: t.count,
            trend: '+' + Math.floor(Math.random() * 30) + '%' // Mock trend
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export { search, trending };