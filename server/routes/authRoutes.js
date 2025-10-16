const express = require("express");
const router = express.Router();
const { login, logout } = require("../controller/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/login", login);
router.delete("/logout", authenticateToken, logout);

module.exports = router;
