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

const uploadsDir = path.join(__dirname, "../uploads/screenshots");
fs.mkdirSync(uploadsDir, { recursive: true });

const getAllScreenshots = async (req, res) => {
  const screenshots = await Screenshot.find()
    .populate("uploaded_by", "name email")
    .sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json({ screenshots });
};

const getScreenshot = async (req, res) => {
  const { id } = req.params;
  const screenshot = await Screenshot.findById(id).populate(
    "uploaded_by",
    "name email"
  );
  if (!screenshot) throw new NotFoundError("Screenshot not found");
  res.status(StatusCodes.OK).json({ screenshot });
};

const createScreenshot = async (req, res) => {
  if (!req.file) throw new BadRequestError("No screenshot uploaded");

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

  res.status(StatusCodes.CREATED).json({ screenshot });
};

const updateScreenshot = async (req, res) => {
  const { id } = req.params;
  const updated = await Screenshot.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updated) throw new NotFoundError("Screenshot not found");
  res.status(StatusCodes.OK).json({ screenshot: updated });
};

const deleteScreenshot = async (req, res) => {
  const { id } = req.params;
  const deleted = await Screenshot.findByIdAndDelete(id);
  if (!deleted) throw new NotFoundError("Screenshot not found");
  res.status(StatusCodes.OK).json({ message: "Screenshot deleted" });
};

module.exports = {
  getAllScreenshots,
  getScreenshot,
  createScreenshot,
  updateScreenshot,
  deleteScreenshot,
};
