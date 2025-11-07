const express = require("express");
const router = express.Router();
const {
  dashboardStats,
  studentListDropDown,
  teacherListDropDown,
} = require("../controller/dashboardController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/stats", authenticateToken, dashboardStats);
router.get("/students", authenticateToken, studentListDropDown);
router.get(
  "/teachers",
  authenticateToken,
  requireAdmin("admin", "super-admin", "teacher"),
  teacherListDropDown
);

module.exports = router;
