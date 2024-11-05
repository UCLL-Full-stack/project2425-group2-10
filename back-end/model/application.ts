// back-end/model/application.ts

export interface Application {
    id: number;
    jobId: number;
    applicantName: string;
    applicantEmail: string;
    resumeUrl: string; // Path to the uploaded resume
    coverLetterUrl: string; // Path to the uploaded cover letter
    appliedAt: string; // ISO date string
}
