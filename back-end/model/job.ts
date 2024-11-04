// model/job.ts

export interface Job {
    id: number;
    companyName: string;
    jobTitle: string;
    date: string;
    status: string;
    description?: string;
    requiredSkills?: string[];
    adminId: number; // Relationship to Admin
  }
  