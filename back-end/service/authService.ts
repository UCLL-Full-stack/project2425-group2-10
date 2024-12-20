import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../repository/userRepository";
import { User } from "../models/user";

const secret = process.env.JWT_SECRET || "your_jwt_secret";

export const registerUser = async (
  email: string,
  password: string,
  role: "admin" | "recruiter" | "candidate"
) => {
  // Check if the role is valid
  if (!["admin", "recruiter", "candidate"].includes(role)) {
    throw new Error("Invalid role");
  }

  // Check if the email is already registered
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = await createUser({ email, password: hashedPassword, role });
  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  // Find the user by email
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: "1d" });
  return { token, user };
};