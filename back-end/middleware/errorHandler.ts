// back-end/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handling middleware.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Unhandled Error:', err);

  // Customize error response based on error type or properties
  res.status(500).json({ message: 'Internal Server Error.' });
};
