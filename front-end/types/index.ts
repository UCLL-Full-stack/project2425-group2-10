// front-end/types/index.ts

export interface Job {
  id: number;
  companyName: string;
  jobTitle: string;
  date: string;
  status: string;
  description?: string;
  requiredSkills?: string[];
  adminId: number;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  // Add more fields as needed, e.g., passwordHash
}
