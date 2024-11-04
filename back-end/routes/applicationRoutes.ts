// back-end/routes/applicationRoutes.ts

import { Router } from 'express';
import { applyToJob, getUserApplications } from '../controller/applicationController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/authorizeRole';

const router = Router();

/**
 * @swagger
 * /applications/{jobId}/apply:
 *   post:
 *     summary: Apply to a specific job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumePath:
 *                 type: string
 *               coverLetterPath:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully.
 *       400:
 *         description: You have already applied for this job.
 */
router.post('/:jobId/apply', authMiddleware, authorizeRole('user'), applyToJob);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get all applications for the logged-in user
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of application objects.
 */
router.get('/', authMiddleware, authorizeRole('user'), getUserApplications);

export default router;
