// back-end/middleware/authMiddleware.ts

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { adminRepository } from '../repository/adminRepository';
import { Admin } from '../model/admin';

/**
 * Middleware to authenticate admin users by verifying JWT tokens.
 * Attaches the admin ID to the request object upon successful verification.
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and properly formatted
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    // Retrieve the admin using the extracted ID
    const admin: Admin | undefined = adminRepository.getAdminById(decoded.id);

    if (!admin) {
      return res.status(403).json({ message: 'Forbidden: Admin not found.' });
    }

    // Attach the admin ID to the request object
    req.adminId = admin.id;

    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};
