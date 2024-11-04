// back-end/routes/jobRoutes.ts

import { Router } from 'express';
import { addJob, getJobs } from '../controller/jobController';
import { authMiddleware } from '../middleware/authMiddleware';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Add a new job opportunity
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Job added successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authMiddleware, verifyAdmin, addJob);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all job opportunities
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of job opportunities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authMiddleware, verifyAdmin, getJobs);

export default router;
