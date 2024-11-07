// back-end/controller/applicationController.ts

import { Request, Response } from 'express';
import { applicationRepository } from '../repository/applicationRepository';
import { jobRepository } from '../repository/jobRepository';
import { Application, NewApplication, Reminder } from '../types';

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
        !/^[A-Z0-9._%+-]+@[A-Z.-]+\.[A-Z]{2,}$/i.test(applicantEmail)
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

/**
 * Retrieves all job applications.
 */
export const getAllApplications = (req: Request, res: Response) => {
    try {
        const applications = applicationRepository.getAllApplications();
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Failed to fetch job applications' });
    }
};

/**
 * Updates the status of a specific job application.
 */
export const updateApplicationStatus = (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status input (ensure it matches allowed values)
    const validStatuses = ['Applied', 'Pending', 'Interviewing', 'Rejected', 'Accepted'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
    }

    const applicationId = parseInt(id, 10);
    if (isNaN(applicationId)) {
        return res.status(400).json({ message: 'Invalid application ID.' });
    }

    const updatedApplication = applicationRepository.updateApplicationStatus(applicationId, status as 'Applied' | 'Pending' | 'Interviewing' | 'Rejected' | 'Accepted');

    if (!updatedApplication) {
        return res.status(404).json({ message: 'Application not found.' });
    }

    res.status(200).json({ message: 'Application status updated successfully.', application: updatedApplication });
};

export const updateApplicationNotes = (req: Request, res: Response) => {
    const applicationId = parseInt(req.params.id, 10);
    const { notes } = req.body;

    if (isNaN(applicationId)) {
        return res.status(400).json({ message: 'Invalid application ID.' });
    }

    if (typeof notes !== 'string') {
        return res.status(400).json({ message: 'Notes must be a string.' });
    }

    const updatedApplication = applicationRepository.updateNotes(applicationId, notes);

    if (!updatedApplication) {
        return res.status(404).json({ message: 'Application not found.' });
    }

    res.status(200).json({ message: 'Notes updated successfully.', application: updatedApplication });
};

/**
 * Deletes a specific job application by ID.
 */
export const deleteApplication = (req: Request, res: Response) => {
    const applicationId = parseInt(req.params.id, 10);

    if (isNaN(applicationId)) {
        return res.status(400).json({ message: 'Invalid application ID.' });
    }

    const application = applicationRepository.getApplicationById(applicationId);
    if (!application) {
        return res.status(404).json({ message: 'Application not found.' });
    }

    // Remove the application from the repository
    const success = applicationRepository.deleteApplication(applicationId);
    if (success) {
        return res.status(200).json({ message: 'Application deleted successfully.' });
    } else {
        return res.status(500).json({ message: 'Failed to delete the application. Please try again.' });
    }
};

/**
 * Sets a reminder for a specific job application.
 */
export const setReminder = (req: Request, res: Response) => {
    const applicationId = parseInt(req.params.id, 10);
    const { reminderDate, message } = req.body;

    if (isNaN(applicationId)) {
        return res.status(400).json({ message: 'Invalid application ID.' });
    }

    if (!reminderDate || isNaN(Date.parse(reminderDate))) {
        return res.status(400).json({ message: 'Invalid or missing reminderDate. It should be a valid ISO date string.' });
    }

    const newReminder = applicationRepository.addReminder(applicationId, reminderDate, message);
    if (!newReminder) {
        return res.status(404).json({ message: 'Application not found. Cannot set reminder.' });
    }

    res.status(201).json({ message: 'Reminder set successfully.', reminder: newReminder });
};

/**
 * Updates a reminder for a specific job application.
 */
export const updateReminderController = (req: Request, res: Response) => {
    const reminderId = parseInt(req.params.reminderId, 10);
    const { reminderDate, message } = req.body;

    if (isNaN(reminderId)) {
        return res.status(400).json({ message: 'Invalid reminder ID.' });
    }

    if (!reminderDate || isNaN(Date.parse(reminderDate))) {
        return res.status(400).json({ message: 'Invalid or missing reminderDate. It should be a valid ISO date string.' });
    }

    const updatedReminder = applicationRepository.updateReminder(reminderId, reminderDate, message);
    if (!updatedReminder) {
        return res.status(404).json({ message: 'Reminder not found.' });
    }

    res.status(200).json({ message: 'Reminder updated successfully.', reminder: updatedReminder });
};

/**
 * Deletes a reminder for a specific job application.
 */
export const deleteReminderController = (req: Request, res: Response) => {
    const reminderId = parseInt(req.params.reminderId, 10);

    if (isNaN(reminderId)) {
        return res.status(400).json({ message: 'Invalid reminder ID.' });
    }

    const success = applicationRepository.deleteReminder(reminderId);
    if (success) {
        return res.status(200).json({ message: 'Reminder deleted successfully.' });
    } else {
        return res.status(404).json({ message: 'Reminder not found.' });
    }
};
