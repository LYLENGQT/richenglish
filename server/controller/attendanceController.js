const pool = require('../database/db');
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require('../errors')

const getAttendance = async (req, res)=>{
try {
    const { date, student_id } = req.query;
    let query = `
      SELECT a.*, s.name as student_name, c.start_time, c.end_time
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN classes c ON a.class_id = c.id
    `;
    const params = [];

    if (date) {
      query += ' WHERE DATE(a.date) = ?';
      params.push(date);
    }
    if (student_id) {
      query += date ? ' AND a.student_id = ?' : ' WHERE a.student_id = ?';
      params.push(student_id);
    }

    query += ' ORDER BY a.date DESC, c.start_time';

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

const addAttendace = async (req,res)=>{
try {
    const { class_id, student_id, teacher_id, date, status, minutes_attended, notes } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO attendance (class_id, student_id, teacher_id, date, status, minutes_attended, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [class_id, student_id, teacher_id, date, status, minutes_attended, notes]);

    res.json({ id: result.insertId, message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {getAttendance, addAttendace}