const express = require("express");
const router = express.Router();
const {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controller/studentsController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);

router
  .route("/")
  .get(getStudents)
  .post(requireAdmin("super-admin"), addStudent);

router.route("/:id").put(updateStudent).delete(deleteStudent);

module.exports = router;
