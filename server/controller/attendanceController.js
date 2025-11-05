const { Attendance } = require("../model");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAttendances = async (req, res) => {
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

  return res.status(StatusCodes.OK).json({
    attendances,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const addAttendance = async (req, res) => {
  const attendance = new Attendance(req.body);
  await attendance.save();
  res.status(StatusCodes.CREATED).json({ attendance });
};

const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const attendance = await Attendance.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!attendance) throw new NotFoundError("Attendance not found");

  res.status(StatusCodes.OK).json({ attendance });
};

const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  const attendance = await Attendance.findByIdAndDelete(id);

  if (!attendance) throw new NotFoundError("Attendance not found");

  res
    .status(StatusCodes.OK)
    .json({ message: "Attendance deleted successfully" });
};

const getAttendance = async (req, res) => {
  const { id } = req.params;
  const attendance = await Attendance.findById(id)
    .populate("teacher_id", "name email")
    .populate("student_id", "name email")
    .populate("class_id")
    .populate("screenshots")
    .populate("recordings");

  if (!attendance) throw new NotFoundError("Attendance not found");

  res.status(StatusCodes.OK).json({ attendance });
};

module.exports = {
  getAttendances,
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
};
