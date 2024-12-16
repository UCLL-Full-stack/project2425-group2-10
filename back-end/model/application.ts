import { ApplicationStatus } from '../types';
import { Reminder } from './reminder';

export class Application {
    id: number;
    jobId: number;
    applicantName: string;
    applicantEmail: string;
    resumeUrl: string;
    coverLetterUrl: string;
    appliedAt: Date;
    status: ApplicationStatus;
    notes?: string;
    reminders: Reminder[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        jobId: number,
        applicantName: string,
        applicantEmail: string,
        resumeUrl: string,
        coverLetterUrl: string,
        appliedAt: Date,
        status: ApplicationStatus,
        notes: string | undefined,
        reminders: Reminder[],
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.jobId = jobId;
        this.applicantName = applicantName;
        this.applicantEmail = applicantEmail;
        this.resumeUrl = resumeUrl;
        this.coverLetterUrl = coverLetterUrl;
        this.appliedAt = appliedAt;
        this.status = status;
        this.notes = notes;
        this.reminders = reminders;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromPrisma(prismaApp: any): Application {
        const reminders = prismaApp.reminders.map((rem: any) => Reminder.fromPrisma(rem));
        return new Application(
            prismaApp.id,
            prismaApp.jobId,
            prismaApp.applicantName,
            prismaApp.applicantEmail,
            prismaApp.resumeUrl,
            prismaApp.coverLetterUrl,
            prismaApp.appliedAt,
            prismaApp.status,
            prismaApp.notes,
            reminders,
            prismaApp.createdAt,
            prismaApp.updatedAt
        );
    }
}