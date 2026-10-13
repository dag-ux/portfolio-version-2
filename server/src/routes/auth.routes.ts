import express from 'express';
import { login, verify } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.post('/login', login);
router.get('/verify', requireAuth, verify);
export default router;
