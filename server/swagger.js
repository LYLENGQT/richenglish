const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "School Management API",
      version: "1.0.0",
      description: "API documentation for School Management System",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://your-production-url.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            statusCode: {
              type: "integer",
              description: "HTTP status code",
            },
          },
        },
        Student: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Student ID",
            },
            name: {
              type: "string",
              description: "Student name",
            },
            email: {
              type: "string",
              format: "email",
              description: "Student email",
            },
            phone: {
              type: "string",
              description: "Student phone number",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
          },
        },
        Teacher: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Teacher ID",
            },
            name: {
              type: "string",
              description: "Teacher name",
            },
            email: {
              type: "string",
              format: "email",
              description: "Teacher email",
            },
            subject: {
              type: "string",
              description: "Subject taught",
            },
          },
        },
        Class: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Class ID",
            },
            name: {
              type: "string",
              description: "Class name",
            },
            teacher_id: {
              type: "integer",
              description: "Teacher ID",
            },
            schedule: {
              type: "string",
              description: "Class schedule",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        cookieAuth: [],
      },
    ],
  },
  // Path to the API routes
  apis: ["./routes/*.js", "./controller/*.js", "./index.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
