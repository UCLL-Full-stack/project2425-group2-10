// app.ts

import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { verifyAdmin } from './middleware/verifyAdmin';
import { addJob, getJobs } from './controller/jobController';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(
  cors({
    origin: 'http://localhost:8080', // Update to match your frontend URL and port
    credentials: true,
  })
);

app.use(bodyParser.json());
app.post('/jobs', verifyAdmin, addJob);


// Swagger setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ApplyWise API',
    version: '1.0.0',
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
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./app.ts', './controller/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/status', (req, res) => {
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
 *       400:
 *         description: Missing required fields
 */

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

app.post('/jobs', addJob);
app.get('/jobs', getJobs);

app.listen(port, () => {
  console.log(`Back-end is running on port ${port}.`);
});
