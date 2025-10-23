const pool = require("../database/db");

const ClassModel = {
  async findAll() {
    const [rows] = await pool.execute("SELECT * FROM classes");
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM classes WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },

  async create(data) {
    const [result] = await pool.execute(
      ` 
      INSERT INTO classes (student_id, teacher_id, start_time, end_time, duration_minutes, days_of_week, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        data.student_id,
        data.teacher_id,
        data.start_time,
        data.end_time,
        data.duration_minutes,
        data.days_of_week,
        data.start_date,
        data.end_date,
        data.status,
      ]
    );
    return result.insertId;
  },

  async update(id, data) {
    await pool.execute(
      `
      UPDATE classes SET
      student_id=?, teacher_id=?, start_time=?, end_time=?, duration_minutes=?, days_of_week=?, start_date=?, end_date=?, status=?
      WHERE id=?
    `,
      [
        data.student_id,
        data.teacher_id,
        data.start_time,
        data.end_time,
        data.duration_minutes,
        data.days_of_week,
        data.start_date,
        data.end_date,
        data.status,
        id,
      ]
    );
    return true;
  },

  async delete(id) {
    await pool.execute("DELETE FROM classes WHERE id = ?", [id]);
    return true;
  },

  async findActive(teacherId) {
    let query = `SELECT * FROM classes WHERE status = 'active'`;
    let params = [];

    if (teacherId !== undefined && teacherId !== null) {
      query += ` AND teacher_id = ?`;
      params.push(teacherId);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findAllDynamic(teache_id = null) {
    let query = `SELECT * FROM classes`;
    let params = [];

    if (teache_id !== undefined && teache_id !== null) {
      query += ` WHERE teacher_id = ?`;
      params.push(teache_id);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },
};

module.exports = ClassModel;
