import Notification from '../models/Notification.js';

export async function getNotifications(req, res) {
    try {
        const userId = req.user.id;
        const { limit = 50, unreadOnly = false } = req.query;

        const query = { userId };
        if (unreadOnly === 'true') query.isRead = false;

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function markAsRead(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) return res.status(404).json({ error: 'Notification not found' });

        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function markAllAsRead(req, res) {
    try {
        const userId = req.user.id;

        await Notification.updateMany(
            { userId, isRead: false },
            { isRead: true }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}