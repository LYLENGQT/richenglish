const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");
const {
  getNotification,
  createNotification,
  updateNotification,
} = require("../controller/notificationController");

router.use(authenticateToken);

router.route("/:id").get(getNotification).patch(updateNotification);
router.route("/").post(createNotification);

module.exports = router;
