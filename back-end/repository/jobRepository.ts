// back-end/repository/jobRepository.ts

import { Job } from '../model/job';

let jobs: Job[] = [];
let nextJobId = 1;

/**
 * Repository for managing jobs.
 */
export const jobRepository = {
    /**
     * Adds a new job to the repository.
     * @param job - Job details without the ID.
     * @returns The newly added job with an assigned ID.
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
    getJobs: (): Job[] => jobs,
    /**
     * Retrieves a job by its ID.
     * @param id - The job's ID.
     * @returns The job if found, otherwise undefined.
     */
    getJobById: (id: number): Job | undefined => jobs.find((job) => job.id === id),
    /**
     * Updates a job's status to "Discarded".
     * @param id - The job's ID.
     * @returns The updated job if found, otherwise undefined.
     */
    discardJob: (id: number): Job | undefined => {
        const job = jobs.find((job) => job.id === id);
        if (job) {
            job.status = 'Discarded';
        }
        return job;
    },
};
