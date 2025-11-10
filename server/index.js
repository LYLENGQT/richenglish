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
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.use(helmet());
app.use(cookieParser());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "School Management API Docs",
  })
);
// app.get("/auth/google", (req, res) => {
//   const { google } = require("googleapis");
//   const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     "http://localhost:5000/oauth2callback" // temporary
//   );

//   const url = oauth2Client.generateAuthUrl({
//     access_type: "offline", // important to get refresh token
//     scope: ["https://www.googleapis.com/auth/drive.file"],
//   });

//   res.redirect(url); // you go to Google login page
// });

// app.get("/oauth2callback", async (req, res) => {
//   const { code } = req.query;
//   const { google } = require("googleapis");
//   const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     "http://localhost:5000/oauth2callback"
//   );

//   const { tokens } = await oauth2Client.getToken(code);
//   console.log(tokens); // contains refresh_token
//   res.send("✅ Check console for refresh token and save it in .env");
// });

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

const authRoutes = require("./routes/authRoutes");
const studentsRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const bookRoutes = require("./routes/booksRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationsRoutes");
const classRoutes = require("./routes/classRoutes");
const payoutRoutes = require("./routes/payoutRoutes");
const bookAssignRoutes = require("./routes/bookAssignRoutes");
const recordingRoutes = require("./routes/recordingRoutes");
const screenShotRoutes = require("./routes/screenShotRoutes");

app.use("/api/v1/class", classRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentsRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/teacher", teacherRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/payout", payoutRoutes);
app.use("/api/v1/book-assign", bookAssignRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/recording", recordingRoutes);
app.use("/api/v1/screen-shot", screenShotRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
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
