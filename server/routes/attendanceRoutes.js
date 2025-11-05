const express = require("express");
const router = express.Router();
const {
  getAttendances,
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controller/attendanceController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);

router
  .route("/")
  .get(getAttendances)
  .post(requireAdmin("admin", "super-admin"), addAttendance);

router
  .route("/:id")
  .get(getAttendance)
  .patch(requireAdmin("admin", "super-admin"), updateAttendance)
  .delete(requireAdmin("admin", "super-admin"), deleteAttendance);

module.exports = router;
