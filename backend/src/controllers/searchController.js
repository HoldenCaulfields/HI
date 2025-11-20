
import SearchKeyword from '../models/SearchKeyword.js';
import Answer from '../models/Answer.js';
import Group from '../models/Group.js';

async function search(req, res) {
    const q = (req.query.q || '').toLowerCase().trim();
    if (!q) return res.status(400).json({ error: 'q required' });


    // increment or create keyword
    const kw = await SearchKeyword.findByIdAndUpdate(q, { $inc: { count: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true });


    // find top answers
    const topAnswers = await Answer.find({ keyword: q }).sort({ score: -1 }).limit(10).lean();


    // find related groups (by keyword in group.keywords or name)
    const relatedGroups = await Group.find({ keywords: q }).limit(10).lean();


    return res.json({ keyword: q, count: kw.count, topAnswers, relatedGroups });
}


async function trending(req, res) {
    const top = await SearchKeyword.find().sort({ count: -1 }).limit(20).lean();
    return res.json({ trending: top });
}


export { search, trending };