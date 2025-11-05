const { StatusCodes } = require("http-status-codes");
const { Teacher } = require("../model");

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
  if (existing)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Email already registered" });

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

  res.status(StatusCodes.CREATED).json({
    id: teacher._id,
    message:
      "Application submitted successfully! You will receive an email within 1–3 days regarding the next step.",
  });
};

const getTeachers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Teacher.countDocuments({ role: "teacher" });
  const teachers = await Teacher.find({ role: "teacher" })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    teachers,
  });
};

const getTeacher = async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findById(id);
  if (!teacher)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Teacher not found" });
  res.json(teacher);
};

const createTeacher = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await Teacher.findOne({ email });
  if (existing)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Email already exists" });

  const teacher = await Teacher.create({
    name,
    email,
    password,
    role: "teacher",
  });

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

  if (!teacher)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Teacher not found" });

  res.json({ message: "Teacher updated successfully", teacher });
};

const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  const teacher = await Teacher.findByIdAndDelete(id);
  if (!teacher)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Teacher not found" });

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
