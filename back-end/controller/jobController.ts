// back-end/controller/jobController.ts

import { Request, Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import { jobRepository } from '../repository/jobRepository';

/**
 * Allows admins to add a new job opportunity.
 * Only accessible by a recruiter (admin).
 */
export const addJob = (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Only admins can add job opportunities.' });
  }

  const { companyName, jobTitle, date, status, description, requiredSkills } = req.body;

  try {
    const newJob = jobRepository.addJob({
      companyName,
      jobTitle,
      date,
      status,
      description,
      requiredSkills,
      adminId: req.user.id,
    });

    res.status(201).json({
      message: 'Job added successfully.',
      job: newJob,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Retrieves all job opportunities.
 * Accessible by all users (applicants and recruiters).
 */
export const getAllJobs = (req: Request, res: Response) => {
  try {
    const jobs = jobRepository.getAllJobs();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
