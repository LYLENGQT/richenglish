const express = require("express");
const router = express.Router();
const {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controller/teacherController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.route("/").get(getTeachers).post(createTeacher);
router.route("/:id").put(updateTeacher).delete(deleteTeacher);

module.exports = router;
