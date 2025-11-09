const { StatusCodes } = require("http-status-codes");
const { Teacher } = require("../model");
const redisClient = require("../database/redis");
const clearCache = require("../helper/clearCache");
const { sendMail } = require("../lib/nodemailer");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");

// Create (teacher application)
const teacherApplication = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    degree,
    major,
    englishLevel,
    experience,
    motivation,
    availability,
    internetSpeed,
    computerSpecs,
    hasWebcam,
    hasHeadset,
    hasBackupInternet,
    hasBackupPower,
    teachingEnvironment,
    resume,
    introVideo,
    speedTestScreenshot,
  } = req.body;

  const existing = await Teacher.findOne({ email });
  if (existing) {
    throw new BadRequestError("Email already registered");
  }

  const teacher = await Teacher.create({
    name: `${firstName} ${lastName}`,
    email,
    password,
    role: "teacher",
    firstName,
    lastName,
    phone,
    degree,
    major,
    englishLevel,
    experience,
    motivation,
    availability,
    internetSpeed,
    computerSpecs,
    hasWebcam,
    hasHeadset,
    hasBackupInternet,
    hasBackupPower,
    teachingEnvironment,
    resume,
    introVideo,
    speedTestScreenshot,
  });

  // Clear cache after creating new teacher
  await clearCache("teachers:");

  await sendMail(
    email,
    "Thank you for applying!",
    `Hi ${firstName},\n\nThank you for submitting your teaching application. Our team will review your profile and get back to you within 1–3 days.\n\nBest regards,\nThe Recruitment Team`
  );

  res.status(StatusCodes.CREATED).json({
    id: teacher._id,
    message:
      "Application submitted successfully! You will receive an email within 1–3 days regarding the next step.",
  });
};

const getTeachers = async (req, res) => {
  const cacheKey = "teachers:" + JSON.stringify(req.query);

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
    "country",
    "degree",
    "major",
    "englishLevel",
    "accepted",
    "hasWebcam",
    "hasBackupInternet",
    "hasBackupPower",
    "hasHeadset",
  ];

  allowedFilters.forEach((field) => {
    if (req.query[field]) {
      if (
        [
          "accepted",
          "hasWebcam",
          "hasBackupInternet",
          "hasBackupPower",
          "hasHeadset",
        ].includes(field)
      ) {
        query[field] = req.query[field] === "true";
      } else {
        query[field] = req.query[field];
      }
    }
  });

  if (req.query.search) {
    query.$or = [
      { firstName: { $regex: req.query.search, $options: "i" } },
      { lastName: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const teachers = await Teacher.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Teacher.countDocuments(query);

  const result = {
    teachers,
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

const getTeacher = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `teacher:${id}`;

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

  const teacher = await Teacher.findById(id);

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(teacher));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  res.json(teacher);
};

const createTeacher = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await Teacher.findOne({ email });
  if (existing) {
    throw new BadRequestError("Email already exists");
  }

  const teacher = await Teacher.create({
    name,
    email,
    password,
    role: "teacher",
  });

  // Clear cache after creating new teacher
  await clearCache("teachers:");
  await clearCache("teacher:");

  res
    .status(StatusCodes.CREATED)
    .json({ id: teacher._id, message: "Teacher created successfully" });
};

const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const teacher = await Teacher.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Clear cache after updating
  await clearCache("teachers:");
  await clearCache(`teacher:${id}`);

  res.json({ message: "Teacher updated successfully", teacher });
};

const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  const teacher = await Teacher.findByIdAndDelete(id);

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Clear cache after deleting
  await clearCache("teachers:");
  await clearCache(`teacher:${id}`);

  res.json({ message: "Teacher deleted successfully" });
};

module.exports = {
  teacherApplication,
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
