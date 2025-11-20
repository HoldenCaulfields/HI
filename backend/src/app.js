
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import searchRoutes from './routes/search.js';
import groupRoutes from './routes/group.js';
import answerRoutes from './routes/answer.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//routes:
app.use('/auth', authRoutes);
app.use('/search', searchRoutes);
app.use('/groups', groupRoutes);
app.use('/answers', answerRoutes);

app.get('/', (req, res) => res.json({ok: true, service: 'HxI Backend'}));

export default app;