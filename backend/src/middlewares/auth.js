
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/User.js';


async function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'No token' });
    const token = header.replace('Bearer ', '');
    try {
        const payload = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(payload.id).lean();
        if (!user) return res.status(401).json({ error: 'User not found' });
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

export default authMiddleware;