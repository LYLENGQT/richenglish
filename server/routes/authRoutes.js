const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
} = require("../controller/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/login", login);
router.delete("/logout", authenticateToken, logout);
router.get("/refresh", authenticateToken, refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
