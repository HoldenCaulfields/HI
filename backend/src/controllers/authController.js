
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import sign from '../utils/jwt.js';

async function guestLogin(req, res) {
    // Accepts { username }
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'username required' });
    // Create or reuse guest user
    let user = await User.findOne({ username });
    if (!user) {
        user = await User.create({ username, isGuest: true });
    }
    const token = sign(user);
    return res.json({ user: { id: user._id, username: user.username, isGuest: user.isGuest }, token });
}


async function register(req, res) {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username & password required' });
    const existing = await User.findOne({ username });
    if (existing && existing.password) return res.status(400).json({ error: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    let user;
    if (existing) {
        existing.password = hash;
        existing.isGuest = false;
        await existing.save();
        user = existing;
    } else {
        user = await User.create({ username, password: hash, isGuest: false });
    }
    const token = sign(user);
    return res.json({ user: { id: user._id, username: user.username }, token });
}

/* async function login(req, res) {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.isGuest) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, username: user.username } });
} */

export { guestLogin, register };