// back-end/controller/jobController.ts

import { Response } from 'express';
import { jobRepository } from '../repository/jobRepository';
import { Job } from '../model/job';
import { Request } from 'express';

/**
 * Controller to add a new job.
 * @param req - Authenticated request containing admin information.
 * @param res - Express response object.
 */
export const addJob = (req: Request, res: Response) => {
  const { companyName, jobTitle, date, status, description, requiredSkills } = req.body;

  // Validation: Ensure required fields are present
  if (!companyName || !jobTitle || !date || !status) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const jobData: Omit<Job, 'id'> = {
    companyName,
    jobTitle,
    date,
    status,
    description,
    requiredSkills,
    adminId: req.admin!.id, // Non-null assertion as verifyAdmin ensures admin exists
  };

  const newJob = jobRepository.addJob(jobData);
  res.status(201).json({ message: 'Job added successfully.', job: newJob });
};

/**
 * Controller to retrieve all jobs.
 * @param req - Authenticated request containing admin information.
 * @param res - Express response object.
 */
export const getJobs = (req: Request, res: Response) => {
  const jobs: Job[] = jobRepository.getAllJobs();
  res.status(200).json(jobs);
};
