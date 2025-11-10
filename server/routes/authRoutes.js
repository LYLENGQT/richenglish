const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyOTP,
  resendOTP,
} = require("../controller/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/login", login);
router.delete("/logout", authenticateToken, logout);
router.get("/refresh", authenticateToken, refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", authenticateToken, resetPassword);
router.post("/resend-email", resendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;
