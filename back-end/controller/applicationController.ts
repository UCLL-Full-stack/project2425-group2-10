// back-end/controller/applicationController.ts

import { Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import { applicationRepository } from '../repository/applicationRepository';
import { jobRepository } from '../repository/jobRepository';

/**
 * Allows a user to apply to a specific job.
 * Accessible only by users (applicants).
 */
export const applyToJob = (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'user') {
    return res.status(403).json({ message: 'Forbidden: Only users can apply to jobs.' });
  }

  const jobId = parseInt(req.params.jobId, 10);
  const userId = req.user.id;
  const { resumePath, coverLetterPath } = req.body;

  if (isNaN(jobId) || !resumePath || !coverLetterPath) {
    return res.status(400).json({ message: 'Invalid job ID or missing application details.' });
  }

  const job = jobRepository.getJobById(jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found.' });
  }

  const existingApplication = applicationRepository.getApplicationByUserAndJob(userId, jobId);
  if (existingApplication) {
    return res.status(400).json({ message: 'You have already applied for this job.' });
  }

  const newApplication = applicationRepository.createApplication({
    jobId,
    userId,
    resumePath,
    coverLetterPath,
    status: 'Applied',
    appliedAt: new Date(),
  });

  res.status(201).json({
    message: 'Application submitted successfully.',
    application: newApplication,
  });
};

/**
 * Retrieves the job application overview for the logged-in user.
 * Accessible only by users (applicants).
 */
export const getUserApplications = (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'user') {
    return res.status(403).json({ message: 'Forbidden: Only users can view applications.' });
  }

  const userId = req.user.id;

  try {
    const applications = applicationRepository.getApplicationsByUserId(userId);
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
