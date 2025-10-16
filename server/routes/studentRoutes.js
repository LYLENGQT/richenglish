const express = require("express");
const router = express.Router();
const {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
} = require("../controller/studentsController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.route("/").get(getStudents).post(addStudent);
router.route("/:id").put(updateStudent).delete(deleteStudent);

module.exports = router;
