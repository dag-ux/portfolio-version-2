import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const login = async (req: Request, res: Response) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
    const { email, password } = req.body || {};

    console.log('--- login ---');
    console.log('Secret length:', JWT_SECRET.length);
    console.log('Secret first 5 chars:', JWT_SECRET.slice(0, 5));

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      return res.status(500).json({ error: 'Server not configured' });
    }
    if (email !== adminEmail) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, adminPasswordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: adminEmail }, JWT_SECRET, { expiresIn: '7d' });
    console.log('Token signed, length:', token.length);

    res.json({ token, email: adminEmail });
  } catch (error: any) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

export const verify = async (req: any, res: Response) => {
  res.json({ valid: true, email: req.user?.email });
};