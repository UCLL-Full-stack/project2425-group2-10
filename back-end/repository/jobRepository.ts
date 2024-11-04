// back-end/repository/jobRepository.ts

import { Job } from '../model/job';

let jobs: Job[] = []; // In-memory storage for jobs
let currentId = 1;

export const jobRepository = {
  addJob: (jobData: Omit<Job, 'id'>): Job => {
    const newJob: Job = { id: currentId++, ...jobData };
    jobs.push(newJob);
    return newJob;
  },

  getAllJobs: (): Job[] => {
    return jobs;
  },

  // Additional methods like updateJob, deleteJob can be added here
};
