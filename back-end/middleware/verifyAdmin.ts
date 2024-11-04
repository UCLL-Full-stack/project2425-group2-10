// back-end/middleware/verifyAdmin.ts

import { Response, NextFunction } from 'express';
import { Request } from 'express';
import { adminRepository } from '../repository/adminRepository';
import { AdminInfo } from '../model/admin';

/**
 * Middleware to verify that the admin attached to the request exists.
 * Attaches full admin information to the request object upon successful verification.
 */
export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminId = req.adminId;

  // Check if admin ID is present
  if (!adminId) {
    return res.status(401).json({ message: 'Unauthorized: Admin ID missing.' });
  }

  // Retrieve the full admin information using the admin ID
  const admin = adminRepository.getAdminById(adminId);

  if (!admin) {
    return res.status(403).json({ message: 'Forbidden: Admin not found.' });
  }

  // Attach full admin information to the request object
  req.admin = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
  };

  next();
};
