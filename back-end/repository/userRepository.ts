// back-end/repository/userRepository.ts

import { User } from '../model/user';
import bcrypt from 'bcryptjs';

// In-memory storage for users
const users: User[] = [];
let currentId = 1;

// Define a type that omits the password field from User
type UserWithoutPassword = Omit<User, 'password'>;

export const userRepository = {
  /**
   * Adds a new user to the repository.
   * Hashes the user's password before storing.
   * @param userData - Data for the new user (without ID).
   * @returns The newly created User object with an assigned ID.
   */
  addUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser: User = {
      id: currentId++,
      ...userData,
      password: hashedPassword,
    };
    users.push(newUser);
    return newUser;
  },

  /**
   * Retrieves a user by their email.
   * @param email - The user's email address.
   * @returns The User object if found, otherwise undefined.
   */
  getUserByEmail: (email: string): User | undefined => {
    return users.find((user) => user.email === email);
  },

  /**
   * Retrieves a user by their ID.
   * @param id - The user's unique identifier.
   * @returns The User object if found, otherwise undefined.
   */
  getUserById: (id: number): User | undefined => {
    return users.find((user) => user.id === id);
  },

  /**
   * Retrieves all users in the repository.
   * @returns An array of all User objects.
   */
  getAllUsers: (): UserWithoutPassword[] => {
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  },

  /**
   * Deletes a user by their ID.
   * @param id - The user's unique identifier.
   * @returns True if deletion was successful, otherwise false.
   */
  deleteUser: (id: number): boolean => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  },

  /**
   * Updates a user's role.
   * @param id - The user's unique identifier.
   * @param role - The new role to assign ('user' or 'admin').
   * @returns The updated User object if successful, otherwise undefined.
   */
  updateUserRole: (id: number, role: 'user' | 'admin'): User | undefined => {
    const user = users.find((user) => user.id === id);
    if (user) {
      user.role = role;
      return user;
    }
    return undefined;
  },
};
