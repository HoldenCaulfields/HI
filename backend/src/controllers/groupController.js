
import Group from '../models/Group.js';
import Message from '../models/Message.js';

async function listTrendingGroups(req, res) {
    const groups = await Group.find().sort({ membersCount: -1, activeNow: -1 }).limit(20).lean();
    return res.json({ groups });
}


async function getGroupMessages(req, res) {
    const groupId = req.params.id;
    const messages = await Message.find({ groupId }).sort({ createdAt: -1 }).limit(100).lean();
    return res.json({ messages });
}


async function postMessage(req, res) {
    const groupId = req.params.id;
    const { content, type } = req.body;
    const senderId = req.user ? req.user._id : null;
    const msg = await Message.create({ groupId, senderId, content, type: type || 'text' });
    // TODO: update group lastMessageAt, activeNow
    return res.json({ message: msg });
}

export { listTrendingGroups, getGroupMessages, postMessage };