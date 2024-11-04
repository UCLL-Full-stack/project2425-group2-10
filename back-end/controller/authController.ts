import jwt from 'jsonwebtoken';
import { adminRepository } from '../repository/adminRepository';
import bcrypt from 'bcryptjs';
import { Response, Request } from 'express';

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const admin = adminRepository.getAdminByEmail(email);
  
  if (!admin) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, admin.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  res.json({ token, message: 'Login successful.' });
};
