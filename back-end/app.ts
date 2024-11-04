// back-end/app.ts

import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';

const app = express();
const port = process.env.APP_PORT || 3000;

// CORS Configuration
app.use(
  cors({
    origin: 'http://localhost:8080', // Frontend URL
    credentials: true,
  })
);

app.use(bodyParser.json());

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
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./app.ts', './controller/*.ts', './routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Status Route
app.get('/status', (req, res) => {
  res.json({ message: 'Back-end is running...' });
});

// Authentication Routes
app.use('/auth', authRoutes);

// Job Routes (secured)
app.use('/jobs', jobRoutes);

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
  });
}

export default app;
