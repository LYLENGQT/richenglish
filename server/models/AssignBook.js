const pool = require("../database/db");

const AssignBook = {
  /**
   * Get assignments with optional filters.
   * options:
   *  - teacher_id
   *  - student_id
   *  - assigned_by
   *  - status
   *  - book_id
   *
   * Only includes WHERE clauses for params that are not null/undefined/"".
   */
  async findAll(options = {}) {
    const {
      teacher_id = null,
      student_id = null,
      assigned_by = null,
      status = null,
      book_id = null,
    } = options;

    let sql = `
      SELECT
        ba.id,
        ba.book_id,
        b.title AS book_title,
        b.filename AS book_filename,
        ba.student_id,
        s.name AS student_name,
        ba.teacher_id,
        t.name AS teacher_name,
        ba.assigned_by,
        a.name AS assigned_by_name,
        ba.date_assigned,
        ba.status
      FROM book_assignments ba
      JOIN books b ON ba.book_id = b.id
      JOIN students s ON ba.student_id = s.id
      LEFT JOIN user t ON ba.teacher_id = t.id
      LEFT JOIN user a ON ba.assigned_by = a.id
      WHERE 1 = 1
    `;

    const params = [];

    if (book_id !== null && book_id !== "") {
      sql += " AND ba.book_id = ?";
      params.push(book_id);
    }
    if (student_id !== null && student_id !== "") {
      sql += " AND ba.student_id = ?";
      params.push(student_id);
    }
    if (teacher_id !== null && teacher_id !== "") {
      sql += " AND ba.teacher_id = ?";
      params.push(teacher_id);
    }
    if (assigned_by !== null && assigned_by !== "") {
      sql += " AND ba.assigned_by = ?";
      params.push(assigned_by);
    }
    if (status !== null && status !== "") {
      sql += " AND ba.status = ?";
      params.push(status);
    }

    sql += " ORDER BY ba.date_assigned DESC";

    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  // optional helper to get a single assignment by id
  async findById(id) {
    const [rows] = await pool.execute(
      `
      SELECT
        ba.*,
        b.title AS book_title,
        b.filename AS book_filename,
        s.name AS student_name,
        t.name AS teacher_name,
        a.name AS assigned_by_name
      FROM book_assignments ba
      JOIN books b ON ba.book_id = b.id
      JOIN students s ON ba.student_id = s.id
      LEFT JOIN user t ON ba.teacher_id = t.id
      LEFT JOIN user a ON ba.assigned_by = a.id
      WHERE ba.id = ?
      LIMIT 1
      `,
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = AssignBook;
