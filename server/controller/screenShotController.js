const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const { Screenshot } = require("../model");
const { uploadFile } = require("../lib/googleapi");
const redisClient = require("../database/redis");
const clearCache = require("../helper/clearCache");

const uploadsDir = path.join(__dirname, "../uploads/screenshots");
fs.mkdirSync(uploadsDir, { recursive: true });

const getAllScreenshots = async (req, res) => {
  const cacheKey = "screenshots:" + JSON.stringify(req.query);

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

  const screenshots = await Screenshot.find()
    .populate("uploaded_by", "name email")
    .sort({ createdAt: -1 });

  const result = { screenshots };

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  res.status(StatusCodes.OK).json(result);
};

const getScreenshot = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `screenshot:${id}`;

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

  const screenshot = await Screenshot.findById(id).populate(
    "uploaded_by",
    "name email"
  );

  if (!screenshot) {
    throw new NotFoundError("Screenshot not found");
  }

  const result = { screenshot };

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  res.status(StatusCodes.OK).json(result);
};

const createScreenshot = async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("No screenshot uploaded");
  }

  const { class_id } = req.body;
  const uploaded_by = req.user.id;
  const localPath = req.file.path;
  const filename = req.file.originalname;

  const driveData = await uploadFile(localPath, "screenshot", filename);

  const screenshot = await Screenshot.create({
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

  // Clear cache after creating new screenshot
  await clearCache("screenshots:");

  res.status(StatusCodes.CREATED).json({ screenshot });
};

const updateScreenshot = async (req, res) => {
  const { id } = req.params;

  const updated = await Screenshot.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updated) {
    throw new NotFoundError("Screenshot not found");
  }

  // Clear cache after updating
  await clearCache("screenshots:");
  await clearCache(`screenshot:${id}`);

  res.status(StatusCodes.OK).json({ screenshot: updated });
};

const deleteScreenshot = async (req, res) => {
  const { id } = req.params;

  const deleted = await Screenshot.findByIdAndDelete(id);

  if (!deleted) {
    throw new NotFoundError("Screenshot not found");
  }

  await clearCache("screenshots:");
  await clearCache(`screenshot:${id}`);

  res.status(StatusCodes.OK).json({ message: "Screenshot deleted" });
};

module.exports = {
  getAllScreenshots,
  getScreenshot,
  createScreenshot,
  updateScreenshot,
  deleteScreenshot,
};
