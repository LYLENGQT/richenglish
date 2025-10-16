const pool = require("../database/db");

const SubstituteClass = {
  async findAll() {
    const [rows] = await pool.execute("SELECT * FROM substitute_classes");
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM substitute_classes WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async create(data) {
    const [result] = await pool.execute(
      `
      INSERT INTO substitute_classes (student_id, original_teacher_id, substitute_teacher_id, class_date, class_time, duration_minutes, reason, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        data.student_id,
        data.original_teacher_id,
        data.substitute_teacher_id,
        data.class_date,
        data.class_time,
        data.duration_minutes,
        data.reason,
        data.status,
        data.notes,
      ]
    );
    return result.insertId;
  },

  async update(id, data) {
    await pool.execute(
      `
      UPDATE substitute_classes SET
      student_id=?, original_teacher_id=?, substitute_teacher_id=?, class_date=?, class_time=?, duration_minutes=?, reason=?, status=?, notes=?
      WHERE id=?
    `,
      [
        data.student_id,
        data.original_teacher_id,
        data.substitute_teacher_id,
        data.class_date,
        data.class_time,
        data.duration_minutes,
        data.reason,
        data.status,
        data.notes,
        id,
      ]
    );
    return true;
  },

  async delete(id) {
    await pool.execute("DELETE FROM substitute_classes WHERE id = ?", [id]);
    return true;
  },
};

module.exports = SubstituteClass;
