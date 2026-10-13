import express from 'express';
import { getMessages, markAsRead, deleteMessage, unreadCount } from '../controllers/message.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.get('/', requireAuth, getMessages);
router.get('/unread-count', requireAuth, unreadCount);
router.patch('/:id/read', requireAuth, markAsRead);
router.delete('/:id', requireAuth, deleteMessage);
export default router;
