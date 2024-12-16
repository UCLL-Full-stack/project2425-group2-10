// front-end/types/index.ts

export interface Job {
  id: number;
  companyName: string;
  jobTitle: string;
  date: string; // ISO date string (e.g., "2024-05-20")
  status: string; // e.g., "Open", "Paused", "Filled", "Closed"
  description?: string;
  skills?: string[]; // Changed from 'requiredSkills' to 'skills' for consistency
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
  appliedAt: string; // ISO date-time string (e.g., "2024-05-20T14:30:00Z")
  status: ApplicationStatus;
  jobTitle: string;
  companyName: string;
  notes?: string; // Optional field for notes
  reminders?: Reminder[]; // Changed from 'reminder' to 'reminders' to support multiple reminders
}

export interface Reminder {
  id: number;
  applicationId: number;
  reminderDate: string; // ISO date-time string
  message?: string;
}

export type ApplicationStatus = 'Applied' | 'Pending' | 'Interviewing' | 'Rejected' | 'Accepted';