import express from 'express';
import auth  from '../middlewares/auth.js';
import  { listTrendingGroups, getGroupMessages, postMessage } from '../controllers/groupController.js';

const router = express.Router();

router.get('/trending', listTrendingGroups);
router.get('/:id/messages', getGroupMessages);
router.post('/:id/messages', auth, postMessage);


export default router;