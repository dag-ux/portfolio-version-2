import { Request, Response } from 'express';
import { Message } from '../models/Message.js';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update', details: error.message });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete', details: error.message });
  }
};

export const unreadCount = async (req: Request, res: Response) => {
  try {
    const count = await Message.countDocuments({ isRead: false });
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to count', details: error.message });
  }
};
