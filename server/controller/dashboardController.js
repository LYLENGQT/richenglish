const { StatusCodes } = require("http-status-codes");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const {
  User,
  SuperAdmin,
  Admin,
  Teacher,
  Student,
  Book,
  Class,
  Message,
  Attendance,
  Recording,
  Screenshot,
  Payout,
  Notification,
  BookAssign,
} = require("../model");

const dashboardStats = async (req, res) => {
  const { id, role } = req.user;

  if (!id || !role) {
    throw new UnauthenticatedError("User not authenticated");
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));

  if (role === "super-admin") {
    const stats = {
      totalAdmins: await Admin.countDocuments(),
      totalTeachers: await Teacher.countDocuments(),
      totalStudents: await Student.countDocuments(),
      totalBooks: await Book.countDocuments(),
      totalClasses: await Class.countDocuments(),
      totalPayouts: await Payout.countDocuments(),
      totalNotifications: await Notification.countDocuments(),
      totalBookAssignments: await BookAssign.countDocuments(),
    };
    return res.status(StatusCodes.OK).json({ role, stats });
  }

  if (role === "admin") {
    const stats = {
      assignedTeachers: await Teacher.countDocuments({ assignedAdmin: id }),
      totalStudents: await Student.countDocuments(),
      totalBooks: await Book.countDocuments(),
      totalClasses: await Class.countDocuments({ created_by: id }),
      totalNotifications: await Notification.countDocuments({ user_id: id }),
      totalPayouts: await Payout.countDocuments(),
    };

    const teacherIds = (
      await Teacher.find({ assignedAdmin: id }).select("_id")
    ).map((t) => t._id);

    const monthAttendance = await Attendance.aggregate([
      {
        $match: {
          teacher_id: { $in: teacherIds },
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hours" },
        },
      },
    ]);

    const weekAttendance = await Attendance.aggregate([
      {
        $match: {
          teacher_id: { $in: teacherIds },
          date: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hours" },
        },
      },
    ]);

    const ratePerHour = 200;
    stats.totalHoursMonth = monthAttendance[0]?.totalHours || 0;
    stats.totalHoursWeek = weekAttendance[0]?.totalHours || 0;
    stats.totalPaymentMonth = stats.totalHoursMonth * ratePerHour;
    stats.totalPaymentWeek = stats.totalHoursWeek * ratePerHour;

    return res.status(StatusCodes.OK).json({ role, stats });
  }

  if (role === "teacher") {
    const monthAttendance = await Attendance.aggregate([
      {
        $match: {
          teacher_id: id,
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hours" },
        },
      },
    ]);

    const weekAttendance = await Attendance.aggregate([
      {
        $match: {
          teacher_id: id,
          date: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hours" },
        },
      },
    ]);

    const ratePerHour = 200;

    const stats = {
      totalClasses: await Class.countDocuments({ teacher_id: id }),
      totalStudents: await Class.countDocuments({ teacher_id: id }),
      totalPayouts: await Payout.countDocuments({ teacher_id: id }),
      totalNotifications: await Notification.countDocuments({ user_id: id }),
      totalAssignments: await BookAssign.countDocuments({ teacher_id: id }),
      totalHoursMonth: monthAttendance[0]?.totalHours || 0,
      totalHoursWeek: weekAttendance[0]?.totalHours || 0,
      totalPaymentMonth: (monthAttendance[0]?.totalHours || 0) * ratePerHour,
      totalPaymentWeek: (weekAttendance[0]?.totalHours || 0) * ratePerHour,
      classes: await Class.find({ teacher_id: id }).select(
        "_id type start_date end_date start_time end_time reoccuringDays"
      ),
    };

    return res.status(StatusCodes.OK).json({ ...stats });
  }

  // Guard clause: Unauthorized role
  throw new UnauthorizedError("Role not authorized for dashboard stats");
};

const teacherListDropDown = async (req, res) => {
  const teachers = await Teacher.find({
    role: "teacher",
    accepted: true,
  }).select("_id name");

  res.status(StatusCodes.OK).json(teachers);
};

const studentListDropDown = async (req, res) => {
  const students = await Student.find({}).select("_id name");

  res.status(StatusCodes.OK).json(students);
};

module.exports = { dashboardStats, teacherListDropDown, studentListDropDown };
