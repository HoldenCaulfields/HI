import express from 'express';
import {
    getNotifications,
    markAsRead,
    markAllAsRead
} from '../controllers/notificationController.js';
import { authRequired } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authRequired, getNotifications);
router.patch('/:id/read', authRequired, markAsRead);
router.patch('/read-all', authRequired, markAllAsRead);

export default router;