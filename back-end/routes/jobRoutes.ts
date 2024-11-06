// back-end/routes/jobRoutes.ts

import express from 'express';
import { addJob, getJobs } from '../controller/jobController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: API for managing job opportunities
 */

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Add a new job opportunity
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Job added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job added successfully.
 *                 job:
 *                   $ref: '#/components/schemas/Job'
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
 */
router.post('/', addJob);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all job opportunities
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: A list of job opportunities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 */
router.get('/', getJobs);

export default router;
