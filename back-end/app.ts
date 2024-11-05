// back-end/app.ts

import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { addJob, getJobs } from './controller/jobController';
import { applyForJob } from './controller/applicationController';
import { verifyAdmin } from './middleware/verifyAdmin';
import { adminRepository } from './repository/adminRepository';
import { jobRepository } from './repository/jobRepository';

// Optional: Seed initial data
import './util/seed';

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

// Define directories for file uploads
const uploadDir = path.join(__dirname, 'uploads');
const resumeDir = path.join(uploadDir, 'resumes');
const coverLetterDir = path.join(uploadDir, 'coverLetters');

// Ensure upload directories exist
fs.mkdirSync(resumeDir, { recursive: true });
fs.mkdirSync(coverLetterDir, { recursive: true });

// CORS Configuration
app.use(
    cors({
        origin: 'http://localhost:8080', // Update with your front-end URL
        credentials: true,
    })
);

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Serve static files (uploaded resumes and cover letters)
app.use('/uploads/resumes', express.static(resumeDir));
app.use('/uploads/coverLetters', express.static(coverLetterDir));

// Swagger Setup
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'ApplyWise API',
        version: '1.0.0',
        description: 'API documentation for ApplyWise',
    },
    components: {
        schemas: {
            Job: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    companyName: { type: 'string' },
                    jobTitle: { type: 'string' },
                    date: { type: 'string', format: 'date' },
                    status: { type: 'string' },
                    description: { type: 'string' },
                    requiredSkills: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                    adminId: { type: 'number' },
                },
            },
            Admin: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                },
            },
            Application: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    jobId: { type: 'number' },
                    applicantName: { type: 'string' },
                    applicantEmail: { type: 'string', format: 'email' },
                    resumeUrl: { type: 'string' },
                    coverLetterUrl: { type: 'string' },
                    appliedAt: { type: 'string', format: 'date-time' },
                },
            },
        },
    },
    servers: [
        {
            url: `http://localhost:${port}`,
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./controller/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb) {
        if (file.fieldname === 'resume') {
            cb(null, resumeDir);
        } else if (file.fieldname === 'coverLetter') {
            cb(null, coverLetterDir);
        } else {
            cb(new Error('Invalid field name'), '');
        }
    },
    filename: function (req: Request, file: Express.Multer.File, cb) {
        // Use timestamp and original name to avoid duplicates
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

// File filter to accept only PDF and DOCX for resumes and cover letters
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
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
};

// Initialize multer with storage, file filter, and file size limits
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Routes

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Get the status of the back-end server
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Back-end is running...
 */
app.get('/status', (req: Request, res: Response) => {
    res.json({ message: 'Back-end is running...' });
});

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Add a new job opportunity
 *     tags:
 *       - Jobs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - jobTitle
 *               - date
 *               - status
 *               - adminId
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
 *               description:
 *                 type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               adminId:
 *                 type: number
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
app.post('/jobs', verifyAdmin, addJob);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all job opportunities
 *     tags:
 *       - Jobs
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
app.get('/jobs', getJobs);

/**
 * @swagger
 * /jobs/{id}/apply:
 *   post:
 *     summary: Apply for a specific job by uploading resume and cover letter
 *     tags:
 *       - Applications
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
app.post(
    '/jobs/:id/apply',
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'coverLetter', maxCount: 1 },
    ]),
    applyForJob
);

// Centralized Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        return res.status(400).json({ message: err.message });
    } else if (err) {
        // Handle general errors
        return res.status(500).json({ message: err.message || 'An unexpected error occurred.' });
    }
    next();
});

// Start the server
app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
});
