import Answer from '../models/Answer.js';


async function postAnswer(req, res) {
    const { keyword, content } = req.body;
    if (!keyword || !content) return res.status(400).json({ error: 'keyword & content required' });
    const senderId = req.user ? req.user._id : null;
    const ans = await Answer.create({ keyword: keyword.toLowerCase().trim(), content, senderId });
    return res.json({ answer: ans });
}


async function likeAnswer(req, res) {
    const id = req.params.id;
    const ans = await Answer.findByIdAndUpdate(id, { $inc: { score: 1 } }, { new: true });
    if (!ans) return res.status(404).json({ error: 'not found' });
    return res.json({ answer: ans });
}

export { postAnswer, likeAnswer };