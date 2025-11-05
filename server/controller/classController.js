const { StatusCodes } = require("http-status-codes");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const { Class } = require("../model");

const createClass = async (req, res) => {
  const newClass = await Class.create(req.body);
  return res
    .status(StatusCodes.CREATED)
    .json({ message: "Class created successfully", class: newClass });
};

const getClasses = async (req, res) => {
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

  return res.status(StatusCodes.OK).json({
    classes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const getClassById = async (req, res) => {
  const { id } = req.params;
  const foundClass = await Class.findById(id)
    .populate("teacher_id", "name")
    .populate("student_id", "name");

  if (!foundClass) {
    throw new NotFoundError("Class not found");
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
