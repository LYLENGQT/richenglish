const pool = require("../database/db");

const MessageModel = {
  async createMessage(senderId, receiverId, text) {
    const [result] = await pool.query(
      `INSERT INTO message (sender_id, receiver_id, message, is_read) VALUES (?, ?, ?, 0)`,
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
        m.is_read AS isRead,
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

  async markMessagesAsRead(currentUserId, chatPartnerId) {
    await pool.query(
      `UPDATE message SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0`,
      [chatPartnerId, currentUserId]
    );
  },

  async getUnreadCountsBySender(currentUserId) {
    const [rows] = await pool.query(
      `SELECT m.sender_id AS senderId, COUNT(*) AS unreadCount
       FROM message m
       WHERE m.receiver_id = ? AND m.is_read = 0
       GROUP BY m.sender_id`,
      [currentUserId]
    );

    return rows;
  },

  async getMessagebyId(id) {
    const [rows] = await pool.query(
      `SELECT 
        m.id,
        m.sender_id AS senderId,
        m.receiver_id AS receiverId,
        m.message AS text,
        m.is_read AS isRead,
        m.created_at AS createdAt
      FROM message m
      WHERE m.id = ?`,
      [id]
    );

    return rows;
  },
};

module.exports = MessageModel;
