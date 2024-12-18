// back-end/routes/applicationRoutes.ts

import express from 'express';
import { 
    handleGetApplications, 
    handleGetApplicationsByStatus,
    handleUpdateApplicationStatus, 
    handleUpdateApplicationNotes, 
    handleDeleteApplication, 
    handleSetReminder,
    handleUpdateReminder, 
    handleDeleteReminder 
} from '../controller/applicationController'; 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: API for managing job applications
 */

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get all job applications
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: A list of job applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       500:
 *         description: Failed to fetch job applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch job applications
 */
router.get('/', handleGetApplications);

/**
 * @swagger
 * /applications/status:
 *   get:
 *     summary: Retrieve job applications by specific status
 *     description: Retrieve a list of job applications filtered by a specific status.
 *     tags: [Applications]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Applied, Pending, Interviewing, Rejected, Accepted]
 *         required: true
 *         description: The status to filter applications by
 *     responses:
 *       200:
 *         description: A list of job applications with the specified status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       400:
 *         description: Missing or invalid status filter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing or invalid status filter
 *       500:
 *         description: Internal server error
 */
router.get('/status', handleGetApplicationsByStatus);

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     summary: Update the status of a job application
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: The application ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['Applied', 'Pending', 'Interviewing', 'Rejected', 'Accepted']
 *                 example: Pending
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application status updated successfully.
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid status value or application ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid status value.
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application not found.
 */
router.put('/:id', handleUpdateApplicationStatus);

/**
 * @swagger
 * /applications/{id}/notes:
 *   put:
 *     summary: Update the notes of a specific job application
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the application to update notes for
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notes
 *             properties:
 *               notes:
 *                 type: string
 *                 description: The updated notes for the application
 *     responses:
 *       200:
 *         description: Notes updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id/notes', handleUpdateApplicationNotes);

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: Delete a specific job application by ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the application to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application deleted successfully.
 *       400:
 *         description: Bad request (e.g., invalid ID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid application ID.
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application not found.
 *       500:
 *         description: Failed to delete the application
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to delete the application. Please try again.
 */
router.delete('/:id/', handleDeleteApplication);

/**
 * @swagger
 * /applications/{id}/reminder:
 *   post:
 *     summary: Set a reminder for a specific job application
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the application to set a reminder for
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reminderDate
 *             properties:
 *               reminderDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time for the reminder in ISO format
 *               message:
 *                 type: string
 *                 description: Optional message for the reminder
 *     responses:
 *       201:
 *         description: Reminder set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reminder:
 *                   $ref: '#/components/schemas/Reminder'
 *       400:
 *         description: Bad request (e.g., invalid input)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or missing reminderDate.
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application not found. Cannot set reminder.
 *       500:
 *         description: Internal server error
 */
router.post('/:id/reminder', handleSetReminder);

/**
 * @swagger
 * /applications/reminders/{reminderId}:
 *   put:
 *     summary: Update a specific reminder
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: reminderId
 *         required: true
 *         description: ID of the reminder to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reminderDate
 *             properties:
 *               reminderDate:
 *                 type: string
 *                 format: date-time
 *                 description: The new date and time for the reminder in ISO format
 *               message:
 *                 type: string
 *                 description: The new message for the reminder
 *     responses:
 *       200:
 *         description: Reminder updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reminder:
 *                   $ref: '#/components/schemas/Reminder'
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Reminder not found
 *       500:
 *         description: Internal server error
 */
router.put('/reminders/:reminderId', handleUpdateReminder);

/**
 * @swagger
 * /applications/reminders/{reminderId}:
 *   delete:
 *     summary: Delete a specific reminder
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: reminderId
 *         required: true
 *         description: ID of the reminder to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reminder deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reminder deleted successfully.
 *       404:
 *         description: Reminder not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reminder not found.
 *       500:
 *         description: Internal server error
 */
router.delete('/reminders/:reminderId', handleDeleteReminder);

export default router;