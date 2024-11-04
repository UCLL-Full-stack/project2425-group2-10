// back-end/controller/authController.ts

import { Request, Response } from 'express';
import { userRepository } from '../repository/userRepository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Registers a new user.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = userRepository.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const newUser = await userRepository.addUser({ name, email, password, role });

    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Logs in a user.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = userRepository.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
