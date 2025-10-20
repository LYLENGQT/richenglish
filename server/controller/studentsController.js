const { StatusCodes } = require("http-status-codes");
const pool = require("../database/db");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const Students = require("../models/Students");

const getStudents = async (req, res) => {
  const { teacher_id } = req.query;

  if (teacher_id) {
    const teacher_students = await Students.findQuery({ teacher_id });

    return res
      .status(StatusCodes.OK)
      .json({ length: teacher_students.length, teacher_students });
  }

  const students = await Students.findAll();

  return res.status(StatusCodes.OK).json({ length: students.length, students });
};

const addStudent = async (req, res) => {
  try {
    const {
      name,
      age,
      nationality,
      manager_type,
      email,
      book,
      category_level,
      class_type,
      platform,
      platform_link,
      teacher_id,
    } = req.body;

    const [result] = await pool.execute(
      `
      INSERT INTO students (name, age, nationality, manager_type, email, book, 
                           category_level, class_type, platform, platform_link, teacher_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        name,
        age,
        nationality,
        manager_type,
        email,
        book,
        category_level,
        class_type,
        platform,
        platform_link,
        teacher_id,
      ]
    );

    res.json({ id: result.insertId, message: "Student created successfully" });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute("DELETE FROM students WHERE id = ?", [id]);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      age,
      nationality,
      manager_type,
      email,
      book,
      category_level,
      class_type,
      platform,
      platform_link,
      teacher_id,
    } = req.body;

    console.log(req.user);

    await pool.execute(
      `
      UPDATE students 
      SET name=?, age=?, nationality=?, manager_type=?, email=?, book=?,
          category_level=?, class_type=?, platform=?, platform_link=?, teacher_id=?
      WHERE id=?
    `,
      [
        name,
        age,
        nationality,
        manager_type,
        email,
        book,
        category_level,
        class_type,
        platform,
        platform_link,
        teacher_id,
        id,
      ]
    );

    res.json({ message: "Student updated successfully" });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getStudents, addStudent, deleteStudent, updateStudent };
