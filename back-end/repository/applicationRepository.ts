// back-end/repository/applicationRepository.ts

import { Application, ApplicationStatus, NewApplication, Reminder } from '../types';

let applications: Application[] = [];
let reminders: Reminder[] = [];
let nextApplicationId = 1;
let nextReminderId = 1;
/**
 * Repository for managing job applications.
 */
export const applicationRepository = {
    /**
     * Adds a new application to the repository.
     * @param applicationData - Application details.
     * @returns The newly added application.
     */
    addApplication: (applicationData: NewApplication): Application => {
        const newApplication: Application = { ...applicationData, id: nextApplicationId++ };
        applications.push(newApplication);
        return newApplication;
    },

    /**
     * Retrieves all applications, optionally filtered by status.
     * @param status - Optional application status to filter by.
     * @returns An array of applications matching the filter.
     */
    getAllApplications: (status?: ApplicationStatus): Application[] => {
        if (status) {
            return applications.filter(app => app.status.toLowerCase() === status.toLowerCase());
        }
        return applications;
    },

        /**
     * Retrieves an application by its ID.
     * @param id - The ID of the application.
     * @returns The application if found, otherwise undefined.
     */
    getApplicationById: (id: number): Application | undefined => {
        return applications.find(app => app.id === id);
    },    

  /**
     * Retrieves applications by job ID.
     * @param jobId - The job's ID.
     * @returns An array of applications for the specified job.
     */
    getApplicationsByJobId: (jobId: number): Application[] => 
        applications.filter((app) => app.jobId === jobId),

    /**
     * Deletes applications by job ID.
     * @param jobId - The job's ID.
     * @returns Number of applications deleted.
     */
    deleteApplicationsByJobId: (jobId: number): number => {
        const initialLength = applications.length;
        applications = applications.filter(app => app.jobId !== jobId);
        return initialLength - applications.length;
    },

    /**
     * Updates the status of an application.
     * @param applicationId - The application's ID.
     * @param status - The new status.
     * @returns The updated application or null if not found.
     */
    updateApplicationStatus: (applicationId: number, status: ApplicationStatus): Application | null => {
        const application = applications.find(app => app.id === applicationId);
        if (!application) {
            return null;
        }
        application.status = status;
        return application;
    },

        /**
     * Updates the notes of an application.
     * @param applicationId - The application's ID.
     * @param notes - The new notes.
     * @returns The updated application or null if not found.
     */
    updateNotes: (applicationId: number, notes: string): Application | null => {
        const application = applications.find(app => app.id === applicationId);
        if (!application) {
            return null;
        }
        application.notes = notes;
        return application;
    },

    /**
     * Deletes an application by its ID.
     * @param applicationId - The application's ID.
     * @returns True if deletion was successful, otherwise false.
     */
    deleteApplication: (applicationId: number): boolean => {
        const initialLength = applications.length;
        applications = applications.filter(app => app.id !== applicationId);
        // Also remove associated reminder if exists
        reminders = reminders.filter(rem => rem.applicationId !== applicationId);
        return applications.length < initialLength;
    },

    /**
     * Adds a reminder to an application.
     * @param applicationId - The application's ID.
     * @param reminderDate - The date and time for the reminder.
     * @param message - Optional message for the reminder.
     * @returns The newly added reminder.
     */
    addReminder: (applicationId: number, reminderDate: string, message?: string): Reminder | null => {
        const application = applications.find(app => app.id === applicationId);
        if (!application) {
            return null;
        }
        const newReminder: Reminder = { id: nextReminderId++, applicationId, reminderDate, message };
        reminders.push(newReminder);
        return newReminder;
    },

    /**
     * Updates a reminder.
     * @param reminderId - The ID of the reminder to update.
     * @param reminderDate - The new date and time for the reminder.
     * @param message - The new message for the reminder.
     * @returns The updated reminder or null if not found.
     */
    updateReminder: (reminderId: number, reminderDate: string, message?: string): Reminder | null => {
        const reminder = reminders.find(rem => rem.id === reminderId);
        if (!reminder) {
            return null;
        }
        reminder.reminderDate = reminderDate;
        if (message !== undefined) {
            reminder.message = message;
        }
        return reminder;
    },

    /**
     * Deletes a reminder by its ID.
     * @param reminderId - The ID of the reminder to delete.
     * @returns True if deletion was successful, otherwise false.
     */
    deleteReminder: (reminderId: number): boolean => {
        const initialLength = reminders.length;
        reminders = reminders.filter(rem => rem.id !== reminderId);
        return reminders.length < initialLength;
    },

    /**
     * Retrieves all reminders.
     * @returns An array of all reminders.
     */
    getAllReminders: (): Reminder[] => {
        return reminders;
    },

    /**
     * Retrieves due reminders based on the current date and time.
     * @param currentDateTime - The current date and time.
     * @returns An array of due reminders.
     */
    getDueReminders: (currentDateTime: Date): Reminder[] => {
        return reminders.filter(rem => new Date(rem.reminderDate) <= currentDateTime);
    },

};
