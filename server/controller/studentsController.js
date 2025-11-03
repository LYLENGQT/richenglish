const Student = require("../model/Students");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getStudents = async (req, res) => {
  const query = {};
  const allowedFilters = [
    "name",
    "nationality",
    "manager_type",
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

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const students = await Student.find(query).skip(skip).limit(limit);
  const total = await Student.countDocuments(query);

  return res.status(StatusCodes.OK).json({
    students,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(StatusCodes.CREATED).json({ student });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) throw new NotFoundError("Student not found");

    res.status(StatusCodes.OK).json({ student });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) throw new NotFoundError("Student not found");

    res
      .status(StatusCodes.OK)
      .json({ message: "Student deleted successfully" });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

module.exports = {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
};
