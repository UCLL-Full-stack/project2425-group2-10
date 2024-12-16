// src/domain/Reminder.ts
export class Reminder {
    id: number;
    applicationId: number;
    reminderDate: Date;
    message?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        applicationId: number,
        reminderDate: Date,
        message: string | undefined,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.applicationId = applicationId;
        this.reminderDate = reminderDate;
        this.message = message;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromPrisma(prismaRem: any): Reminder {
        return new Reminder(
            prismaRem.id,
            prismaRem.applicationId,
            prismaRem.reminderDate,
            prismaRem.message,
            prismaRem.createdAt,
            prismaRem.updatedAt
        );
    }
}