import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Company, JobOpportunity } from './types/index';

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
  apis: ['./app.ts'], // Files containing annotations
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// In-memory data storage
const companies: Company[] = [];
const jobOpportunities: JobOpportunity[] = [];

// Sample company data
companies.push({
  id: 1,
  name: 'Tech Corp',
  address: '123 Tech Street',
  website: 'https://techcorp.com',
});

// Validation middleware
function validateJobOpportunity(req: Request, res: Response, next: NextFunction) {
  const { companyId, title, deadline, requiredSkills } = req.body;

  if (!companyId || !title || !deadline || !requiredSkills) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Check if company exists
  const companyExists = companies.some((company) => company.id === companyId);
  if (!companyExists) {
    return res.status(404).json({ error: 'Company not found.' });
  }

  next();
}

/**
 * @swagger
 * /job-opportunities:
 *   post:
 *     summary: Add a new job opportunity
 *     tags:
 *       - Job Opportunities
 *     requestBody:
 *       description: Job opportunity data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobOpportunityInput'
 *     responses:
 *       201:
 *         description: Job opportunity added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobOpportunity'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     JobOpportunityInput:
 *       type: object
 *       required:
 *         - companyId
 *         - title
 *         - deadline
 *         - requiredSkills
 *       properties:
 *         companyId:
 *           type: integer
 *           description: ID of the company offering the job
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
 *           description: List of required skills
 *     JobOpportunity:
 *       allOf:
 *         - $ref: '#/components/schemas/JobOpportunityInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: Auto-generated ID of the job opportunity
 */

// Add a new job opportunity
app.post('/job-opportunities', validateJobOpportunity, (req: Request, res: Response) => {
  const { companyId, title, description, deadline, requiredSkills } = req.body;

  const newJobOpportunity: JobOpportunity = {
    id: jobOpportunities.length + 1,
    companyId,
    title,
    description,
    deadline,
    requiredSkills,
  };

  jobOpportunities.push(newJobOpportunity);

  res.status(201).json({
    message: 'Job opportunity added successfully.',
    data: newJobOpportunity,
  });
});

// Health check endpoint
app.get('/status', (req: Request, res: Response) => {
  res.json({ message: 'Back-end is running...' });
});

// Start the server
app.listen(port, () => {
  console.log(`Back-end is running on port ${port}.`);
});
