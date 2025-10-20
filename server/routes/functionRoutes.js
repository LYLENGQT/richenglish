const express = require("express");
const router = express.Router();
const {
  dashboardStats,
  dashboard,
} = require("../controller/functionsController");
const { teacherApplication } = require("../controller/teacherController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/teacher-applications", teacherApplication);
router.get("/dashboard/stats", authenticateToken, dashboardStats);
router.get("/dashboard", authenticateToken, dashboard);

module.exports = router;
