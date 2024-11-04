// back-end/repository/applicationRepository.ts

import { Application } from '../model/application';

// In-memory storage for applications
const applications: Application[] = [];
let currentId = 1;

export const applicationRepository = {
  /**
   * Creates a new job application.
   * @param applicationData - Data for the new application (without ID).
   * @returns The newly created Application object with an assigned ID.
   */
  createApplication: (applicationData: Omit<Application, 'id'>): Application => {
    const newApplication: Application = {
      id: currentId++,
      ...applicationData,
    };
    applications.push(newApplication);
    return newApplication;
  },

  /**
   * Retrieves an application by user ID and job ID.
   * @param userId - The ID of the user who applied.
   * @param jobId - The ID of the job being applied to.
   * @returns The Application object if found, otherwise undefined.
   */
  getApplicationByUserAndJob: (userId: number, jobId: number): Application | undefined => {
    return applications.find((app) => app.userId === userId && app.jobId === jobId);
  },

  /**
   * Retrieves all applications submitted by a specific user.
   * @param userId - The ID of the user.
   * @returns An array of Application objects submitted by the user.
   */
  getApplicationsByUserId: (userId: number): Application[] => {
    return applications.filter((app) => app.userId === userId);
  },
};
