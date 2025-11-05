const express = require("express");
const router = express.Router();
const {
  getUsers,
  getMessage,
  sendMessage,
} = require("../controller/messageController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/get-user", getUsers);
router.route("/:id").get(getMessage);
router.route("/").post(sendMessage);

module.exports = router;
