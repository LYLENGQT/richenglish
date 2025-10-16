const pool = require("../database/db");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");

const getClass = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.*, s.name as student_name, s.nationality, s.manager_type,
             t.name as teacher_name
      FROM classes c
      JOIN students s ON c.student_id = s.id
      JOIN teachers t ON c.teacher_id = t.id
      ORDER BY c.start_time
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const addClass = async (req, res) => {
  try {
    const {
      student_id,
      teacher_id,
      start_time,
      end_time,
      duration_minutes,
      days_of_week,
      start_date,
      end_date,
      status,
    } = req.body;

    const [result] = await pool.execute(
      `
      INSERT INTO classes (student_id, teacher_id, start_time, end_time, 
                          duration_minutes, days_of_week, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        student_id,
        teacher_id,
        start_time,
        end_time,
        duration_minutes,
        days_of_week,
        start_date,
        end_date,
        status || "active",
      ]
    );

    res.json({ id: result.insertId, message: "Class created successfully" });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getClass, addClass };
