// back-end/types/AuthRequest.ts

import { Request } from 'express';

/**
 * Extended Request object that includes user information after authentication.
 * This is used by the authentication middleware to attach details about the user
 * making the request.
 */
export interface AuthRequest extends Request {
  user?: {
    id: number;             // Unique identifier for the user
    name: string;           // Name of the user
    email: string;          // Email address of the user
    role: 'user' | 'admin'; // Role of the user: 'user' (applicant) or 'admin' (recruiter)
  };
}
