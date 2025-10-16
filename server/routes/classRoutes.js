const express = require("express");
const router = express.Router();
const { getClass, addClass } = require("../controller/classController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.route("/").get(getClass).post(addClass);

module.exports = router;
