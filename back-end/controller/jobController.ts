// back-end/controller/jobController.ts

import { Request, Response } from 'express';
import { jobRepository } from '../repository/jobRepository';
import { Job } from '../types';

/**
 * Adds a new job to the in-memory repository.
 */
export const addJob = (req: Request, res: Response) => {
    const { companyName, jobTitle, date, status, description, requiredSkills } = req.body;

    // Validate required fields
    if (
        typeof companyName !== 'string' ||
        typeof jobTitle !== 'string' ||
        typeof date !== 'string' ||
        typeof status !== 'string'
    ) {
        return res.status(400).json({ message: 'Missing required fields or invalid data.' });
    }

    // Optionally, validate date format, status value, etc.

    const newJobData: Omit<Job, 'id'> = {
        companyName,
        jobTitle,
        date,
        status,
        description,
        requiredSkills,
        adminId: 1, // Set a default adminId since admin verification is removed
    };

    const addedJob = jobRepository.addJob(newJobData);
    res.status(201).json({ message: 'Job added successfully.', job: addedJob });
};

/**
 * Retrieves all jobs from the in-memory repository.
 */
export const getJobs = (req: Request, res: Response) => {
    const jobs = jobRepository.getAllJobs();
    res.status(200).json(jobs);
};
