// front-end/types/index.tsx

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
}

export interface Application {
  id: number; // Must match the back-end's Application interface
  jobId: number;
  applicantName: string;
  applicantEmail: string;
  resumeUrl: string;
  coverLetterUrl: string;
  appliedAt: string;
  status: 'Applied' | 'Pending' | 'Interviewing' | 'Rejected' | 'Accepted';
  jobTitle: string;
  companyName: string;
}
