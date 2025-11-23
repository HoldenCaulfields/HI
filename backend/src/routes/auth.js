import express from 'express';
import { guestLogin, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/guest', guestLogin);
router.post('/register', register);

export default router;