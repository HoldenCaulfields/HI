import express from 'express';
import {
    getUserProfile,
    updateProfile,
    getTopUsers
} from '../controllers/userController.js';
import { authRequired, authOptional } from '../middlewares/auth.js';

const router = express.Router();

router.get('/top', getTopUsers);
router.get('/:username', authOptional, getUserProfile);
router.patch('/profile', authRequired, updateProfile);

export default router;