import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig";  // Path to your Swagger config
import authRoutes from "./routes/authRoutes";
import jobRoutes from "./routes/jobRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import cors from "cors";  // Import CORS
import multer from "multer";  // Import multer for file uploads
import fs from "fs";  // File system module to create the 'uploads' folder if it doesn't exist
import path from "path";  // Path module for handling file paths
import { Request, Response } from "express";
import prisma from "./prismaClient";

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS for your frontend
app.use(cors({
  origin: "http://localhost:8000",  // Frontend URL (adjust if needed)
  credentials: true,  // Allow cookies to be sent with the request (if needed)
}));

// Set up multer for handling file uploads (e.g., resume upload)
const upload = multer({
  dest: path.join(__dirname, "uploads"),  // Directory where files will be stored
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size of 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("application/pdf")) {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
}).single("file");  // No specific file name, can be any field in the form

export const applyForJob = async (req: Request, res: Response) => {
  const { fullName, email, coverLetter, question } = req.body;
  const jobId = req.params.jobId;
  const userId = req.user?.id; // Access the user ID from the request (added by middleware)

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User not authenticated" });
  }

  // Handle file upload using multer
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const resume = req.file?.path;  // Path of the uploaded file

    if (!resume) {
      return res.status(400).json({ error: "File upload is required" });
    }

    try {
      const application = await prisma.application.create({
        data: {
          fullName,
          email,
          resume,  // Save the resume path (or URL) in the database
          coverLetter,
          question,
          status: "Pending",
          jobId,
          userId,
        },
      });
      res.status(201).json(application);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to apply for the job" });
    }
  });
};

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define API routes
app.use("/auth", authRoutes);  // Authentication routes (register, login, etc.)
app.use("/jobs", jobRoutes);  // Job-related routes (listing jobs, applying for jobs, etc.)
app.use("/applications", applicationRoutes);  // Application-related routes (view applications, update status, etc.)

// Default route (optional, for testing)
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Error handling middleware (for catching errors in the request lifecycle)
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);  // Log the error stack to the server logs
  res.status(500).send({ message: "Something went wrong!" });  // Send a generic error response
});

// Start the server
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;