import { PrismaClient } from "@prisma/client";
import { Admin } from "../models/user"; // Ensure this is the correct path to your models

let admins: Admin[] = [];
let nextAdminId = 1; // This will now represent unique string-based IDs

/**
 * Repository for managing admins.
 */
export const adminRepository = {
    /**
     * Adds a new admin to the repository.
     * @param adminData - Admin details without the ID and createdAt.
     * @returns The newly added admin with an assigned ID and timestamp.
     */
    addAdmin: (adminData: Omit<Admin, "id" | "createdAt">): Admin => {
      const newAdmin: Admin = {
        ...adminData,
        id: `admin-${nextAdminId++}`,
        createdAt: new Date(), // Automatically generate createdAt
      };
      admins.push(newAdmin);
      return newAdmin;
    },
  
    /**
     * Retrieves an admin by ID.
     * @param id - Admin's ID.
     * @returns The admin if found, otherwise undefined.
     */
    getAdminById: (id: string): Admin | undefined => admins.find((admin) => admin.id === id),
  
    /**
     * Retrieves all admins.
     * @returns An array of admins.
     */
    getAllAdmins: (): Admin[] => admins,
  };