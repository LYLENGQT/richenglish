const { Attendance } = require("../model");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const redisClient = require("../database/redis");
const clearCache = require("../helper/clearCache");

const getAttendances = async (req, res) => {
  const cacheKey = "attendances:" + JSON.stringify(req.query);

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

  const query = {};
  const allowedFilters = ["teacher_id", "student_id", "class_id", "date"];

  allowedFilters.forEach((field) => {
    if (req.query[field]) {
      if (field === "date") {
        query[field] = new Date(req.query[field]);
      } else {
        query[field] = req.query[field];
      }
    }
  });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const attendances = await Attendance.find(query)
    .populate("teacher_id", "name email")
    .populate("student_id", "name email")
    .populate("class_id")
    .populate("screenshots")
    .populate("recordings")
    .skip(skip)
    .limit(limit);
  const total = await Attendance.countDocuments(query);

  const result = {
    attendances,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  return res.status(StatusCodes.OK).json(result);
};

const getAttendance = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `attendance:${id}`;

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

  const attendance = await Attendance.findById(id)
    .populate("teacher_id", "name email")
    .populate("student_id", "name email")
    .populate("class_id")
    .populate("screenshots")
    .populate("recordings");

  if (!attendance) {
    throw new NotFoundError("Attendance not found");
  }

  const result = { attendance };

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  res.status(StatusCodes.OK).json(result);
};

const addAttendance = async (req, res) => {
  const attendance = new Attendance(req.body);
  await attendance.save();

  // Clear cache after adding new attendance
  await clearCache("attendances:");

  res.status(StatusCodes.CREATED).json({ attendance });
};

const updateAttendance = async (req, res) => {
  const { id } = req.params;

  const attendance = await Attendance.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!attendance) {
    throw new NotFoundError("Attendance not found");
  }

  // Clear cache after updating
  await clearCache("attendances:");
  await clearCache(`attendance:${id}`);

  res.status(StatusCodes.OK).json({ attendance });
};

const deleteAttendance = async (req, res) => {
  const { id } = req.params;

  const attendance = await Attendance.findByIdAndDelete(id);

  if (!attendance) {
    throw new NotFoundError("Attendance not found");
  }

  // Clear cache after deleting
  await clearCache("attendances:");
  await clearCache(`attendance:${id}`);

  res
    .status(StatusCodes.OK)
    .json({ message: "Attendance deleted successfully" });
};

module.exports = {
  getAttendances,
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
};
