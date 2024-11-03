// back-end/app.ts

import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Job, User, Skill, StatusMessage } from '@types'; // Ensure correct import path

dotenv.config();
const app = express();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ApplyWise API',
      version: '1.0.0',
      description: 'API documentation for the ApplyWise application',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./app.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// In-memory data storage
const jobs: Job[] = [];
const users: User[] = [];
const skills: Skill[] = [];

// Sample data
jobs.push({
  id: 1,
  companyId: 1,
  title: 'Software Engineer',
  description: 'Develop software solutions.',
  deadline: '2024-12-31',
  requiredSkills: ['JavaScript', 'TypeScript'],
});

users.push({
  id: 1,
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
});

skills.push({
  id: 1,
  name: 'JavaScript',
  description: 'Programming language',
  category: 'Programming',
  level: 'Advanced',
});

// Validation middleware
function validateJob(req: Request, res: Response, next: NextFunction) {
  const { companyId, title, deadline, requiredSkills } = req.body;

  if (!companyId || !title || !deadline || !requiredSkills) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  next();
}

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Add a new job
 *     tags:
 *       - Jobs
 *     requestBody:
 *       description: Job data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobInput'
 *     responses:
 *       201:
 *         description: Job added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       400:
 *         description: Missing required fields
 */

app.post('/jobs', validateJob, (req: Request, res: Response) => {
  const { companyId, title, description, deadline, requiredSkills } = req.body;

  const newJob: Job = {
    id: jobs.length + 1,
    companyId,
    title,
    description,
    deadline,
    requiredSkills,
  };

  jobs.push(newJob);

  const statusMessage: StatusMessage = {
    message: 'Job added successfully.',
    type: 'success',
  };

  res.status(201).json({
    statusMessage,
    data: newJob,
  });
});

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Retrieve all jobs
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 */

app.get('/jobs', (req: Request, res: Response) => {
  res.json(jobs);
});

// Health check endpoint
app.get('/status', (req: Request, res: Response) => {
  res.json({ message: 'Back-end is running...' });
});

// Start the server
app.listen(port, () => {
  console.log(`Back-end is running on port ${port}.`);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     JobInput:
 *       type: object
 *       required:
 *         - companyId
 *         - title
 *         - deadline
 *         - requiredSkills
 *       properties:
 *         companyId:
 *           type: integer
 *           description: ID of the company
 *         title:
 *           type: string
 *           description: Job title
 *         description:
 *           type: string
 *           description: Job description
 *         deadline:
 *           type: string
 *           format: date
 *           description: Application deadline
 *         requiredSkills:
 *           type: array
 *           items:
 *             type: string
 *           description: Required skills
 *     Job:
 *       allOf:
 *         - $ref: '#/components/schemas/JobInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: Auto-generated job ID
 */
