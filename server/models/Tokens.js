const pool = require("../database/db");

const Token = {
  async findAllByTeacherId(teacherId) {
    const [rows] = await pool.execute(
      "SELECT id, token_type, token, is_valid, expires_at, created_at, updated_at FROM tokens WHERE teacher_id = ? ORDER BY created_at DESC",
      [teacherId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, teacher_id, token_type, token, is_valid, expires_at, created_at, updated_at FROM tokens WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async create(teacherId, tokenType = "access", token, expiresAt) {
    const [result] = await pool.execute(
      "INSERT INTO tokens (teacher_id, token_type, token, expires_at) VALUES (?, ?, ?, ?)",
      [teacherId, tokenType, token, expiresAt]
    );
    return result.insertId;
  },

  async updateValidity(id, isValid) {
    await pool.execute("UPDATE tokens SET is_valid = ? WHERE id = ?", [
      isValid,
      id,
    ]);
    return true;
  },

  async delete(id) {
    await pool.execute("DELETE FROM tokens WHERE id = ?", [id]);
    return true;
  },

  async findValidTokenByTokenString(token) {
    const [rows] = await pool.execute(
      "SELECT * FROM tokens WHERE token = ? AND is_valid = 1 AND expires_at > NOW()",
      [token]
    );
    return rows[0];
  },

  async revoke(token, email) {
    const [teachers] = await pool.execute(
      "SELECT id FROM teachers WHERE email = ?",
      [email]
    );

    if (teachers.length === 0) {
      return false;
    }

    const teacherId = teachers[0].id;

    const [result] = await pool.execute(
      "UPDATE tokens SET is_valid = 0 WHERE token = ? AND teacher_id = ?",
      [token, teacherId]
    );

    return result.affectedRows > 0;
  },

  async validate(tokenString) {
    const [rows] = await pool.execute(
      "SELECT * FROM tokens WHERE token = ? AND is_valid = 1 AND expires_at > NOW()",
      [tokenString]
    );
    return rows.length > 0;
  },
};

module.exports = Token;
