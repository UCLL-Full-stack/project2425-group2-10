// back-end/types/index.ts

export enum ApplicationStatus {
    Applied = 'Applied',
    Pending = 'Pending',
    Interviewing = 'Interviewing',
    Rejected = 'Rejected',
    Accepted = 'Accepted',
}

export enum JobStatus {
    Open = 'Open',
    Closed = 'Closed',
    Pending = 'Pending',
    // Add other statuses as needed
}

export interface Skill {
    id: number;
    name: string;
}
export interface Job {
    id: number;
    companyName: string;
    jobTitle: string;
    date: Date; // Changed from string to Date
    status: JobStatus; // Changed to enum
    description: string;
    skills: Skill[]; // Associated skills
    adminId: number; // Added as required
    createdAt: Date;
    updatedAt: Date;
}

export interface Admin {
    id: number;
    name: string;
    email: string;
}

export interface Application {
    id: number;
    jobId: number;
    applicantName: string;
    applicantEmail: string;
    resumeUrl: string;
    coverLetterUrl: string;
    appliedAt: Date; // Changed from string to Date
    status: ApplicationStatus; // Changed to enum
    notes?: string;
    reminders: Reminder[];
    createdAt: Date;
    updatedAt: Date;
    job?: Job; // Optional, if included
}

export interface NewApplication {
    jobId: number;
    applicantName: string;
    applicantEmail: string;
    resumeUrl: string;
    coverLetterUrl: string;
    appliedAt: Date; // Changed from string to Date
    status: ApplicationStatus; // Changed to enum
    notes?: string;
}

export interface Reminder {
    id: number;
    applicationId: number;
    reminderDate: Date;
    message?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Application extends NewApplication {
    id: number;
    notes?: string;
}

export type NewJob = Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'skills'> & {
    skills: string[]; // Array of skill names
};