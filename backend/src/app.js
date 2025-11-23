
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import searchRoutes from './routes/search.js';
import groupRoutes from './routes/group.js';
import answerRoutes from './routes/answer.js';
import userRoutes from './routes/user.js';
import notificationRoutes from './routes/notification.js';

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/search', searchRoutes);
app.use('/groups', groupRoutes);
app.use('/answers', answerRoutes);
app.use('/users', userRoutes);
app.use('/notifications', notificationRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ 
        ok: true, 
        service: 'HxI Backend',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

export default app;