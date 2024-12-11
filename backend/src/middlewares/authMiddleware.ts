import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ errorMessage: 'Access token is required' });
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET ?? '');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ errorMessage: 'Invalid or expired token' });
  }
};