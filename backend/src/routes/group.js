import express from 'express';
import { listTrendingGroups, getGroupMessages, postMessage } from '../controllers/groupController.js';
import { authRequired, authOptional } from '../middlewares/auth.js';

const router = express.Router();

router.get('/trending', listTrendingGroups);
router.get('/:id/messages', authOptional, getGroupMessages);
router.post('/:id/messages', authRequired, postMessage);

export default router;