// back-end/model/job.ts

export interface Job {
    id: number;
    companyName: string;
    jobTitle: string;
    date: string; // Date as a string
    status: 'Open' | 'Closed';
    description: string;
    requiredSkills: string[];
    adminId: number; // ID of the recruiter (admin) who added the job
  }
  