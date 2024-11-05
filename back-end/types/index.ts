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

export interface Application {
    id: number;
    jobId: number;
    applicantName: string;
    applicantEmail: string;
    resumeUrl: string;
    coverLetterUrl: string;
    appliedAt: string;
}
