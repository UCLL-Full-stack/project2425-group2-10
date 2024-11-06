// back-end/routes/applicationRoutes.ts

import express from 'express';
import { applyForJob, getAllApplications, updateApplicationStatus, updateApplicationNotes,  } from '../controller/applicationController';

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
router.get('/', getAllApplications);

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
router.put('/:id', updateApplicationStatus);

/**
 * @swagger
 * /jobs/{id}/apply:
 *   post:
 *     summary: Apply for a specific job by uploading resume and cover letter
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: The job ID to apply for
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - applicantName
 *               - applicantEmail
 *               - resume
 *               - coverLetter
 *             properties:
 *               applicantName:
 *                 type: string
 *                 example: John Doe
 *               applicantEmail:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               resume:
 *                 type: string
 *                 format: binary
 *               coverLetter:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application submitted successfully.
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields.
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job not found.
 */
router.post('/jobs/:id/apply', applyForJob);

// Update application notes
router.put('/:id/notes', updateApplicationNotes);

export default router;
