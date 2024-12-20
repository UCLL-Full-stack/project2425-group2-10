import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient";

const secret = process.env.JWT_SECRET || "your_jwt_secret";

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, role, name: "Default Name", },
    });
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: "1d" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
};