const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
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

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'richenglish',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Role guard
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

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

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [rows] = await pool.execute(
      'SELECT * FROM teachers WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const teacher = rows[0];
    const isValidPassword = await bcrypt.compare(password, teacher.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: teacher.id, email: teacher.email, role: teacher.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Students routes
app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT s.*, t.name as teacher_name 
      FROM students s 
      LEFT JOIN teachers t ON s.teacher_id = t.id 
      ORDER BY s.name
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/students', authenticateToken, async (req, res) => {
  try {
    const {
      name, age, nationality, manager_type, email, book,
      category_level, class_type, platform, platform_link, teacher_id
    } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO students (name, age, nationality, manager_type, email, book, 
                           category_level, class_type, platform, platform_link, teacher_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, age, nationality, manager_type, email, book, 
        category_level, class_type, platform, platform_link, teacher_id]);

    res.json({ id: result.insertId, message: 'Student created successfully' });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, age, nationality, manager_type, email, book,
      category_level, class_type, platform, platform_link, teacher_id
    } = req.body;

    await pool.execute(`
      UPDATE students 
      SET name=?, age=?, nationality=?, manager_type=?, email=?, book=?,
          category_level=?, class_type=?, platform=?, platform_link=?, teacher_id=?
      WHERE id=?
    `, [name, age, nationality, manager_type, email, book,
        category_level, class_type, platform, platform_link, teacher_id, id]);

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM students WHERE id = ?', [id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Classes routes
app.get('/api/classes', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.*, s.name as student_name, s.nationality, s.manager_type,
             t.name as teacher_name
      FROM classes c
      JOIN students s ON c.student_id = s.id
      JOIN teachers t ON c.teacher_id = t.id
      ORDER BY c.start_time
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/classes', authenticateToken, async (req, res) => {
  try {
    const {
      student_id, teacher_id, start_time, end_time, duration_minutes,
      days_of_week, start_date, end_date, status
    } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO classes (student_id, teacher_id, start_time, end_time, 
                          duration_minutes, days_of_week, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [student_id, teacher_id, start_time, end_time, duration_minutes,
        days_of_week, start_date, end_date, status || 'active']);

    res.json({ id: result.insertId, message: 'Class created successfully' });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Attendance routes
app.get('/api/attendance', authenticateToken, async (req, res) => {
  try {
    const { date, student_id } = req.query;
    let query = `
      SELECT a.*, s.name as student_name, c.start_time, c.end_time
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN classes c ON a.class_id = c.id
    `;
    const params = [];

    if (date) {
      query += ' WHERE DATE(a.date) = ?';
      params.push(date);
    }
    if (student_id) {
      query += date ? ' AND a.student_id = ?' : ' WHERE a.student_id = ?';
      params.push(student_id);
    }

    query += ' ORDER BY a.date DESC, c.start_time';

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/attendance', authenticateToken, async (req, res) => {
  try {
    const { class_id, student_id, teacher_id, date, status, minutes_attended, notes } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO attendance (class_id, student_id, teacher_id, date, status, minutes_attended, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [class_id, student_id, teacher_id, date, status, minutes_attended, notes]);

    res.json({ id: result.insertId, message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

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
