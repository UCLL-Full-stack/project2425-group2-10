// back-end/controller/adminController.ts

import { Request, Response } from 'express';
import { jobRepository } from '../repository/jobRepository';
import { AuthRequest } from '../types/AuthRequest'; // Assuming AuthRequest includes admin info

/**
 * Adds a new job posting.
 * Only accessible by a recruiter (admin).
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const addJob = (req: AuthRequest, res: Response) => {
  const { companyName, jobTitle, date, status, description, requiredSkills } = req.body;

  // Ensure that only an admin can add a job
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Only recruiters can add job postings.' });
  }

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
    console.error('Error adding job:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Deletes a job posting.
 * Only accessible by a recruiter (admin).
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const deleteJob = (req: AuthRequest, res: Response) => {
  const jobId = parseInt(req.params.id, 10);

  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Only recruiters can delete job postings.' });
  }

  try {
    const success = jobRepository.deleteJob(jobId);

    if (success) {
      res.status(200).json({ message: 'Job deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Job not found.' });
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
