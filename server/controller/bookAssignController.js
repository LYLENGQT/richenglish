const { StatusCodes } = require("http-status-codes");
const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require("../errors");
const { BookAssign, User } = require("../model");
const redisClient = require("../database/redis");
const clearCache = require("../helper/clearCache");

const getAllBookAssignments = async (req, res) => {
  const cacheKey = "book-assignments:" + JSON.stringify(req.query);

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

  const assignments = await BookAssign.find()
    .populate("student_id", "name email")
    .populate("teacher_id", "name email")
    .populate("book_id", "title")
    .populate("assigned_by", "name role");

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(assignments));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  res.status(StatusCodes.OK).json(assignments);
};

const getBookAssignment = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `book-assignment:${id}`;

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

  const assignment = await BookAssign.findById(id)
    .populate("student_id", "name email")
    .populate("teacher_id", "name email")
    .populate("book_id", "title")
    .populate("assigned_by", "name role");

  if (!assignment) {
    throw new NotFoundError(`Book assignment ${id} not found`);
  }

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(assignment));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  res.status(StatusCodes.OK).json(assignment);
};

const createBookAssignment = async (req, res) => {
  const { student_id, teacher_id, book_id } = req.body;
  const assigned_by = req.user?.id;

  if (!student_id || !teacher_id || !book_id) {
    throw new BadRequestError("Missing required fields");
  }

  const admin = await User.findById(assigned_by);
  if (!admin || !["admin", "super-admin"].includes(admin.role)) {
    throw new UnauthenticatedError(
      "Only admin or super-admin can assign books"
    );
  }

  const assignment = await BookAssign.create({
    student_id,
    teacher_id,
    book_id,
    assigned_by,
  });

  // Clear cache after creating new assignment
  await clearCache("book-assignments:");

  res.status(StatusCodes.CREATED).json(assignment);
};

const updateBookAssignment = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  const assignment = await BookAssign.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (!assignment) {
    throw new NotFoundError(`Book assignment ${id} not found`);
  }

  // Clear cache after updating
  await clearCache("book-assignments:");
  await clearCache(`book-assignment:${id}`);

  res.status(StatusCodes.OK).json(assignment);
};

const deleteBookAssignment = async (req, res) => {
  const { id } = req.params;

  const deleted = await BookAssign.findByIdAndDelete(id);

  if (!deleted) {
    throw new NotFoundError(`Book assignment ${id} not found`);
  }

  // Clear cache after deleting
  await clearCache("book-assignments:");
  await clearCache(`book-assignment:${id}`);

  res.status(StatusCodes.OK).json({ message: "Deleted successfully" });
};

module.exports = {
  getAllBookAssignments,
  getBookAssignment,
  createBookAssignment,
  updateBookAssignment,
  deleteBookAssignment,
};
