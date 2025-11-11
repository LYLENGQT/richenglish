const Student = require("../model/Students");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const redisClient = require("../database/redis");
const clearCache = require("../helper/clearCache");

const getStudents = async (req, res) => {
  const cacheKey = "students:" + JSON.stringify(req.query);

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
    "name",
    "nationality",
    "category_level",
    "class_type",
    "platform",
  ];

  allowedFilters.forEach((field) => {
    if (req.query[field]) {
      if (field === "name") {
        query[field] = { $regex: req.query[field], $options: "i" };
      } else {
        query[field] = req.query[field];
      }
    }
  });

  const hasFilters = Object.keys(query).length > 0;

  let students, total, result;

  if (!hasFilters) {
    // No filters → return all students without pagination
    students = await Student.find();
    total = students.length;
    result = { students, total };
  } else {
    // Apply filters + pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    students = await Student.find(query).skip(skip).limit(limit);
    total = await Student.countDocuments(query);

    result = {
      students,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  return res.status(StatusCodes.OK).json(result);
};

const getStudent = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `student:${id}`;

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

  const student = await Student.findById(id);

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(student));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  res.status(StatusCodes.OK).json(student);
};

const addStudent = async (req, res) => {
  const student = new Student(req.body);
  await student.save();

  // Clear cache after creating new student
  await clearCache("students:");

  res.status(StatusCodes.CREATED).json({ student });
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  // Clear cache after updating
  await clearCache("students:");
  await clearCache(`student:${id}`);

  res.status(StatusCodes.OK).json({ student });
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findByIdAndDelete(id);

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  await clearCache("students:");
  await clearCache(`student:${id}`);

  res.status(StatusCodes.OK).json({ message: "Student deleted successfully" });
};

module.exports = {
  getStudents,
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
};
