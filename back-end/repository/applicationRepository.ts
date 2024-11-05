// back-end/repository/applicationRepository.ts

import { Application } from '../model/application';

let applications: Application[] = [];
let nextApplicationId = 1;

/**
 * Repository for managing job applications.
 */
export const applicationRepository = {
    /**
     * Adds a new application to the repository.
     * @param applicationData - Application details without the ID.
     * @returns The newly added application with an assigned ID.
     */
    addApplication: (applicationData: Omit<Application, 'id'>): Application => {
        const newApplication: Application = { ...applicationData, id: nextApplicationId++ };
        applications.push(newApplication);
        return newApplication;
    },
    /**
     * Retrieves all applications for a specific job.
     * @param jobId - The job's ID.
     * @returns An array of applications.
     */
    getApplicationsByJobId: (jobId: number): Application[] => 
        applications.filter((app) => app.jobId === jobId),
};
