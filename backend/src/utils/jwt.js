import jwt from 'jsonwebtoken';
import 'dotenv/config';


export default function sign(user) {
    return jwt.sign(
        { 
            id: user._id, 
            username: user.username 
        },
        process.env.JWT_SECRET,
        { expiresIn: user.isGuest ? '24h' : '7d' }
    );
}

export function verify(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}
