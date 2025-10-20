const pool = require("../database/db");

const Schedule = {
  async findAll(filters = {}) {
    // accept either teacherId or teacher_id
    const teacherId = filters.teacherId ?? filters.teacher_id;

    const sqlParts = [
      `SELECT s.*, st.name AS student_name, u.name AS teacher_name`,
      `FROM schedules s`,
      `LEFT JOIN students st ON s.student_id = st.id`,
      `LEFT JOIN \`user\` u ON s.teacher_id = u.id`,
    ];

    const params = [];
    if (
      teacherId !== undefined &&
      teacherId !== null &&
      String(teacherId).trim() !== ""
    ) {
      sqlParts.push(`WHERE s.teacher_id = ?`);
      params.push(teacherId);
    }

    sqlParts.push(`ORDER BY s.date ASC, s.start_time ASC`);

    const sql = sqlParts.join(" ");
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT s.*, st.name AS student_name, u.name AS teacher_name
       FROM schedules s
       LEFT JOIN students st ON s.student_id = st.id
       LEFT JOIN \`user\` u ON s.teacher_id = u.id
       WHERE s.id = ?`,
      [id]
    );
    return rows[0];
  },

  async create(data) {
    const [result] = await pool.execute(
      `
      INSERT INTO schedules (teacher_id, student_id, date, start_time, end_time, zoom_link, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        data.teacher_id,
        data.student_id,
        data.date,
        data.start_time,
        data.end_time,
        data.zoom_link,
        data.status || "scheduled",
      ]
    );
    return result.insertId || result.insert_id || null;
  },

  async update(id, data) {
    // build set clause dynamically for updatable fields
    const fields = [];
    const params = [];
    const allowed = [
      "teacher_id",
      "student_id",
      "date",
      "start_time",
      "end_time",
      "zoom_link",
      "status",
    ];
    allowed.forEach((key) => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    });

    if (fields.length === 0) return false;

    params.push(id);
    const sql = `UPDATE schedules SET ${fields.join(", ")} WHERE id = ?`;
    await pool.execute(sql, params);
    return true;
  },

  async delete(id) {
    await pool.execute("DELETE FROM schedules WHERE id = ?", [id]);
    return true;
  },
};

module.exports = Schedule;
