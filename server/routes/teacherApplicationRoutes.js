const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplications,
  updateApplicationStatus,
} = require("../controller/teacherApplicationController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/", createApplication);

router.use(authenticateToken);

router.get("/", getApplications);
router.patch("/:id/status", updateApplicationStatus);

module.exports = router;

