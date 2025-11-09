const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllRecordings,
  getRecording,
  createRecording,
  updateRecording,
  deleteRecording,
} = require("../controller/recordingsController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/recording"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ["video/mp4", "video/mkv", "video/webm"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only video files are allowed"));
  },
});

router.use(authenticateToken);

router
  .route("/")
  .get(getAllRecordings)
  .post(upload.single("file"), createRecording);

router
  .route("/:id")
  .get(getRecording)
  .patch(requireAdmin, updateRecording)
  .delete(requireAdmin, deleteRecording);

module.exports = router;
