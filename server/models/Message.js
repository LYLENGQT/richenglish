const pool = require("../database/db");

const MessageModel = {
  async createMessage(senderId, receiverId, text) {
    const [result] = await pool.query(
      `INSERT INTO message (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
      [senderId, receiverId, text]
    );
    return result;
  },

  async getMessagesBetweenUsers(currentUserId, chatPartnerId) {
    const [rows] = await pool.query(
      `
      SELECT 
        m.id, 
        m.sender_id AS senderId, 
        m.receiver_id AS receiverId, 
        m.message AS text, 
        m.created_at AS createdAt
      FROM message m
      WHERE 
        (m.sender_id = ? AND m.receiver_id = ?)
        OR
        (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
      `,
      [currentUserId, chatPartnerId, chatPartnerId, currentUserId]
    );
    return rows;
  },

  async getMessagebyId(id) {
    const [rows] = await pool.query(`SELECT * FROM message WHERE id = ?`, [id]);

    return rows;
  },
};

module.exports = MessageModel;
