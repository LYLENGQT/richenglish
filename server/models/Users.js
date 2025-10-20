const pool = require("../database/db");

const User = {
  async findAll(id = null) {
    let sql = "SELECT id, name, email, role, created_at, updated_at FROM user";
    const params = [];

    if (id) {
      sql += " WHERE id !=?";
      params.push(id);
    }

    sql += " ORDER by name";

    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, name, email, role, zoom_link, country, created_at, updated_at FROM user WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async create(name, email, hashedPassword, role = "teacher") {
    const [result] = await pool.execute(
      "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );
    return result.insertId;
  },

  async update(id, name, email, role, hashedPassword = null) {
    let query = "UPDATE user SET name=?, email=?, role=?";
    let params = [name, email, role];

    if (hashedPassword) {
      query += ", password=?";
      params.push(hashedPassword);
    }

    query += " WHERE id=?";
    params.push(id);

    await pool.execute(query, params);
    return true;
  },

  async delete(id) {
    await pool.execute("DELETE FROM user WHERE id = ?", [id]);
    return true;
  },

  findByEmail: async (email) => {
    const [rows] = await pool.execute("SELECT * FROM user WHERE email = ?", [
      email,
    ]);

    return rows[0];
  },

  async findAllTeacher() {
    const [rows] = await pool.execute(
      "SELECT * FROM user WHERE role = `teacher`"
    );

    return rows[0];
  },
};

module.exports = User;
