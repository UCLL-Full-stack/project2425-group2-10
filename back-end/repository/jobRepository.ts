// back-end/repository/jobRepository.ts

import { Job } from '../model/job';

// In-memory storage for job postings
const jobs: Job[] = [];
let currentId = 1;

export const jobRepository = {
  /**
   * Adds a new job to the repository.
   * @param jobData - Data for the new job (without ID).
   * @returns The newly created Job object with an assigned ID.
   */
  addJob: (jobData: Omit<Job, 'id'>): Job => {
    const newJob: Job = {
      id: currentId++,
      ...jobData,
    };
    jobs.push(newJob);
    return newJob;
  },

  /**
   * Retrieves all jobs in the repository.
   * @returns An array of all Job objects.
   */
  getAllJobs: (): Job[] => jobs,

  /**
   * Retrieves a job by its ID.
   * @param id - The unique identifier of the job.
   * @returns The Job object if found, otherwise undefined.
   */
  getJobById: (id: number): Job | undefined => jobs.find((job) => job.id === id),

  /**
   * Deletes a job by its ID.
   * @param id - The unique identifier of the job to be deleted.
   * @returns True if the job was successfully deleted, otherwise false.
   */
  deleteJob: (id: number): boolean => {
    const index = jobs.findIndex((job) => job.id === id);
    if (index !== -1) {
      jobs.splice(index, 1);
      return true;
    }
    return false;
  },
};
