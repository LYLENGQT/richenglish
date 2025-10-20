const { StatusCodes } = require("http-status-codes");
const Schedules = require("../models/Schedule");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllSchedule = async (req, res) => {
  const { teacher_id } = req.query;

  const filter = {};
  if (
    teacher_id !== undefined &&
    teacher_id !== null &&
    String(teacher_id).trim() !== ""
  ) {
    filter.teacherId = teacher_id;
  }

  const schedules = await Schedules.findAll(filter);
  return res
    .status(StatusCodes.OK)
    .json({ length: schedules.length, schedules });
};

const getOneSchedule = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Schedule id is required");
  const schedule = await Schedules.findById(id);
  if (!schedule) throw new NotFoundError("Schedule not found");
  return res.status(StatusCodes.OK).json(schedule);
};

const createSchedule = async (req, res) => {
  const {
    teacher_id,
    student_id,
    date,
    start_time,
    end_time,
    zoom_link,
    status,
  } = req.body;

  if (!student_id || !date) {
    throw new BadRequestError("student_id and date are required");
  }

  const insertedId = await Schedules.create({
    teacher_id,
    student_id,
    date,
    start_time,
    end_time,
    zoom_link,
    status,
  });

  return res
    .status(StatusCodes.CREATED)
    .json({ id: insertedId, message: "Schedule created successfully" });
};

const updateSchedule = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Schedule id is required");

  const ok = await Schedules.update(id, req.body);
  if (!ok) throw new BadRequestError("No updatable fields provided");

  return res.status(StatusCodes.OK).json({ message: "Schedule updated" });
};

const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError("Schedule id is required");

  await Schedules.delete(id);
  return res.status(StatusCodes.OK).json({ message: "Schedule deleted" });
};

module.exports = {
  getAllSchedule,
  getOneSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
