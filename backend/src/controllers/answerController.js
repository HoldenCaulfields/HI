import Answer from '../models/Answer.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export async function createAnswer(req, res) {
    try {
        const { question, query, content } = req.body;
        const userId = req.user.id;
        
        if (!question || !content) {
            return res.status(400).json({ error: 'Question and content required' });
        }

        const user = await User.findById(userId);
        
        const answer = await Answer.create({
            question,
            query: query || '',
            content,
            author: userId,
            authorName: user.username
        });

        res.status(201).json(answer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function likeAnswer(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const answer = await Answer.findById(id);
        if (!answer) return res.status(404).json({ error: 'Answer not found' });

        const idx = answer.likes.indexOf(userId);
        if (idx > -1) {
            answer.likes.splice(idx, 1);
        } else {
            answer.likes.push(userId);
            
            // Give reputation to author
            if (answer.author.toString() !== userId) {
                await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 1 } });
                
                // Notify author
                await Notification.create({
                    userId: answer.author,
                    type: 'answer_liked',
                    title: 'Someone liked your answer',
                    message: `Your answer to "${answer.question}" received a like!`,
                    link: `/answers/${answer._id}`
                });
            }
        }

        await answer.save();
        res.json({ likesCount: answer.likes.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function loveAnswer(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const answer = await Answer.findById(id);
        if (!answer) return res.status(404).json({ error: 'Answer not found' });

        const idx = answer.loves.indexOf(userId);
        if (idx > -1) {
            answer.loves.splice(idx, 1);
        } else {
            answer.loves.push(userId);
            
            if (answer.author.toString() !== userId) {
                await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 2 } });
                
                await Notification.create({
                    userId: answer.author,
                    type: 'answer_liked',
                    title: 'Someone loved your answer! ❤️',
                    message: `Your answer to "${answer.question}" received love!`,
                    link: `/answers/${answer._id}`
                });
            }
        }

        await answer.save();
        res.json({ lovesCount: answer.loves.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function addComment(req, res) {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content) return res.status(400).json({ error: 'Content required' });

        const answer = await Answer.findById(id);
        if (!answer) return res.status(404).json({ error: 'Answer not found' });

        const user = await User.findById(userId);
        
        answer.comments.push({
            author: userId,
            authorName: user.username,
            content,
            timestamp: new Date()
        });

        await answer.save();

        // Notify answer author
        if (answer.author.toString() !== userId) {
            await Notification.create({
                userId: answer.author,
                type: 'answer_commented',
                title: 'New comment on your answer',
                message: `${user.username} commented: "${content.substring(0, 50)}..."`,
                link: `/answers/${answer._id}`
            });
        }

        res.json(answer.comments[answer.comments.length - 1]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getAnswersByQuery(req, res) {
    try {
        const { query } = req.params;
        const { limit = 20, sort = 'hot' } = req.query;

        let sortOption = {};
        if (sort === 'hot') sortOption = { likesCount: -1, lovesCount: -1 };
        else if (sort === 'new') sortOption = { createdAt: -1 };
        else if (sort === 'top') sortOption = { likesCount: -1 };

        const answers = await Answer.find({
            $or: [
                { query: { $regex: query, $options: 'i' } },
                { question: { $regex: query, $options: 'i' } }
            ]
        })
        .sort(sortOption)
        .limit(parseInt(limit))
        .populate('author', 'username avatar reputation')
        .lean();

        res.json(answers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}