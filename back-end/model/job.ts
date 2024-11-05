// back-end/model/job.ts

export interface Job {
  id: number;
  companyName: string;
  jobTitle: string;
  date: string; // ISO date string
  status: string;
  description?: string;
  requiredSkills?: string[];
  adminId: number; // Reference to Admin
}
