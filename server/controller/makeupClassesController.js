const pool = require('../database/db');
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require('../errors')

const getMakeupClass = async (req, res)=>{
try {
    const [rows] = await pool.execute(`
      SELECT mc.*, s.name as student_name, t.name as teacher_name
      FROM makeup_classes mc
      JOIN students s ON mc.student_id = s.id
      JOIN teachers t ON mc.teacher_id = t.id
      ORDER BY mc.makeup_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching makeup classes:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

const addMakeupClass = async (req,res)=>{
  try {
    const {
      student_id, teacher_id, original_class_id, makeup_date, makeup_time,
      duration_minutes, reason, absent_dates, status, notes
    } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO makeup_classes (student_id, teacher_id, original_class_id, makeup_date, 
                                 makeup_time, duration_minutes, reason, absent_dates, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [student_id, teacher_id, original_class_id, makeup_date, makeup_time,
        duration_minutes, reason, absent_dates, status || 'scheduled', notes]);

    res.json({ id: result.insertId, message: 'Makeup class scheduled successfully' });
  } catch (error) {
    console.error('Error scheduling makeup class:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

const updateMakeupClass = async (req,res)=>{
try {
    const { id } = req.params;
    const {
      student_id, teacher_id, original_class_id, makeup_date, makeup_time,
      duration_minutes, reason, absent_dates, status, notes
    } = req.body;

    await pool.execute(`
      UPDATE makeup_classes 
      SET student_id=?, teacher_id=?, original_class_id=?, makeup_date=?, 
          makeup_time=?, duration_minutes=?, reason=?, absent_dates=?, status=?, notes=?
      WHERE id=?
    `, [student_id, teacher_id, original_class_id, makeup_date, makeup_time,
        duration_minutes, reason, absent_dates, status, notes, id]);

    res.json({ message: 'Makeup class updated successfully' });
  } catch (error) {
    console.error('Error updating makeup class:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

const deleteMakeupClass = async (req,res)=>{
try {
    const { id } = req.params;
    await pool.execute('DELETE FROM makeup_classes WHERE id = ?', [id]);
    res.json({ message: 'Makeup class deleted successfully' });
  } catch (error) {
    console.error('Error deleting makeup class:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {getMakeupClass, addMakeupClass, updateMakeupClass, deleteMakeupClass}