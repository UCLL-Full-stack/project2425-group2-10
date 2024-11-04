// controller/jobController.ts

import { Request, Response } from 'express';
import { jobRepository } from '../repository/jobRepository';
import { Job } from '../model/job';

export const addJob = (req: Request, res: Response) => {
  const { companyName, jobTitle, date, status, description, requiredSkills, adminId } = req.body;

  // Validation
  if (!companyName || !jobTitle || !date || !status || !adminId) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const jobData: Omit<Job, 'id'> = {
    companyName,
    jobTitle,
    date,
    status,
    description,
    requiredSkills,
    adminId,
  };

  const newJob = jobRepository.addJob(jobData);
  res.status(201).json({ message: 'Job added successfully.', job: newJob });
};

export const getJobs = (req: Request, res: Response) => {
    const jobs = jobRepository.getJobs();
    res.status(200).json(jobs);
  };