const pool = require('../database/db');

const Teacher = {
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at, updated_at FROM teachers ORDER BY name'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at, updated_at FROM teachers WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async create(name, email, hashedPassword, role = 'teacher') {
    const [result] = await pool.execute(
      'INSERT INTO teachers (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    return result.insertId;
  },

  async update(id, name, email, role, hashedPassword = null) {
    let query = 'UPDATE teachers SET name=?, email=?, role=?';
    let params = [name, email, role];

    if (hashedPassword) {
      query += ', password=?';
      params.push(hashedPassword);
    }

    query += ' WHERE id=?';
    params.push(id);

    await pool.execute(query, params);
    return true;
  },

  async delete(id) {
    await pool.execute('DELETE FROM teachers WHERE id = ?', [id]);
    return true;
  },

   findByEmail: async (email)=>{
    const [rows] = await pool.execute(
      'SELECT * FROM teachers WHERE email = ?',
      [email]
    );

    return rows[0];
  }
};

module.exports = Teacher;
