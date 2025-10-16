const pool = require("../database/db");

const Student = {
  async findAll() {
    const [rows] = await pool.execute("SELECT * FROM students ORDER BY name");
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM students WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },

  async create(data) {
    const [result] = await pool.execute(
      `
      INSERT INTO students
      (name, age, nationality, manager_type, email, book, category_level, class_type, platform, platform_link, teacher_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        data.name,
        data.age,
        data.nationality,
        data.manager_type,
        data.email,
        data.book,
        data.category_level,
        data.class_type,
        data.platform,
        data.platform_link,
        data.teacher_id,
      ]
    );
    return result.insertId;
  },

  async update(id, data) {
    await pool.execute(
      `
      UPDATE students SET
      name=?, age=?, nationality=?, manager_type=?, email=?, book=?, category_level=?, class_type=?, platform=?, platform_link=?, teacher_id=?
      WHERE id=?
    `,
      [
        data.name,
        data.age,
        data.nationality,
        data.manager_type,
        data.email,
        data.book,
        data.category_level,
        data.class_type,
        data.platform,
        data.platform_link,
        data.teacher_id,
        id,
      ]
    );
    return true;
  },

  async delete(id) {
    await pool.execute("DELETE FROM students WHERE id = ?", [id]);
    return true;
  },
};

module.exports = Student;
