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
  status: ApplicationStatus;
  jobTitle: string;
  companyName: string;
  notes?: string; // Optional field for notes
  reminder?: Reminder;
}

export interface Reminder {
  id: number;
  applicationId: number;
  reminderDate: string; // ISO date string
  message?: string;
}

export type ApplicationStatus = 'Applied' | 'Pending' | 'Interviewing' | 'Rejected' | 'Accepted';

