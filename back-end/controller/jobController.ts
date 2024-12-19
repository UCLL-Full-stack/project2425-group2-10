// back-end/src/controller/jobController.ts

import { Request, Response } from 'express';
import { jobRepository } from '../repository/jobRepository';
import { applicationRepository } from '../repository/applicationRepository';
import { Job, Application, NewApplication, JobStatus, ApplicationStatus, NewJob } from '../types';

/**
 * Adds a new job to the database using the Prisma-based repository.
 */
export const addJob = async (req: Request, res: Response) => {
    try {
        const { companyName, jobTitle, date, status, description, skills } = req.body;

        // Validate required fields
        if (
            typeof companyName !== 'string' ||
            typeof jobTitle !== 'string' ||
            typeof date !== 'string' ||
            typeof status !== 'string'
        ) {
            return res.status(400).json({ message: 'Missing required fields or invalid data.' });
        }

        // Validate skills is an array with at least one skill
        if (!Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: 'Please specify at least one required skill.' });
        }

        // Validate date format
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format. Please use a valid date string.' });
        }

        // Validate status value
        if (!Object.values(JobStatus).includes(status as JobStatus)) {
            return res.status(400).json({ message: 'Invalid status value provided.' });
        }

        // Prepare new job data
        const newJobData: NewJob = {
            companyName: companyName.trim(),
            jobTitle: jobTitle.trim(),
            date: parsedDate,
            status: status as JobStatus, // Cast to enum
            description: description ? description.trim() : '',
            skills: skills.map((skill: string) => skill.trim()), // Ensure skills are trimmed strings
            adminId: 1, // Set a default adminId since admin verification is removed
        };

        // Add job using the repository
        const addedJob = await jobRepository.addJob(newJobData);

        // Respond with the created job
        res.status(201).json({ message: 'Job added successfully.', job: addedJob });
    } catch (error: unknown) {
        console.error('Error adding job:', error);
        res.status(500).json({ message: 'Failed to add job. Please try again.' });
    }
};

/**
 * Retrieves all jobs from the database using the Prisma-based repository.
 */
export const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await jobRepository.getJobs();
        res.status(200).json(jobs);
    } catch (error: unknown) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Failed to fetch jobs. Please try again later.' });
    }
};

/**
 * Handles job application submissions by creating a new application.
 */
export const applyForJob = async (req: Request, res: Response) => {
    try {
        const jobId = parseInt(req.params.id, 10);

        // Validate jobId
        if (isNaN(jobId)) {
            return res.status(400).json({ message: 'Invalid job ID.' });
        }

        // Retrieve the job to ensure it exists
        const job = await jobRepository.getJobById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // Validate file uploads (resume and coverLetter)
        if (
            !req.files ||
            !('resume' in req.files) ||
            !('coverLetter' in req.files) ||
            !(req.files['resume'] as Express.Multer.File[]).length ||
            !(req.files['coverLetter'] as Express.Multer.File[]).length
        ) {
            return res.status(400).json({ message: 'Resume and Cover Letter are required.' });
        }

        const resume = (req.files['resume'] as Express.Multer.File[])[0];
        const coverLetter = (req.files['coverLetter'] as Express.Multer.File[])[0];

        const { applicantName, applicantEmail } = req.body;

        // Validate applicantName
        if (!applicantName || typeof applicantName !== 'string' || applicantName.trim() === '') {
            return res.status(400).json({ message: 'Applicant name is required and must be a non-empty string.' });
        }

        // Validate applicantEmail
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (
            !applicantEmail ||
            typeof applicantEmail !== 'string' ||
            !emailRegex.test(applicantEmail.trim())
        ) {
            return res.status(400).json({ message: 'A valid applicant email is required.' });
        }

        // Prepare new application data
        const newApplication: NewApplication = {
            jobId,
            applicantName: applicantName.trim(),
            applicantEmail: applicantEmail.trim(),
            resumeUrl: `/uploads/resumes/${resume.filename}`,
            coverLetterUrl: `/uploads/coverLetters/${coverLetter.filename}`,
            appliedAt: new Date(), // Prisma will handle the Date type
            status: ApplicationStatus.Applied, // Use enum
            notes: '', // Initialize with empty notes if necessary
        };

        // Add application using the repository
        const application = await applicationRepository.addApplication(newApplication);

        // Respond with the created application
        res.status(201).json({ message: 'Application submitted successfully.', application });
    } catch (error: unknown) {
        console.error('Error applying for job:', error);
        res.status(500).json({ message: 'Failed to submit application. Please try again later.' });
    }
};

/**
 * Deletes a job by its ID using the Prisma-based repository.
 */
export const deleteJob = async (req: Request, res: Response) => {
    try {
        const jobId = parseInt(req.params.id, 10);

        // Validate jobId
        if (isNaN(jobId)) {
            return res.status(400).json({ message: 'Invalid job ID.' });
        }

        // Retrieve the job to ensure it exists
        const job = await jobRepository.getJobById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // Delete the job using the repository
        const deleted = await jobRepository.deleteJob(jobId);
        if (deleted) {
            // Delete related applications
            const deletedApplicationsCount = await applicationRepository.deleteApplicationsByJobId(jobId);
            return res.status(200).json({ message: `Job discarded successfully. Deleted ${deletedApplicationsCount} related application(s).` });
        } else {
            return res.status(500).json({ message: 'Failed to discard the job. Please try again.' });
        }
    } catch (error: unknown) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Failed to discard the job. Please try again.' });
    }
};