// back-end/repository/adminRepository.ts

import { Admin } from '../model/admin';

let admins: Admin[] = [];
let nextAdminId = 1;

/**
 * Repository for managing admins.
 */
export const adminRepository = {
    /**
     * Adds a new admin to the repository.
     * @param adminData - Admin details without the ID.
     * @returns The newly added admin with an assigned ID.
     */
    addAdmin: (adminData: Omit<Admin, 'id'>): Admin => {
        const newAdmin: Admin = { ...adminData, id: nextAdminId++ };
        admins.push(newAdmin);
        return newAdmin;
    },
    /**
     * Retrieves an admin by ID.
     * @param id - Admin's ID.
     * @returns The admin if found, otherwise undefined.
     */
    getAdminById: (id: number): Admin | undefined => admins.find((admin) => admin.id === id),
    /**
     * Retrieves all admins.
     * @returns An array of admins.
     */
    getAllAdmins: (): Admin[] => admins,
};
