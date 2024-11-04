// middleware/verifyAdmin.ts

import { Request, Response, NextFunction } from 'express';
import { adminRepository } from '../repository/adminRepository';

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { adminId } = req.body;

  if (!adminId) {
    return res.status(400).json({ message: 'adminId is required.' });
  }

  const admin = adminRepository.getAdminById(adminId);

  if (!admin) {
    return res.status(404).json({ message: 'Admin not found.' });
  }

  next();
};
