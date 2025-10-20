const express = require("express");
const router = express.Router();
const { login, logout, refresh } = require("../controller/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/login", login);
router.delete("/logout", authenticateToken, logout);
router.get("/refresh", refresh);

module.exports = router;
