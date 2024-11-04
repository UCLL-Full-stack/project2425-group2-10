// back-end/repository/adminRepository.ts

import { Admin } from '../model/admin';
import bcrypt from 'bcryptjs';

// In-memory storage for admins (for demonstration purposes)
const admins: Admin[] = [
  {
    id: 1,
    name: 'Admin One',
    email: 'admin1@example.com',
    password: bcrypt.hashSync('letmeshinehahaha', 10), // Password: password123
  },
  // Add more admins as needed
];

/**
 * Repository object for admin-related database operations.
 */
export const adminRepository = {
  /**
   * Retrieves an admin by their email.
   * @param email - The admin's email address.
   * @returns The Admin object if found, otherwise undefined.
   */
  getAdminByEmail: (email: string): Admin | undefined =>
    admins.find((admin) => admin.email === email),

  /**
   * Retrieves an admin by their ID.
   * @param id - The admin's unique identifier.
   * @returns The Admin object if found, otherwise undefined.
   */
  getAdminById: (id: number): Admin | undefined =>
    admins.find((admin) => admin.id === id),

  /**
   * Adds a new admin to the repository.
   * @param adminData - The admin data without the ID.
   * @returns The newly created Admin object with an assigned ID.
   */
  addAdmin: (adminData: Omit<Admin, 'id'>): Admin => {
    const newAdmin: Admin = { id: admins.length + 1, ...adminData };
    admins.push(newAdmin);
    return newAdmin;
  },
};
