const pool = require("../database/db");

const Books = {
  /**
   * Get books with optional filters.
   * Options:
   *  - uploaded_by
   *  - book_id
   *  - teacher_id (books that have an assignment to this teacher)
   *  - student_id (books that have an assignment to this student)
   *  - assigned_by (books assigned by a particular user)
   *  - status (assignment status - only meaningful when teacher_id/student_id/assigned_by provided)
   *
   * If teacher_id/student_id/assigned_by/status are provided the query will JOIN book_assignments;
   * otherwise it returns books only.
   */
  async findAll(options = {}) {
    const {
      uploaded_by = null,
      book_id = null,
      teacher_id = null,
      student_id = null,
      assigned_by = null,
      status = null,
    } = options;

    const needsAssignmentJoin =
      teacher_id !== null ||
      student_id !== null ||
      assigned_by !== null ||
      status !== null;

    let sql = `
      SELECT DISTINCT
        b.id,
        b.title,
        b.filename,
        b.original_filename,
        b.path,
        b.uploaded_by,
        u.name AS uploaded_by_name,
        b.created_at
      FROM books b
      LEFT JOIN user u ON b.uploaded_by = u.id
    `;

    if (needsAssignmentJoin) {
      sql += " JOIN book_assignments ba ON ba.book_id = b.id ";
    }

    sql += " WHERE 1 = 1 ";
    const params = [];

    if (book_id !== null && book_id !== "") {
      sql += " AND b.id = ?";
      params.push(book_id);
    }
    if (uploaded_by !== null && uploaded_by !== "") {
      sql += " AND b.uploaded_by = ?";
      params.push(uploaded_by);
    }
    if (teacher_id !== null && teacher_id !== "") {
      sql += " AND ba.teacher_id = ?";
      params.push(teacher_id);
    }
    if (student_id !== null && student_id !== "") {
      sql += " AND ba.student_id = ?";
      params.push(student_id);
    }
    if (assigned_by !== null && assigned_by !== "") {
      sql += " AND ba.assigned_by = ?";
      params.push(assigned_by);
    }
    if (status !== null && status !== "") {
      sql += " AND ba.status = ?";
      params.push(status);
    }

    sql += " ORDER BY b.created_at DESC";

    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `
      SELECT b.*, u.name AS uploaded_by_name
      FROM books b
      LEFT JOIN user u ON b.uploaded_by = u.id
      WHERE b.id = ?
      LIMIT 1
      `,
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = Books;
