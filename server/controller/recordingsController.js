const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const Recording = require("../model/Recording");
const { uploadFile } = require("../lib/googleapi");
const redisClient = require("../database/redis");
const clearCache = require("../helper/clearCache");

const uploadsDir = path.join(__dirname, "../uploads/recording");
fs.mkdirSync(uploadsDir, { recursive: true });

const getAllRecordings = async (req, res) => {
  const cacheKey = "recordings:" + JSON.stringify(req.query);

  // Try to get from cache
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("⚡ Redis Cache Hit:", cacheKey);
      return res.status(StatusCodes.OK).json(JSON.parse(cached));
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const recordings = await Recording.find()
    .populate("class_id uploaded_by", "name email")
    .sort({ createdAt: -1 });

  const result = { recordings };

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  res.status(StatusCodes.OK).json(result);
};

const getRecording = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `recording:${id}`;

  // Try to get from cache
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("⚡ Redis Cache Hit:", cacheKey);
      return res.status(StatusCodes.OK).json(JSON.parse(cached));
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const recording = await Recording.findById(id).populate(
    "class_id uploaded_by",
    "name email"
  );

  if (!recording) {
    throw new NotFoundError("Recording not found");
  }

  const result = { recording };

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  res.status(StatusCodes.OK).json(result);
};

const createRecording = async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("No file uploaded");
  }

  const { class_id } = req.body;
  const uploaded_by = req.user.id;
  const localPath = req.file.path;
  const filename = req.file.originalname;

  const driveData = await uploadFile(localPath, "recording", filename);

  const recording = await Recording.create({
    class_id,
    uploaded_by,
    path: localPath,
    filename,
    drive: {
      id: driveData.id,
      webViewLink: driveData.webViewLink,
      src: driveData.src,
    },
  });

  // Clear cache after creating new recording
  await clearCache("recordings:");

  res.status(StatusCodes.CREATED).json({ recording });
};

const updateRecording = async (req, res) => {
  const { id } = req.params;

  const updated = await Recording.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updated) {
    throw new NotFoundError("Recording not found");
  }

  // Clear cache after updating
  await clearCache("recordings:");
  await clearCache(`recording:${id}`);

  res.status(StatusCodes.OK).json({ recording: updated });
};

const deleteRecording = async (req, res) => {
  const { id } = req.params;

  const deleted = await Recording.findByIdAndDelete(id);

  if (!deleted) {
    throw new NotFoundError("Recording not found");
  }

  // Clear cache after deleting
  await clearCache("recordings:");
  await clearCache(`recording:${id}`);

  res.status(StatusCodes.OK).json({ message: "Recording deleted" });
};

module.exports = {
  getAllRecordings,
  getRecording,
  createRecording,
  updateRecording,
  deleteRecording,
};
