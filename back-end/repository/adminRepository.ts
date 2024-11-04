// repository/adminRepository.ts

import { Admin } from '../model/admin';

const admins: Admin[] = [
  { id: 1, name: 'Admin One', email: 'admin1@example.com' },
  // Add more admins as needed
];

export const adminRepository = {
  getAdminById: (id: number): Admin | undefined => admins.find((admin) => admin.id === id),
};
