// back-end/middleware/authenticateUser.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repository/userRepository';
import { UserInfo } from '../model/userInfo';

/**
 * Middleware to authenticate users based on JWT tokens.
 */
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET as string;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: 'user' | 'admin' };

    const user = userRepository.getUserById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: 'Forbidden: User not found.' });
    }

    // Attach user information to the request object, including role
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role, // Include the role property
    };

    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};
