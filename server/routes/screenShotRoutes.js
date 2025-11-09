const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllScreenshots,
  getScreenshot,
  createScreenshot,
  updateScreenshot,
  deleteScreenshot,
} = require("../controller/screenShotController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/screenshots"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

router.use(authenticateToken);

router
  .route("/")
  .get(getAllScreenshots)
  .post(upload.single("file"), createScreenshot);

router
  .route("/:id")
  .get(getScreenshot)
  .patch(requireAdmin, updateScreenshot)
  .delete(requireAdmin, deleteScreenshot);

module.exports = router;
