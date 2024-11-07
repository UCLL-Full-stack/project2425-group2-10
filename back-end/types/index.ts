// back-end/types/index.ts

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

export type NewApplication = {
    jobId: number;
    applicantName: string;
    applicantEmail: string;
    resumeUrl: string;
    coverLetterUrl: string;
    appliedAt: string;
    status: 'Applied' | 'Pending' | 'Interviewing' | 'Rejected' | 'Accepted';
    jobTitle: string;
    companyName: string;
    notes?: string;
};

export interface Application extends NewApplication {
    id: number;
}

export interface Reminder {
    id: number;
    applicationId: number;
    reminderDate: string; // ISO date string
    message?: string; // Optional message for the reminder
}