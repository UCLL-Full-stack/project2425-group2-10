import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig";  // Path to your Swagger config
import authRoutes from "./routes/authRoutes";
import jobRoutes from "./routes/jobRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import cors from "cors"; // Import CORS

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS for your frontend
app.use(cors({
  origin: "http://localhost:8000",  // Frontend URL (adjust if needed)
}));

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

// Error handling middleware (optional)
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