// back-end/src/service/applicationService.ts

import { Application, ApplicationStatus, NewApplication, Reminder } from '../types';
import { applicationRepository } from '../repository/applicationRepository';
import { jobRepository } from '../repository/jobRepository';

/**
 * Applies for a job by creating a new application entry.
 * @param jobId - The ID of the job to apply for.
 * @param applicantName - The name of the applicant.
 * @param applicantEmail - The email of the applicant.
 * @param resumeUrl - The URL/path to the uploaded resume.
 * @param coverLetterUrl - The URL/path to the uploaded cover letter.
 * @returns The newly created application.
 * @throws Error if the job does not exist or application creation fails.
 */
const applyForJob = async (
    jobId: number,
    applicantName: string,
    applicantEmail: string,
    resumeUrl: string,
    coverLetterUrl: string
): Promise<Application> => {
    // Ensure that jobRepository.getJobById is awaited
    const job = await jobRepository.getJobById(jobId);
    if (!job) {
        throw new Error('Job not found.');
    }

    // Prepare the new application data with 'appliedAt' and enum 'status'
    const newApplication: NewApplication = {
        jobId,
        applicantName,
        applicantEmail,
        resumeUrl,
        coverLetterUrl,
        appliedAt: new Date(), // Current date and time
        status: ApplicationStatus.Applied, // Enum value
        notes: '', // Initialize notes as empty; adjust as needed
    };

    // Add the application using the repository
    const application = await applicationRepository.addApplication(newApplication);
    if (!application) {
        throw new Error('Failed to create application.');
    }

    return application;
};

/**
 * Retrieves all job applications, optionally filtered by status.
 * @param status - Optional status to filter applications.
 * @returns An array of applications.
 * @throws Error if retrieval fails.
 */
const getAllApplications = async (status?: ApplicationStatus): Promise<Application[]> => {
    try {
        const applications = await applicationRepository.getAllApplications(status);
        return applications;
    } catch (error: unknown) {
        console.error('Error retrieving all applications:', error);
        throw new Error('Failed to retrieve applications.');
    }
};

/**
 * Retrieves job applications filtered by a specific status.
 * @param status - The status to filter applications by.
 * @returns An array of applications with the specified status.
 * @throws Error if retrieval fails.
 */
const getApplicationsByStatus = async (status: ApplicationStatus): Promise<Application[]> => {
    try {
        const applications = await applicationRepository.getApplicationsByStatus(status);
        return applications;
    } catch (error: unknown) {
        console.error('Error retrieving applications by status:', error);
        throw new Error('Failed to retrieve applications by status.');
    }
};

/**
 * Updates the status of an application.
 * @param applicationId - The ID of the application.
 * @param status - The new status to set.
 * @returns The updated application.
 * @throws Error if the application is not found or update fails.
 */
const updateApplicationStatus = async (
    applicationId: number,
    status: ApplicationStatus
): Promise<Application> => {
    // Validate the new status
    if (!Object.values(ApplicationStatus).includes(status)) {
        throw new Error('Invalid application status provided.');
    }

    const updatedApplication = await applicationRepository.updateApplicationStatus(applicationId, status);
    if (!updatedApplication) {
        throw new Error('Application not found or failed to update.');
    }
    return updatedApplication;
};

/**
 * Updates the notes of an application.
 * @param applicationId - The ID of the application.
 * @param notes - The notes to update.
 * @returns The updated application.
 * @throws Error if the application is not found or update fails.
 */
const updateApplicationNotes = async (
    applicationId: number,
    notes: string
): Promise<Application> => {
    // Validate notes
    if (typeof notes !== 'string') {
        throw new Error('Notes must be a string.');
    }

    const updatedApplication = await applicationRepository.updateApplicationNotes(applicationId, notes.trim());
    if (!updatedApplication) {
        throw new Error('Application not found or failed to update notes.');
    }
    return updatedApplication;
};

/**
 * Deletes an application by its ID.
 * @param applicationId - The ID of the application.
 * @returns True if deletion was successful.
 * @throws Error if deletion fails.
 */
const deleteApplication = async (applicationId: number): Promise<boolean> => {
    const success = await applicationRepository.deleteApplication(applicationId);
    if (!success) {
        throw new Error('Failed to delete the application.');
    }
    return success;
};

/**
 * Sets a reminder for a specific job application.
 * @param applicationId - The ID of the application.
 * @param reminderDate - The date and time for the reminder (ISO string).
 * @param message - Optional message for the reminder.
 * @returns The newly created reminder.
 * @throws Error if the reminderDate is invalid or application does not exist.
 */
const setReminder = async (
    applicationId: number,
    reminderDate: string,
    message?: string
): Promise<Reminder> => {
    // Validate the reminder date
    const reminderDateObj = new Date(reminderDate);
    if (isNaN(reminderDateObj.getTime())) {
        throw new Error('Invalid reminder date.');
    }

    // Optionally, validate the message
    if (message && typeof message !== 'string') {
        throw new Error('Reminder message must be a string.');
    }

    // Add the reminder using the repository
    const reminder = await applicationRepository.setReminder(applicationId, reminderDateObj, message?.trim());
    if (!reminder) {
        throw new Error('Failed to set reminder. Application may not exist.');
    }

    return reminder;
};

/**
 * Updates a reminder for a specific job application.
 * @param reminderId - The ID of the reminder to update.
 * @param reminderDate - The new date and time for the reminder (ISO string).
 * @param message - The new message for the reminder.
 * @returns The updated reminder.
 * @throws Error if the reminderDate is invalid or reminder is not found.
 */
const updateReminder = async (
    reminderId: number,
    reminderDate: string,
    message?: string
): Promise<Reminder> => {
    // Validate the reminder date
    const reminderDateObj = new Date(reminderDate);
    if (isNaN(reminderDateObj.getTime())) {
        throw new Error('Invalid reminder date.');
    }

    // Optionally, validate the message
    if (message && typeof message !== 'string') {
        throw new Error('Reminder message must be a string.');
    }

    // Update the reminder using the repository
    const updatedReminder = await applicationRepository.updateReminder(reminderId, reminderDateObj, message?.trim());
    if (!updatedReminder) {
        throw new Error('Reminder not found or failed to update.');
    }

    return updatedReminder;
};

/**
 * Deletes a reminder for a specific job application.
 * @param reminderId - The ID of the reminder to delete.
 * @returns True if deletion was successful.
 * @throws Error if deletion fails.
 */
const deleteReminder = async (reminderId: number): Promise<boolean> => {
    const success = await applicationRepository.deleteReminder(reminderId);
    if (!success) {
        throw new Error('Failed to delete the reminder.');
    }
    return success;
};

/**
 * Aggregates all application service methods into a single object.
 */
export const applicationService = {
    applyForJob,
    getAllApplications,
    getApplicationsByStatus,
    updateApplicationStatus,
    updateApplicationNotes,
    deleteApplication,
    setReminder,
    updateReminder,
    deleteReminder,
};