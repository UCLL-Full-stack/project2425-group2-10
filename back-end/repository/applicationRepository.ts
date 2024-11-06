// back-end/repository/applicationRepository.ts

import { Application, NewApplication } from '../types';

let applications: Application[] = [];
let nextApplicationId = 1;

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
     * Retrieves all applications.
     * @returns An array of all applications.
     */
    getAllApplications: (): Application[] => {
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
    updateApplicationStatus: (applicationId: number, status: 'Applied' | 'Pending' | 'Interviewing' | 'Rejected' | 'Accepted'): Application | null => {
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

};
