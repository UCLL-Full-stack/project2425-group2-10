import { Prisma } from "@prisma/client"; // Import the Prisma types
import prisma from "../prismaClient"; // Import the Prisma client

/**
 * Create a new user in the database.
 * @param userData - The user data, using Prisma's UserCreateInput type.
 * @returns The newly created user.
 */
export const createUser = async (userData: Prisma.UserCreateInput) => {
  return await prisma.user.create({ data: userData });
};

/**
 * Find a user by email.
 * @param email - The user's email.
 * @returns The user if found, otherwise null.
 */
export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

/**
 * Find a user by ID.
 * @param id - The user's ID.
 * @returns The user if found, otherwise null.
 */
export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};