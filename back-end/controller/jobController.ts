// back-end/controller/jobController.ts

import { Request, Response } from 'express';
import { jobRepository } from '../repository/jobRepository';
import { applicationRepository } from '../repository/applicationRepository';
import { Job, Application, NewApplication } from '../types';

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

/**
 * Handles job application submissions.
 */
export const applyForJob = (req: Request, res: Response) => {
    const jobId = parseInt(req.params.id, 10);

    if (isNaN(jobId)) {
        return res.status(400).json({ message: 'Invalid job ID.' });
    }

    const job = jobRepository.getJobById(jobId);
    if (!job) {
        return res.status(404).json({ message: 'Job not found.' });
    }

    if (
        !req.files ||
        !req.files['resume'] ||
        !req.files['coverLetter'] ||
        req.files['resume'].length === 0 ||
        req.files['coverLetter'].length === 0
    ) {
        return res.status(400).json({ message: 'Resume and Cover Letter are required.' });
    }

    const resume = req.files['resume'][0];
    const coverLetter = req.files['coverLetter'][0];

    const { applicantName, applicantEmail } = req.body;

    if (!applicantName || typeof applicantName !== 'string' || applicantName.trim() === '') {
        return res.status(400).json({ message: 'Applicant name is required and must be a non-empty string.' });
    }

    if (
        !applicantEmail ||
        typeof applicantEmail !== 'string' ||
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(applicantEmail)
    ) {
        return res.status(400).json({ message: 'A valid applicant email is required.' });
    }

    const newApplication: NewApplication = {
        jobId,
        applicantName: applicantName.trim(),
        applicantEmail: applicantEmail.trim(),
        resumeUrl: `/uploads/resumes/${resume.filename}`,
        coverLetterUrl: `/uploads/coverLetters/${coverLetter.filename}`,
        appliedAt: new Date().toISOString(),
        status: 'Applied', // Default status
        jobTitle: job.jobTitle,
        companyName: job.companyName,
    };

    const application = applicationRepository.addApplication(newApplication);

    res.status(201).json({ message: 'Application submitted successfully.', application });
};
