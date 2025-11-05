require("express-async-errors");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const http = require("http");

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

// Routes
const authRoutes = require("./routes/authRoutes");
const studentsRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const bookRoutes = require("./routes/booksRoutes");
const functionRoutes = require("./routes/functionRoutes");
const messageRoutes = require("./routes/messageRoutes");
const scheduleRoutes = require("./routes/scheduleRoues");
const notificationRoutes = require("./routes/notificationsRoutes");
const classRoutes = require("./routes/classRoutes");
const payoutRoutes = require("./routes/payoutRoutes");

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
app.use("/api", functionRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(customErrorMiddleware);
app.use(notFoundMiddleware);

// --- Socket.IO integration ---
const server = http.createServer(app); // create http server
initSocket(server); // initialize socket.io with server

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
