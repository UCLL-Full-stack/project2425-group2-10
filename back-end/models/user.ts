export interface User {
  id: string; // Consistent with Prisma's default UUID type
  email: string;
  password: string;
  role: "admin" | "recruiter" | "candidate";
  createdAt: Date;
}

export interface Admin extends User {
  id: string; // Changed to string for consistency
}