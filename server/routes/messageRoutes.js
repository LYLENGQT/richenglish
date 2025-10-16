const express = require("express");
const router = express.Router();
const {
  getTeachers,
  getMessage,
  sendMessage,
} = require("../controller/messageController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/get-teachers", getTeachers);
router.route("/:id").get(getMessage);
router.route("/").post(sendMessage);

module.exports = router;
