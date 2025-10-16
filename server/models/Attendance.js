const pool = require("../database/db");

const Attendance = {
  async findAll() {
    const [rows] = await pool.execute("SELECT * FROM attendance");
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM attendance WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },

  async create(data) {
    const [result] = await pool.execute(
      `
      INSERT INTO attendance (class_id, student_id, teacher_id, date, status, minutes_attended, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        data.class_id,
        data.student_id,
        data.teacher_id,
        data.date,
        data.status,
        data.minutes_attended,
        data.notes,
      ]
    );
    return result.insertId;
  },

  async update(id, data) {
    await pool.execute(
      `
      UPDATE attendance SET
      class_id=?, student_id=?, teacher_id=?, date=?, status=?, minutes_attended=?, notes=?
      WHERE id=?
    `,
      [
        data.class_id,
        data.student_id,
        data.teacher_id,
        data.date,
        data.status,
        data.minutes_attended,
        data.notes,
        id,
      ]
    );
    return true;
  },

  async delete(id) {
    await pool.execute("DELETE FROM attendance WHERE id = ?", [id]);
    return true;
  },
};

module.exports = Attendance;
