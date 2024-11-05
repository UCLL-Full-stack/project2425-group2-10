// back-end/controller/applicationController.ts

import { Request, Response } from 'express';
import { applicationRepository } from '../repository/applicationRepository';
import { jobRepository } from '../repository/jobRepository';

/**
 * Handles job application submissions.
 */
export const applyForJob = (req: Request, res: Response) => {
    const jobId = parseInt(req.params.id, 10);

    // Validate job ID
    if (isNaN(jobId)) {
        return res.status(400).json({ message: 'Invalid job ID.' });
    }

    // Check if job exists
    const job = jobRepository.getJobById(jobId);
    if (!job) {
        return res.status(404).json({ message: 'Job not found.' });
    }

    // Ensure files are uploaded
    if (
        !req.files ||
        !req.files['resume'] ||
        !req.files['coverLetter'] ||
        req.files['resume'].length === 0 ||
        req.files['coverLetter'].length === 0
    ) {
        return res.status(400).json({ message: 'Resume and Cover Letter are required.' });
    }

    // Extract files
    const resume = req.files['resume'][0];
    const coverLetter = req.files['coverLetter'][0];

    // Extract applicant details from form fields
    const { applicantName, applicantEmail } = req.body;

    // Validate applicant details
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

    // Save application
    const application = applicationRepository.addApplication({
        jobId,
        applicantName: applicantName.trim(),
        applicantEmail: applicantEmail.trim(),
        resumeUrl: `/uploads/resumes/${resume.filename}`,
        coverLetterUrl: `/uploads/coverLetters/${coverLetter.filename}`,
        appliedAt: new Date().toISOString(),
    });

    res.status(201).json({ message: 'Application submitted successfully.', application });
};
