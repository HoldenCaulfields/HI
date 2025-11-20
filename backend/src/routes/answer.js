import express from 'express';
import auth from '../middlewares/auth.js';
import { postAnswer, likeAnswer } from '../controllers/answerController.js';

const router = express.Router();

router.post('/', auth, postAnswer);
router.post('/:id/like', auth, likeAnswer);


export default router;