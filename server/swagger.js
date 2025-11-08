const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rich English API",
      version: "1.0.0",
      description: "API documentation for Rich English System",
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
            error: {
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
              required: ["message", "statusCode"],
            },
          },
          required: ["error"],
        },

        Student: {
          type: "object",
          properties: {
            _id: { type: "string", description: "MongoDB ObjectId" },
            student_identification: {
              type: "string",
              description: "Auto-generated student code",
            },
            name: { type: "string", description: "Student name" },
            age: { type: "integer", description: "Student age" },
            nationality: { type: "string", enum: ["KOREAN", "CHINESE"] },
            manager_type: { type: "string", enum: ["KM", "CM"] },
            email: { type: "string", description: "Student email" },
            book: { type: "string", description: "Book assigned" },
            category_level: { type: "string", description: "Category level" },
            class_type: { type: "string", description: "Class type" },
            platform: {
              type: "string",
              enum: ["Zoom", "Voov"],
              default: "Zoom",
            },
            platform_link: { type: "string", description: "Meeting link" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        Teacher: {
          type: "object",
          properties: {
            _id: { type: "string", description: "Teacher ID" },
            firstName: { type: "string", description: "Teacher first name" },
            lastName: { type: "string", description: "Teacher last name" },
            email: {
              type: "string",
              format: "email",
              description: "Teacher email",
            },
            phone: { type: "string", description: "Phone number" },
            degree: { type: "string", description: "Degree attained" },
            major: { type: "string", description: "Field of study" },
            englishLevel: {
              type: "string",
              description: "English proficiency level",
            },
            experience: { type: "string", description: "Teaching experience" },
            motivation: { type: "string", description: "Reason for applying" },
            availability: {
              type: "string",
              description: "Available teaching schedule",
            },
            internetSpeed: {
              type: "string",
              description: "Internet speed test result",
            },
            computerSpecs: {
              type: "string",
              description: "Computer specifications",
            },
            hasWebcam: { type: "boolean", description: "Has working webcam" },
            hasHeadset: { type: "boolean", description: "Has working headset" },
            hasBackupInternet: {
              type: "boolean",
              description: "Has backup internet connection",
            },
            hasBackupPower: {
              type: "boolean",
              description: "Has backup power source",
            },
            teachingEnvironment: {
              type: "string",
              description: "Description of teaching space",
            },
            resume: { type: "string", description: "Resume file URL" },
            introVideo: {
              type: "string",
              description: "Introduction video URL",
            },
            speedTestScreenshot: {
              type: "string",
              description: "Screenshot of internet speed test",
            },
            zoom_link: { type: "string", description: "Zoom meeting link" },
            assignedAdmin: { type: "string", description: "Assigned admin ID" },
            accepted: {
              type: "boolean",
              description: "If the teacher is accepted",
            },
            birth_day: {
              type: "string",
              format: "date",
              description: "Date of birth",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Payout: {
          type: "object",
          properties: {
            _id: { type: "string", description: "Payout ID" },
            teacher_id: {
              type: "object",
              properties: {
                _id: { type: "string" },
                name: { type: "string" },
                email: { type: "string" },
              },
              description: "Reference to teacher",
            },
            start_date: {
              type: "string",
              format: "date",
              description: "Payout start date",
            },
            end_date: {
              type: "string",
              format: "date",
              description: "Payout end date",
            },
            duration: { type: "number", description: "Total hours worked" },
            total_class: {
              type: "number",
              description: "Total classes completed",
            },
            incentives: {
              type: "number",
              description: "Incentives/bonus",
              default: 0,
            },
            status: {
              type: "string",
              enum: ["pending", "processing", "completed"],
              description: "Status of the payout",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Book: {
          type: "object",
          properties: {
            _id: { type: "string", description: "Book ID" },
            id: { type: "string", description: "Short UUID for the book" },
            title: { type: "string", description: "Book title" },
            filename: {
              type: "string",
              description: "Stored file name on server",
            },
            original_filename: {
              type: "string",
              description: "Original uploaded file name",
            },
            path: {
              type: "string",
              description: "File path relative to server",
            },
            uploaded_by: {
              type: "object",
              nullable: true,
              properties: {
                _id: { type: "string" },
                name: { type: "string" },
                email: { type: "string" },
              },
              description: "Reference to the user who uploaded the book",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Upload timestamp",
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
        cookieAuth: [],
      },
    ],
  },
  // Path to the API routes
  apis: ["./routes/*.js", "./controller/*.js", "./index.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
