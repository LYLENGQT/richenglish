const { StatusCodes } = require("http-status-codes");
const pool = require("../database/db");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const Student = require("../models/Students");
const Class = require("../models/Class");
const User = require("../models/Users");
const Books = require("../models/Books");
const AssignBook = require("../models/AssignBook");

const dashboardStats = async (req, res) => {
  try {
    const [studentCount] = await pool.execute(
      "SELECT COUNT(*) as count FROM students"
    );
    const [classCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM classes WHERE status = "active"'
    );
    const [attendanceCount] = await pool.execute(
      "SELECT COUNT(*) as count FROM attendance WHERE DATE(date) = CURDATE()"
    );
    const [makeupCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM makeup_classes WHERE status = "scheduled"'
    );

    res.json({
      totalStudents: studentCount[0].count,
      activeClasses: classCount[0].count,
      todayAttendance: attendanceCount[0].count,
      pendingMakeups: makeupCount[0].count,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const dashboard = async (req, res) => {
  const { id, role } = req.user;

  const studentCount =
    role === "teacher"
      ? await Student.studentCount()
      : await Student.studentCount(id);

  const activeClass =
    role === "teacher" ? await Class.findActive() : await Class.findActive(id);

  let teacher = null;
  if (role === "teacher") {
    teacher = await User.findById(id);
  } else {
    const [teachers] = await pool.execute(
      "SELECT name, status as total FROM `user` WHERE role = 'teacher'"
    );
    teacher = teachers;
  }

  const scheduleQuery =
    role === "teacher"
      ? "SELECT * FROM schedules WHERE status = 'scheduled'"
      : "SELECT * FROM schedules WHERE status = 'scheduled' AND teacher_id = ?";

  const params = role === "teacher" ? [] : [id];
  const [schedule] = await pool.query(scheduleQuery, params);

  let payouts = null;
  if (role !== "teacher") {
    const [result] = await pool.query("SELECT * FROM payouts");
    payouts = result;
  }

  const books =
    role === "teacher"
      ? await AssignBook.findAll({ teacher_id: id })
      : await Books.findAll();

  let todayAttendance = null;

  if (role === "teacher") {
    const [result] = await pool.query(
      "SELECT * FROM schedules WHERE teacher_id = ? AND DATE(date) = CURDATE()",
      [id]
    );
    todayAttendance = [result[0]];
  }

  let pendingMakeups = null;
  if (role === "teacher") {
    const [result] = await pool.query(
      'SELECT * FROM makeup_classes WHERE status = "scheduled" AND teacher_id = ?',
      [id]
    );
    pendingMakeups = [result[0]];
  }

  res.status(StatusCodes.OK).json({
    students: studentCount,
    schedule: schedule,
    books: books.length,
    todayAttendance,
    pendingMakeups: pendingMakeups,
    activeClass,
    payouts,
    teacher,
    activeClass,
  });
};

module.exports = { dashboardStats, dashboard };
