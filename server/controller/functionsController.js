const pool = require("../database/db");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");

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

module.exports = { dashboardStats };
