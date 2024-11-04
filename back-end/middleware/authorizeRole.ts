// back-end/middleware/authorizeRole.ts

import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/AuthRequest';

/**
 * Middleware to authorize users based on their role.
 * @param requiredRole - The role required to access the endpoint.
 */
export const authorizeRole = (requiredRole: 'user' | 'admin') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    if (user.role !== requiredRole) {
      return res.status(403).json({ message: `Forbidden: ${requiredRole} role required.` });
    }

    next();
  };
};
