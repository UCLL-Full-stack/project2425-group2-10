import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cron from 'node-cron';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import applicationRoutes from './routes/applicationRoutes';
import jobRoutes from './routes/jobRoutes';
import { applicationRepository } from './repository/applicationRepository';
import { jobRepository } from './repository/jobRepository';
// If not used, remove the next line
// import { applicationService } from './service/applicationService';

// Initialize environment variables
dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

const prisma = new PrismaClient();

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
        origin: 'http://localhost:8000', // Update with your front-end URL if needed
        credentials: true,
    })
);

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Middleware for parsing URL-encoded bodies (optional)
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to handle 'skills' only for job creation/update routes
app.use((req: Request, res: Response, next: NextFunction) => {
    // Apply this only to POST or PUT requests on '/jobs' route
    if (req.path.startsWith('/jobs') && (req.method === 'POST' || req.method === 'PUT')) {
        if (req.body && req.body.skills) {
            console.log('Original skills:', req.body.skills);

            if (typeof req.body.skills === 'string') {
                // If 'skills' is a comma-separated string, convert it to an array
                req.body.skills = req.body.skills
                    .split(',')
                    .map((skill: string) => skill.trim())
                    .filter((skill: string) => skill.length > 0);
                console.log('Transformed skills (from string):', req.body.skills);
            } else if (!Array.isArray(req.body.skills)) {
                // If 'skills' is not an array, wrap it in one
                req.body.skills = [String(req.body.skills)];
                console.log('Transformed skills (from single value):', req.body.skills);
            } else {
                console.log('Skills are already an array:', req.body.skills);
            }
        } else {
            console.log('No skills field found in request body for a job route.');
        }
    }
    next();
});

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
                    skills: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                    adminId: { type: 'number' },
                },
                required: ['id', 'companyName', 'jobTitle', 'date', 'status', 'adminId'],
            },
            Admin: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                },
                required: ['id', 'name', 'email'],
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
                    notes: { type: 'string' },
                    reminders: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Reminder' },
                    },
                },
                required: [
                    'id',
                    'jobId',
                    'applicantName',
                    'applicantEmail',
                    'resumeUrl',
                    'coverLetterUrl',
                    'appliedAt',
                    'status',
                ],
            },
            Reminder: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    applicationId: { type: 'number' },
                    reminderDate: { type: 'string', format: 'date-time' },
                    message: { type: 'string' },
                },
                required: ['id', 'applicationId', 'reminderDate'],
            },
        },
    },
    servers: [
        {
            url: `http://localhost:${port}`,
        },
    ],
};

const swaggerSpec = swaggerJSDoc({
    definition: swaggerDefinition,
    apis: [path.join(__dirname, '/routes/*.ts')],
});

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
        const sanitizedOriginalName = path.basename(file.originalname);
        cb(null, uniqueSuffix + '-' + sanitizedOriginalName);
    },
});

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

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Routes
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
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(500).json({ message: err.message || 'An unexpected error occurred.' });
    }
    next();
});

// Scheduler to Check Reminders Every Minute
cron.schedule('* * * * *', async () => {
    const currentDateTime = new Date();

    try {
        const dueReminders = await applicationRepository.getDueReminders(currentDateTime);

        for (const reminder of dueReminders) {
            const application = await applicationRepository.getApplicationById(reminder.applicationId);

            if (application) {
                const job = await jobRepository.getJobById(application.jobId);

                if (job) {
                    console.log(
                        `Reminder: Follow up on your application for "${job.jobTitle}" at "${job.companyName}"`
                    );
                    if (reminder.message) {
                        console.log(`Message: ${reminder.message}`);
                    }

                    const deleteSuccess = await applicationRepository.deleteReminder(reminder.id);
                    if (!deleteSuccess) {
                        console.error(`Failed to delete reminder with ID: ${reminder.id}`);
                    }
                } else {
                    console.error(`Job not found for application ID: ${application.id}`);
                }
            } else {
                console.error(`Application not found for reminder ID: ${reminder.id}`);
            }
        }
    } catch (error: unknown) {
        console.error('Error in reminder scheduler:', error);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});