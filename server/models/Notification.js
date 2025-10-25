const pool = require("../database/db");

const Notification = {
  async createNotification({ id, user_id, type, message }) {
    const query = `
      INSERT INTO notifications (id, user_id, type, message)
      VALUES (?, ?, ?, ?)
    `;
    const values = [id, user_id, type, message];
    const [result] = await pool.execute(query, values);
    return { success: true, insertedId: id };
  },

  async updateNotification({ id, is_read }) {
    const query = `
      UPDATE notifications
      SET is_read = ?
      WHERE id = ?
    `;
    const values = [is_read, id];
    const [result] = await pool.execute(query, values);
    return { success: result.affectedRows > 0 };
  },

  async findNotification(user_id) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.execute(query, [user_id]);
    return rows;
  },
};

module.exports = Notification;
