// back-end/src/repository/applicationRepository.ts

import { PrismaClient, Prisma, ApplicationStatus as PrismaApplicationStatus } from '@prisma/client';
import { Application } from '../model/application';
import { Reminder } from '../model/reminder';
import { ApplicationStatus, NewApplication } from '../types'; // Ensure this aligns with your Prisma enum

const prisma = new PrismaClient();

export const applicationRepository = {
    /**
     * Retrieves all applications from the database.
     * Optionally filters by application status.
     * 
     * @param status - Optional ApplicationStatus to filter applications.
     * @returns An array of Application domain objects.
     */
    getAllApplications: async (status?: ApplicationStatus): Promise<Application[]> => {
        try {
            const prismaApplications = await prisma.application.findMany({
                where: status ? { status: status as PrismaApplicationStatus } : {},
                include: {
                    job: {
                        include: {
                            jobSkills: {
                                include: {
                                    skill: true,
                                },
                            },
                        },
                    },
                    reminders: true,
                },
                orderBy: {
                    appliedAt: 'desc',
                },
            });

            return prismaApplications.map(prismaApp => Application.fromPrisma(prismaApp));
        } catch (error: unknown) {
            console.error('Error in getAllApplications:', error);
            throw new Error('Failed to retrieve applications.');
        }
    },

    /**
     * Retrieves applications filtered by a specific status.
     * 
     * @param status - The ApplicationStatus to filter applications.
     * @returns An array of Application domain objects with the specified status.
     */
    getApplicationsByStatus: async (status: ApplicationStatus): Promise<Application[]> => {
        try {
            const prismaApplications = await prisma.application.findMany({
                where: { status: status as PrismaApplicationStatus },
                include: {
                    job: {
                        include: {
                            jobSkills: {
                                include: {
                                    skill: true,
                                },
                            },
                        },
                    },
                    reminders: true,
                },
                orderBy: {
                    appliedAt: 'desc',
                },
            });

            return prismaApplications.map(prismaApp => Application.fromPrisma(prismaApp));
        } catch (error: unknown) {
            console.error('Error in getApplicationsByStatus:', error);
            throw new Error('Failed to retrieve applications by status.');
        }
    },

    /**
     * Adds a new application to the database.
     * 
     * @param newApplication - The application data to add.
     * @returns The created Application domain object.
     */
    addApplication: async (newApplication: NewApplication): Promise<Application> => {
        try {
            const prismaApplication = await prisma.application.create({
                data: {
                    jobId: newApplication.jobId,
                    applicantName: newApplication.applicantName,
                    applicantEmail: newApplication.applicantEmail,
                    resumeUrl: newApplication.resumeUrl,
                    coverLetterUrl: newApplication.coverLetterUrl,
                    appliedAt: newApplication.appliedAt,
                    status: newApplication.status as PrismaApplicationStatus,
                    notes: newApplication.notes,
                },
                include: {
                    job: {
                        include: {
                            jobSkills: {
                                include: {
                                    skill: true,
                                },
                            },
                        },
                    },
                    reminders: true,
                },
            });

            return Application.fromPrisma(prismaApplication);
        } catch (error: unknown) {
            console.error('Error in addApplication:', error);
            throw new Error('Failed to add application.');
        }
    },

    /**
     * Deletes all applications associated with a specific job ID.
     * 
     * @param jobId - The ID of the job whose applications are to be deleted.
     * @returns The number of applications deleted.
     */
    deleteApplicationsByJobId: async (jobId: number): Promise<number> => {
        try {
            const deletedApplications = await prisma.application.deleteMany({
                where: { jobId },
            });
            return deletedApplications.count;
        } catch (error: unknown) {
            console.error('Error deleting applications by Job ID:', error);
            throw new Error('Failed to delete applications for the job.');
        }
    },

    /**
     * Updates the status of a specific application.
     * 
     * @param applicationId - The ID of the application to update.
     * @param newStatus - The new status to assign to the application.
     * @returns The updated Application domain object or null if not found.
     */
    updateApplicationStatus: async (applicationId: number, newStatus: ApplicationStatus): Promise<Application | null> => {
        try {
            const prismaApplication = await prisma.application.update({
                where: { id: applicationId },
                data: { status: newStatus as PrismaApplicationStatus },
                include: {
                    job: {
                        include: {
                            jobSkills: {
                                include: {
                                    skill: true,
                                },
                            },
                        },
                    },
                    reminders: true,
                },
            });

            return Application.fromPrisma(prismaApplication);
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Record not found
                return null;
            }
            console.error('Error in updateApplicationStatus:', error);
            throw new Error('Failed to update application status.');
        }
    },

    /**
     * Updates the notes of a specific application.
     * 
     * @param applicationId - The ID of the application to update.
     * @param notes - The new notes to assign to the application.
     * @returns The updated Application domain object or null if not found.
     */
    updateApplicationNotes: async (applicationId: number, notes: string): Promise<Application | null> => {
        try {
            const prismaApplication = await prisma.application.update({
                where: { id: applicationId },
                data: { notes },
                include: {
                    job: {
                        include: {
                            jobSkills: {
                                include: {
                                    skill: true,
                                },
                            },
                        },
                    },
                    reminders: true,
                },
            });

            return Application.fromPrisma(prismaApplication);
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Record not found
                return null;
            }
            console.error('Error in updateApplicationNotes:', error);
            throw new Error('Failed to update application notes.');
        }
    },

    /**
     * Deletes a specific application by its ID.
     * 
     * @param applicationId - The ID of the application to delete.
     * @returns A boolean indicating whether the deletion was successful.
     */
    deleteApplication: async (applicationId: number): Promise<boolean> => {
        try {
            await prisma.application.delete({
                where: { id: applicationId },
            });
            return true;
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Record not found
                return false;
            }
            console.error('Error in deleteApplication:', error);
            throw new Error('Failed to delete the application.');
        }
    },

    /**
     * Sets a reminder for a specific application.
     * 
     * @param applicationId - The ID of the application to set a reminder for.
     * @param reminderDate - The date and time for the reminder.
     * @param message - Optional message for the reminder.
     * @returns The created Reminder domain object or null if the application was not found.
     */
    setReminder: async (applicationId: number, reminderDate: Date, message?: string): Promise<Reminder | null> => {
        try {
            // Ensure the application exists
            const applicationExists = await prisma.application.findUnique({
                where: { id: applicationId },
            });

            if (!applicationExists) {
                return null;
            }

            const prismaReminder = await prisma.reminder.create({
                data: {
                    applicationId,
                    reminderDate,
                    message,
                },
                include: {
                    application: {
                        include: {
                            job: {
                                include: {
                                    jobSkills: {
                                        include: {
                                            skill: true,
                                        },
                                    },
                                },
                            },
                            reminders: true,
                        },
                    },
                },
            });

            return Reminder.fromPrisma(prismaReminder);
        } catch (error: unknown) {
            console.error('Error in setReminder:', error);
            throw new Error('Failed to set reminder.');
        }
    },

    /**
     * Updates a specific reminder by its ID.
     * 
     * @param reminderId - The ID of the reminder to update.
     * @param reminderDate - The new date and time for the reminder.
     * @param message - The new message for the reminder.
     * @returns The updated Reminder domain object or null if not found.
     */
    updateReminder: async (reminderId: number, reminderDate: Date, message?: string): Promise<Reminder | null> => {
        try {
            const prismaReminder = await prisma.reminder.update({
                where: { id: reminderId },
                data: { reminderDate, message },
                include: {
                    application: {
                        include: {
                            job: {
                                include: {
                                    jobSkills: {
                                        include: {
                                            skill: true,
                                        },
                                    },
                                },
                            },
                            reminders: true,
                        },
                    },
                },
            });

            return Reminder.fromPrisma(prismaReminder);
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Record not found
                return null;
            }
            console.error('Error in updateReminder:', error);
            throw new Error('Failed to update reminder.');
        }
    },

    /**
     * Deletes a specific reminder by its ID.
     * 
     * @param reminderId - The ID of the reminder to delete.
     * @returns A boolean indicating whether the deletion was successful.
     */
    deleteReminder: async (reminderId: number): Promise<boolean> => {
        try {
            await prisma.reminder.delete({
                where: { id: reminderId },
            });
            return true;
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Record not found
                return false;
            }
            console.error('Error in deleteReminder:', error);
            throw new Error('Failed to delete the reminder.');
        }
    },

    /**
     * Retrieves reminders that are due up to the currentDateTime.
     * 
     * @param currentDateTime - The current date and time.
     * @returns An array of due reminders.
     */
    getDueReminders: async (currentDateTime: Date): Promise<Reminder[]> => {
        try {
            const prismaReminders = await prisma.reminder.findMany({
                where: {
                    reminderDate: {
                        lte: currentDateTime,
                    },
                },
            });
            return prismaReminders.map(prismaReminder => Reminder.fromPrisma(prismaReminder));
        } catch (error: unknown) {
            console.error('Error in getDueReminders:', error);
            throw new Error('Failed to retrieve due reminders.');
        }
    },

    /**
     * Retrieves an application by its ID.
     * 
     * @param applicationId - The ID of the application.
     * @returns The Application object or null if not found.
     */
    getApplicationById: async (applicationId: number): Promise<Application | null> => {
        try {
            const prismaApplication = await prisma.application.findUnique({
                where: { id: applicationId },
                include: {
                    job: {
                        include: {
                            jobSkills: {
                                include: {
                                    skill: true,
                                },
                            },
                        },
                    },
                    reminders: true,
                },
            });
            if (!prismaApplication) return null;
            return Application.fromPrisma(prismaApplication);
        } catch (error: unknown) {
            console.error('Error in getApplicationById:', error);
            throw new Error('Failed to retrieve application.');
        }
    },
};