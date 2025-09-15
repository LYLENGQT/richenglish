const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {
  authenticateToken,
  requireAdmin
} = require('./middleware/authMiddleware');
const pool = require('./database/db')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads/books', express.static(path.join(__dirname, 'uploads', 'books'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
  }
}));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'books');
fs.mkdirSync(uploadsDir, { recursive: true });

// Multer storage for PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, unique + ext);
  }
});

const pdfOnly = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter: pdfOnly, limits: { fileSize: 50 * 1024 * 1024 } });

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
// const makeupClass = require('./routes/makeUpClassRoutes')

app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/attendance', attendanceRoutes)
// app.use('/api/makeup-classes', makeupClass)


// Makeup classes routes
app.get('/api/makeup-classes', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT mc.*, s.name as student_name, t.name as teacher_name
      FROM makeup_classes mc
      JOIN students s ON mc.student_id = s.id
      JOIN teachers t ON mc.teacher_id = t.id
      ORDER BY mc.makeup_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching makeup classes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/makeup-classes', authenticateToken, async (req, res) => {
  try {
    const {
      student_id, teacher_id, original_class_id, makeup_date, makeup_time,
      duration_minutes, reason, absent_dates, status, notes
    } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO makeup_classes (student_id, teacher_id, original_class_id, makeup_date, 
                                 makeup_time, duration_minutes, reason, absent_dates, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [student_id, teacher_id, original_class_id, makeup_date, makeup_time,
        duration_minutes, reason, absent_dates, status || 'scheduled', notes]);

    res.json({ id: result.insertId, message: 'Makeup class scheduled successfully' });
  } catch (error) {
    console.error('Error scheduling makeup class:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/makeup-classes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      student_id, teacher_id, original_class_id, makeup_date, makeup_time,
      duration_minutes, reason, absent_dates, status, notes
    } = req.body;

    await pool.execute(`
      UPDATE makeup_classes 
      SET student_id=?, teacher_id=?, original_class_id=?, makeup_date=?, 
          makeup_time=?, duration_minutes=?, reason=?, absent_dates=?, status=?, notes=?
      WHERE id=?
    `, [student_id, teacher_id, original_class_id, makeup_date, makeup_time,
        duration_minutes, reason, absent_dates, status, notes, id]);

    res.json({ message: 'Makeup class updated successfully' });
  } catch (error) {
    console.error('Error updating makeup class:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/makeup-classes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM makeup_classes WHERE id = ?', [id]);
    res.json({ message: 'Makeup class deleted successfully' });
  } catch (error) {
    console.error('Error deleting makeup class:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Teacher Applications routes
app.post('/api/teacher-applications', async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, degree, major, englishLevel,
      experience, motivation, availability, internetSpeed, computerSpecs,
      hasWebcam, hasHeadset, hasBackupInternet, hasBackupPower,
      teachingEnvironment, resume, introVideo, speedTestScreenshot
    } = req.body;

    // In a real application, you would save files to storage and store file paths
    // For now, we'll just store the application data
    const [result] = await pool.execute(`
      INSERT INTO teacher_applications (
        first_name, last_name, email, phone, degree, major, english_level,
        experience, motivation, availability, internet_speed, computer_specs,
        has_webcam, has_headset, has_backup_internet, has_backup_power,
        teaching_environment, resume_path, intro_video_path, speed_test_screenshot_path,
        status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `, [
      firstName, lastName, email, phone, degree, major, englishLevel,
      experience, motivation, availability, internetSpeed, computerSpecs,
      hasWebcam, hasHeadset, hasBackupInternet, hasBackupPower,
      teachingEnvironment, resume, introVideo, speedTestScreenshot
    ]);

    res.json({ 
      id: result.insertId, 
      message: 'Application submitted successfully! You will receive an email within 1-3 days regarding the next step.' 
    });
  } catch (error) {
    console.error('Error submitting teacher application:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Teachers routes
app.get('/api/teachers', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, name, email, role, created_at, updated_at 
      FROM teachers 
      ORDER BY name
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/teachers', authenticateToken, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(`
      INSERT INTO teachers (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `, [name, email, hashedPassword, role]);

    res.json({ id: result.insertId, message: 'Teacher created successfully' });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/teachers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    
    let query = 'UPDATE teachers SET name=?, email=?, role=?';
    let params = [name, email, role];
    
    // Only update password if provided
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password=?';
      params.push(hashedPassword);
    }
    
    query += ' WHERE id=?';
    params.push(id);
    
    await pool.execute(query, params);
    res.json({ message: 'Teacher updated successfully' });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/teachers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM teachers WHERE id = ?', [id]);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const [studentCount] = await pool.execute('SELECT COUNT(*) as count FROM students');
    const [classCount] = await pool.execute('SELECT COUNT(*) as count FROM classes WHERE status = "active"');
    const [attendanceCount] = await pool.execute('SELECT COUNT(*) as count FROM attendance WHERE DATE(date) = CURDATE()');
    const [makeupCount] = await pool.execute('SELECT COUNT(*) as count FROM makeup_classes WHERE status = "scheduled"');

    res.json({
      totalStudents: studentCount[0].count,
      activeClasses: classCount[0].count,
      todayAttendance: attendanceCount[0].count,
      pendingMakeups: makeupCount[0].count
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Books: upload (admin), list (auth), stream (auth)
app.post('/api/books', authenticateToken, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const title = req.body.title || req.file.originalname.replace(/\.pdf$/i, '');
    const storedPath = path.relative(__dirname, req.file.path).replace(/\\/g, '/');
    const [result] = await pool.execute(
      'INSERT INTO books (title, filename, original_filename, path, uploaded_by) VALUES (?, ?, ?, ?, ?)',
      [title, req.file.filename, req.file.originalname, storedPath, req.user.id || null]
    );
    res.json({ id: result.insertId, title });
  } catch (error) {
    console.error('Book upload error:', error);
    res.status(500).json({ error: 'Failed to upload book' });
  }
});

app.get('/api/books', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, title, created_at FROM books ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Books list error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Admin: reindex any files on disk that are not in DB
app.post('/api/books/reindex', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const filesOnDisk = fs.readdirSync(uploadsDir).filter((f) => f.toLowerCase().endsWith('.pdf'));
    const [rows] = await pool.execute('SELECT filename FROM books');
    const existing = new Set(rows.map((r) => r.filename));
    let created = 0;
    for (const fname of filesOnDisk) {
      if (!existing.has(fname)) {
        const title = fname.replace(/\.pdf$/i, '');
        const relPath = path.relative(__dirname, path.join(uploadsDir, fname)).replace(/\\/g, '/');
        await pool.execute(
          'INSERT INTO books (title, filename, original_filename, path, uploaded_by) VALUES (?, ?, ?, ?, ?)',
          [title, fname, fname, relPath, req.user.id || null]
        );
        created++;
      }
    }
    res.json({ created });
  } catch (error) {
    console.error('Books reindex error:', error);
    res.status(500).json({ error: 'Failed to reindex books' });
  }
});

app.get('/api/books/:id/stream', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM books WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const book = rows[0];
    const filePath = path.join(__dirname, book.path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${book.filename}"`);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    console.error('Book stream error:', error);
    res.status(500).json({ error: 'Failed to stream book' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
