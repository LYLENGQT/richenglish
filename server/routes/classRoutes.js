const express = require("express");
const router = express.Router();
const {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require("../controller/classController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);

router
  .route("/")
  .get(getClasses)
  .post(requireAdmin("super-admin", "admin"), createClass);
router
  .route("/:id")
  .get(getClassById)
  .patch(requireAdmin("super-admin", "admin"), updateClass)
  .delete(requireAdmin("super-admin", "admin"), deleteClass);

module.exports = router;
