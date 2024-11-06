// back-end/repository/jobRepository.ts

import { Job } from '../types';

let jobs: Job[] = [];
let nextJobId = 1; // Initialize job ID counter

/**
 * Repository for managing jobs.
 */
export const jobRepository = {
    /**
     * Adds a new job to the repository.
     * @param job - The job to add (without id).
     * @returns The added job with an assigned id.
     */
    addJob: (job: Omit<Job, 'id'>): Job => {
        const newJob: Job = { ...job, id: nextJobId++ };
        jobs.push(newJob);
        return newJob;
    },

    /**
     * Retrieves all jobs from the repository.
     * @returns An array of jobs.
     */
    getAllJobs: (): Job[] => {
        return jobs;
    },

    /**
     * Retrieves a job by its ID.
     * @param id - The ID of the job.
     * @returns The job if found, otherwise undefined.
     */
    getJobById: (id: number): Job | undefined => {
        return jobs.find(job => job.id === id);
    },

        /**
     * Deletes a job by its ID.
     * @param id - The ID of the job to delete.
     * @returns True if deletion was successful, otherwise false.
     */
        deleteJob: (id: number): boolean => {
          const index = jobs.findIndex(job => job.id === id);
          if (index !== -1) {
              jobs.splice(index, 1);
              return true;
          }
          return false;
    },
};
