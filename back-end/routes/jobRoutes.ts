// back-end/routes/jobRoutes.ts

import { Router } from 'express';
import { addJob, getAllJobs } from '../controller/jobController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/authorizeRole';

const router = Router();

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Add a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [Open, Closed]
 *               description:
 *                 type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Job added successfully.
 *       403:
 *         description: Forbidden: Only admins can add job opportunities.
 */
router.post('/', authMiddleware, authorizeRole('admin'), addJob);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all job opportunities
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: An array of job opportunities.
 */
router.get('/', authMiddleware, getAllJobs);

export default router;
