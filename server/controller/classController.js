const { StatusCodes } = require("http-status-codes");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const { Class } = require("../model");
const redisClient = require("../database/redis");
const clearCache = require("../helper/clearCache");

const createClass = async (req, res) => {
  const newClass = await Class.create(req.body);

  // Clear cache after creating new class
  await clearCache("classes:");

  return res
    .status(StatusCodes.CREATED)
    .json({ message: "Class created successfully", class: newClass });
};

const getClasses = async (req, res) => {
  const cacheKey = "classes:" + JSON.stringify(req.query);

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
  const allowedFilters = [
    "teacher_id",
    "student_id",
    "type",
    "start_date",
    "end_date",
    "platform_link",
  ];

  allowedFilters.forEach((field) => {
    if (req.query[field]) {
      if (field === "start_date" || field === "end_date") {
        query[field] = new Date(req.query[field]);
      } else {
        query[field] = req.query[field];
      }
    }
  });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const classes = await Class.find(query)
    .populate("teacher_id", "name")
    .populate("student_id", "name")
    .skip(skip)
    .limit(limit)
    .sort({ start_date: 1, start_time: 1 });
  const total = await Class.countDocuments(query);

  const result = {
    classes,
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

const getClassById = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `class:${id}`;

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

  const foundClass = await Class.findById(id)
    .populate("teacher_id", "name")
    .populate("student_id", "name");

  if (!foundClass) {
    throw new NotFoundError("Class not found");
  }

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(foundClass));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  return res.status(StatusCodes.OK).json(foundClass);
};

const updateClass = async (req, res) => {
  const { id } = req.params;

  const updated = await Class.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new NotFoundError("Class not found");
  }

  // Clear cache after updating
  await clearCache("classes:");
  await clearCache(`class:${id}`);

  return res
    .status(StatusCodes.OK)
    .json({ message: "Class updated successfully", class: updated });
};

const deleteClass = async (req, res) => {
  const { id } = req.params;

  const deleted = await Class.findByIdAndDelete(id);

  if (!deleted) {
    throw new NotFoundError("Class not found");
  }

  // Clear cache after deleting
  await clearCache("classes:");
  await clearCache(`class:${id}`);

  return res
    .status(StatusCodes.OK)
    .json({ message: "Class deleted successfully" });
};

module.exports = {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
};
