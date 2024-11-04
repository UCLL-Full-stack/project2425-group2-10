// back-end/middleware/authorizeRole.ts

import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/AuthRequest';

export const authorizeRole = (role: 'user' | 'admin') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: `Forbidden: Only ${role}s can access this route.` });
    }
    next();
  };
};
