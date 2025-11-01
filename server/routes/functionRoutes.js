const express = require("express");
const router = express.Router();
const {
  dashboardStats,
  dashboard,
} = require("../controller/functionsController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/dashboard/stats", authenticateToken, dashboardStats);
router.get("/dashboard", authenticateToken, dashboard);

module.exports = router;
