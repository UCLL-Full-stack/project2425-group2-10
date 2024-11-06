// back-end/app.ts

import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import applicationRoutes from './routes/applicationRoutes';
import jobRoutes from './routes/jobRoutes';
import './util/seed';

// Optional: Seed initial data
// import './util/seed';

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
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);

// Middleware for parsing JSON bodies
app.use(express.json());

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
                required: ['id', 'companyName', 'jobTitle', 'date', 'status', 'adminId'],
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
                    status: { type: 'string', enum: ['Applied', 'Pending', 'Interviewing', 'Rejected', 'Accepted'] },
                    jobTitle: { type: 'string' },
                    companyName: { type: 'string' },
                },
                required: ['id', 'jobId', 'applicantName', 'applicantEmail', 'resumeUrl', 'coverLetterUrl', 'appliedAt', 'status', 'jobTitle', 'companyName'],
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
    apis: ['./controller/*.ts', './routes/*.ts'], // Path to the API docs
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

// Use jobRoutes for /jobs endpoints
app.use('/jobs', jobRoutes);

// Use applicationRoutes for /applications endpoints
app.use('/applications', applicationRoutes);

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


