const pool = require('../database/db');

const MakeupClass = {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM makeup_classes');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM makeup_classes WHERE id = ?', [id]);
    return rows[0];
  },

  async create(data) {
    const [result] = await pool.execute(`
      INSERT INTO makeup_classes (student_id, teacher_id, original_class_id, makeup_date, makeup_time, duration_minutes, reason, absent_dates, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.student_id, data.teacher_id, data.original_class_id,
      data.makeup_date, data.makeup_time, data.duration_minutes,
      data.reason, data.absent_dates, data.status, data.notes
    ]);
    return result.insertId;
  },

  async update(id, data) {
    await pool.execute(`
      UPDATE makeup_classes SET
      student_id=?, teacher_id=?, original_class_id=?, makeup_date=?, makeup_time=?, duration_minutes=?, reason=?, absent_dates=?, status=?, notes=?
      WHERE id=?
    `, [
      data.student_id, data.teacher_id, data.original_class_id,
      data.makeup_date, data.makeup_time, data.duration_minutes,
      data.reason, data.absent_dates, data.status, data.notes, id
    ]);
    return true;
  },

  async delete(id) {
    await pool.execute('DELETE FROM makeup_classes WHERE id = ?', [id]);
    return true;
  }
};

module.exports = MakeupClass;
