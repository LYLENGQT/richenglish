const {
  getAllSchedule,
  getOneSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controller/scheduleController");
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.route("/").get(getAllSchedule).post(createSchedule);
router
  .route("/:id")
  .get(getOneSchedule)
  .patch(updateSchedule)
  .delete(deleteSchedule);

module.exports = router;
