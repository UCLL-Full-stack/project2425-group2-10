// back-end/controller/applicationController.ts

import { Request, Response } from 'express';
import { applicationService } from '../service/applicationService';
import { ApplicationStatus } from '../types';

/**
 * Handles fetching all applications.
 */
export const handleGetApplications = async (req: Request, res: Response) => {
    try {
        const statusQuery = req.query.status as string | undefined;
        let applications;

        if (statusQuery) {
            const validStatuses = Object.values(ApplicationStatus);
            if (!validStatuses.includes(statusQuery as ApplicationStatus)) {
                return res.status(400).json({ message: 'Invalid status value provided.' });
            }
            applications = await applicationService.getAllApplications(statusQuery as ApplicationStatus);
        } else {
            applications = await applicationService.getAllApplications();
        }

        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Failed to fetch job applications.' });
    }
};

/**
 * Handles fetching applications filtered by status.
 */
export const handleGetApplicationsByStatus = async (req: Request, res: Response) => {
    const status = req.query.status as string;

    if (!status) {
        return res.status(400).json({ message: 'Status query parameter is required.' });
    }

    const validStatuses = Object.values(ApplicationStatus);

    if (!validStatuses.includes(status as ApplicationStatus)) {
        return res.status(400).json({ message: 'Invalid status value provided.' });
    }

    try {
        const applications = await applicationService.getApplicationsByStatus(status as ApplicationStatus);
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications by status:', error);
        res.status(500).json({ message: 'Failed to fetch job applications by status.' });
    }
};

/**
 * Handles updating the status of an application.
 */
export const handleUpdateApplicationStatus = async (req: Request, res: Response) => {
    const applicationId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (isNaN(applicationId)) {
        return res.status(400).json({ message: 'Invalid application ID.' });
    }

    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }

    const validStatuses = Object.values(ApplicationStatus);

    if (!validStatuses.includes(status as ApplicationStatus)) {
        return res.status(400).json({ message: 'Invalid application status provided.' });
    }

    try {
        const updatedApplication = await applicationService.updateApplicationStatus(applicationId, status as ApplicationStatus);
        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found.' });
        }
        res.status(200).json({ message: 'Application status updated successfully.', application: updatedApplication });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Handles updating the notes of an application.
 */
export const handleUpdateApplicationNotes = async (req: Request, res: Response) => {
    const applicationId = parseInt(req.params.id, 10);
    const { notes } = req.body;

    if (isNaN(applicationId)) {
        return res.status(400).json({ message: 'Invalid application ID.' });
    }

    if (typeof notes !== 'string') {
        return res.status(400).json({ message: 'Notes must be a string.' });
    }

    try {
        const updatedApplication = await applicationService.updateApplicationNotes(applicationId, notes.trim());
        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found.' });
        }
        res.status(200).json({ message: 'Notes updated successfully.', application: updatedApplication });
    } catch (error) {
        console.error('Error updating application notes:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Handles deleting an application.
 */
export const handleDeleteApplication = async (req: Request, res: Response) => {
    const applicationId = parseInt(req.params.id, 10);

    if (isNaN(applicationId)) {
        return res.status(400).json({ message: 'Invalid application ID.' });
    }

    try {
        const success = await applicationService.deleteApplication(applicationId);
        if (success) {
            res.status(200).json({ message: 'Application deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Application not found.' });
        }
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ message: 'Failed to delete the application. Please try again.' });
    }
};

/**
 * Handles setting a reminder for an application.
 */
export const handleSetReminder = async (req: Request, res: Response) => {
    const applicationId = parseInt(req.params.id, 10);
    const { reminderDate, message } = req.body;

    if (isNaN(applicationId)) {
        return res.status(400).json({ message: 'Invalid application ID.' });
    }

    if (!reminderDate || isNaN(Date.parse(reminderDate))) {
        return res.status(400).json({ message: 'Invalid or missing reminderDate. It should be a valid ISO date string.' });
    }

    if (message && typeof message !== 'string') {
        return res.status(400).json({ message: 'Reminder message must be a string.' });
    }

    try {
        const newReminder = await applicationService.setReminder(applicationId, reminderDate, message);
        if (!newReminder) {
            return res.status(404).json({ message: 'Application not found. Cannot set reminder.' });
        }

        res.status(201).json({ message: 'Reminder set successfully.', reminder: newReminder });
    } catch (error) {
        console.error('Error setting reminder:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Handles updating a reminder.
 */
export const handleUpdateReminder = async (req: Request, res: Response) => {
    const reminderId = parseInt(req.params.reminderId, 10);
    const { reminderDate, message } = req.body;

    if (isNaN(reminderId)) {
        return res.status(400).json({ message: 'Invalid reminder ID.' });
    }

    if (!reminderDate || isNaN(Date.parse(reminderDate))) {
        return res.status(400).json({ message: 'Invalid or missing reminderDate. It should be a valid ISO date string.' });
    }

    if (message && typeof message !== 'string') {
        return res.status(400).json({ message: 'Reminder message must be a string.' });
    }

    try {
        const updatedReminder = await applicationService.updateReminder(reminderId, reminderDate, message);
        if (!updatedReminder) {
            return res.status(404).json({ message: 'Reminder not found.' });
        }

        res.status(200).json({ message: 'Reminder updated successfully.', reminder: updatedReminder });
    } catch (error) {
        console.error('Error updating reminder:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * Handles deleting a reminder.
 */
export const handleDeleteReminder = async (req: Request, res: Response) => {
    const reminderId = parseInt(req.params.reminderId, 10);

    if (isNaN(reminderId)) {
        return res.status(400).json({ message: 'Invalid reminder ID.' });
    }

    try {
        const success = await applicationService.deleteReminder(reminderId);
        if (success) {
            res.status(200).json({ message: 'Reminder deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Reminder not found.' });
        }
    } catch (error) {
        console.error('Error deleting reminder:', error);
        res.status(500).json({ message: 'Failed to delete the reminder. Please try again.' });
    }
};