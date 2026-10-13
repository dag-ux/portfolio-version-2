import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface AuthRequest extends Request {
  user?: { email: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
  const authHeader = req.headers.authorization;

  console.log('--- requireAuth ---');
  console.log('Path:', req.originalUrl);
  console.log('Secret length:', JWT_SECRET.length);
  console.log('Secret first 5 chars:', JWT_SECRET.slice(0, 5));
  console.log('Header present:', !!authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET) as { email: string };
    console.log('Token verified OK:', decoded.email);
    req.user = { email: decoded.email };
    next();
  } catch (err) {
    console.error('JWT verify failed:', err instanceof Error ? err.message : err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}