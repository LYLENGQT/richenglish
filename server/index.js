const express = require('express');
const cors = require('cors');
const pool = require('./database/db')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// Initialize books table if not exists
(async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        original_filename VARCHAR(255) NULL,
        path VARCHAR(512) NOT NULL,
        uploaded_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    // Ensure original_filename exists for older tables
    await pool.execute(`
      ALTER TABLE books 
      ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255) NULL AFTER filename;
    `);
  } catch (err) {
    console.error('Failed ensuring books table:', err);
  }
})();

// Routes
const authRoutes = require('./routes/authRoutes')
const studentsRoutes = require('./routes/studentRoutes')
const classRoutes = require('./routes/classRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const bookRoutes = require('./routes/booksRoutes')
const makeupClass = require('./routes/makeUpClassRoutes')
const functionRoutes = require('./routes/functionRoutes')

app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/teachers', teacherRoutes);
app.use('/api/books', bookRoutes)
app.use('/api/makeup-classes', makeupClass)
app.use('/api', functionRoutes)


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
