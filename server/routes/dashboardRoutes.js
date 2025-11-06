const express = require("express");
const router = express.Router();
const { dashboardStats } = require("../controller/dashboardController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/stats", authenticateToken, dashboardStats);

module.exports = router;
