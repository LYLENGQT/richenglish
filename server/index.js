require("express-async-errors");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const http = require("http");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const customErrorMiddleware = require("./middleware/errorHandler");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const { initSocket } = require("./lib/socket");
const connectDB = require("./database/connectDB");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());
app.use(cookieParser());

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "School Management API Docs",
  })
);

// Swagger JSON endpoint
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Routes
const authRoutes = require("./routes/authRoutes");
const studentsRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const bookRoutes = require("./routes/booksRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const messageRoutes = require("./routes/messageRoutes");
const scheduleRoutes = require("./routes/scheduleRoues");
const notificationRoutes = require("./routes/notificationsRoutes");
const classRoutes = require("./routes/classRoutes");
const payoutRoutes = require("./routes/payoutRoutes");
const bookAssignRoutes = require("./routes/bookAssignRoutes");

app.use("/api/class", classRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/payout", payoutRoutes);
app.use("/api/book-assign", bookAssignRoutes);
app.use("/api/dashboard", dashboardRoutes);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(customErrorMiddleware);
app.use(notFoundMiddleware);

// --- Socket.IO integration ---
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
});
