// repository/jobRepository.ts

import { Job } from '../model/job';

let jobs: Job[] = [];
let nextJobId = 1;

export const jobRepository = {
  addJob: (job: Omit<Job, 'id'>): Job => {
    const newJob: Job = { ...job, id: nextJobId++ };
    jobs.push(newJob);
    return newJob;
  },
  getJobs: (): Job[] => jobs,
};
