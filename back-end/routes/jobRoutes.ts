// back-end/routes/jobRoutes.ts

import express from 'express';
import multer from 'multer';
import path from 'path';
import { addJob, getJobs, applyForJob } from '../controller/jobController';

const router = express.Router();

// Multer Configuration for File Uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'resume') {
        cb(null, path.join(__dirname, '../uploads/resumes'));
      } else if (file.fieldname === 'coverLetter') {
        cb(null, path.join(__dirname, '../uploads/coverLetters'));
      } else {
        cb(new Error('Invalid field name'), '');
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Routes

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

/**
 * @swagger
 * /jobs/{id}/apply:
 *   post:
 *     summary: Apply for a specific job by uploading resume and cover letter
 *     tags: [Jobs]
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
 *               applicantEmail:
 *                 type: string
 *                 format: email
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
router.post('/:id/apply', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
]), applyForJob);

export default router;
