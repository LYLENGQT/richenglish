const express = require("express");
const router = express.Router();
const {
  getAllBookAssignments,
  getBookAssignment,
  createBookAssignment,
  updateBookAssignment,
  deleteBookAssignment,
} = require("../controller/bookAssignController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);

router
  .route("/")
  .get(getAllBookAssignments)
  .post(requireAdmin("super-admin", "admin"), createBookAssignment);
router
  .route("/:id")
  .get(getBookAssignment)
  .patch(requireAdmin("super-admin", "admin"), updateBookAssignment)
  .delete(requireAdmin("super-admin", "admin"), deleteBookAssignment);

module.exports = router;
