import express from 'express';
import {
    createAnswer,
    likeAnswer,
    loveAnswer,
    addComment,
    getAnswersByQuery
} from '../controllers/answerController.js';
import { authRequired, authOptional } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authRequired, createAnswer);
router.post('/:id/like', authRequired, likeAnswer);
router.post('/:id/love', authRequired, loveAnswer);
router.post('/:id/comment', authRequired, addComment);
router.get('/query/:query', authOptional, getAnswersByQuery);

export default router;