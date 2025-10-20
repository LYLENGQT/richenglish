const pool = require("../database/db");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../uploads/books");

// Ensure the directory exists
fs.mkdirSync(uploadsDir, { recursive: true });

const addBooks = async (req, res) => {
  try {
    const title =
      req.body.title || req.file.originalname.replace(/\.pdf$/i, "");
    const storedPath = path
      .relative(__dirname, req.file.path)
      .replace(/\\/g, "/");
    const [result] = await pool.execute(
      "INSERT INTO books (title, filename, original_filename, path, uploaded_by) VALUES (?, ?, ?, ?, ?)",
      [
        title,
        req.file.filename,
        req.file.originalname,
        storedPath,
        req.user.id || null,
      ]
    );
    res.json({ id: result.insertId, title });
  } catch (error) {
    console.error("Book upload error:", error);
    res.status(500).json({ error: "Failed to upload book" });
  }
};

const getBooks = async (req, res) => {
  try {
    // Accepts query params: teacher_id, student_id, assigned
    // Each param is optional; only applied when provided and non-empty.
    const { teacher_id = null, student_id = null, assigned = null } = req.query;

    const params = [];
    let sql = `
      SELECT DISTINCT
        b.id,
        b.title,
        b.created_at
      FROM books b
      LEFT JOIN book_assignments ba ON ba.book_id = b.id
      WHERE 1 = 1
    `;

    if (teacher_id !== undefined && teacher_id !== null && teacher_id !== "") {
      sql += " AND ba.teacher_id = ?";
      params.push(teacher_id);
    }

    if (student_id !== undefined && student_id !== null && student_id !== "") {
      sql += " AND ba.student_id = ?";
      params.push(student_id);
    }

    if (assigned !== undefined && assigned !== null && assigned !== "") {
      const a = String(assigned).toLowerCase();
      const isAssigned = a === "true" || a === "1" || a === "yes";
      const isUnassigned = a === "false" || a === "0" || a === "no";

      if (isAssigned) {
        sql += " AND ba.id IS NOT NULL";
      } else if (isUnassigned) {
        sql += " AND ba.id IS NULL";
      }
      // if assigned provided but unrecognized value, ignore and do not filter
    }

    sql += " ORDER BY b.created_at DESC";

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("Books list error:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

const bookReindex = async (req, res) => {
  try {
    const filesOnDisk = fs
      .readdirSync(uploadsDir)
      .filter((f) => f.toLowerCase().endsWith(".pdf"));
    const [rows] = await pool.execute("SELECT filename FROM books");
    const existing = new Set(rows.map((r) => r.filename));
    let created = 0;
    for (const fname of filesOnDisk) {
      if (!existing.has(fname)) {
        const title = fname.replace(/\.pdf$/i, "");
        const relPath = path
          .relative(__dirname, path.join(uploadsDir, fname))
          .replace(/\\/g, "/");
        await pool.execute(
          "INSERT INTO books (title, filename, original_filename, path, uploaded_by) VALUES (?, ?, ?, ?, ?)",
          [title, fname, fname, relPath, req.user.id || null]
        );
        created++;
      }
    }
    res.json({ created });
  } catch (error) {
    console.error("Books reindex error:", error);
    res.status(500).json({ error: "Failed to reindex books" });
  }
};

const bookStream = async (req, res) => {
  try {
    const filesOnDisk = fs
      .readdirSync(uploadsDir)
      .filter((f) => f.toLowerCase().endsWith(".pdf"));
    const [rows] = await pool.execute("SELECT filename FROM books");
    const existing = new Set(rows.map((r) => r.filename));
    let created = 0;
    for (const fname of filesOnDisk) {
      if (!existing.has(fname)) {
        const title = fname.replace(/\.pdf$/i, "");
        const relPath = path
          .relative(__dirname, path.join(uploadsDir, fname))
          .replace(/\\/g, "/");
        await pool.execute(
          "INSERT INTO books (title, filename, original_filename, path, uploaded_by) VALUES (?, ?, ?, ?, ?)",
          [title, fname, fname, relPath, req.user.id || null]
        );
        created++;
      }
    }
    res.json({ created });
  } catch (error) {
    console.error("Books reindex error:", error);
    res.status(500).json({ error: "Failed to reindex books" });
  }
};

module.exports = {
  bookStream,
  bookReindex,
  getBooks,
  addBooks,
};
