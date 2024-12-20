import swaggerJsdoc from "swagger-jsdoc";

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",  // OpenAPI version
    info: {
      title: "ApplyWise API",  // Your API title
      version: "1.0.0",  // Your API version
      description: "Job portal API documentation",  // Description
    },
    servers: [
      {
        url: "http://localhost:3000", // Base URL for your API
      },
    ],
  },
  apis: ["./routes/*.ts"], // Path to your API route files (adjust based on your file structure)
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;