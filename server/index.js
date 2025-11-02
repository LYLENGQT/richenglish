require("express-async-errors");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const http = require("http");
const mongoose = require("mongoose");

const customErrorMiddleware = require("./middleware/errorHandler");
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

// Routes
const authRoutes = require("./routes/authRoutes");
const studentsRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const bookRoutes = require("./routes/booksRoutes");
const makeupClass = require("./routes/makeUpClassRoutes");
const functionRoutes = require("./routes/functionRoutes");
const messageRoutes = require("./routes/messageRoutes");
const scheduleRoutes = require("./routes/scheduleRoues");
const notificationRoutes = require("./routes/notificationsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/makeup-classes", makeupClass);
app.use("/api/message", messageRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api", functionRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(customErrorMiddleware);

// --- Socket.IO integration ---
const server = http.createServer(app); // create http server
initSocket(server); // initialize socket.io with server

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
