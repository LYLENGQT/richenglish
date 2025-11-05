const express = require("express");
const router = express.Router();
const {
  teacherApplication,
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controller/teacherController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.post("application", teacherApplication);

router.use(authenticateToken);

router
  .route("/")
  .get(requireAdmin("super-admin", "admin"), getTeachers)
  .post(requireAdmin("super-admin", "admin"), createTeacher);
router
  .route("/:id")
  .put(requireAdmin("super-admin", "admin"), updateTeacher)
  .delete(requireAdmin("super-admin"), deleteTeacher)
  .get(getTeacher);

module.exports = router;
