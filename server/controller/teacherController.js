const pool = require('../database/db');
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require('../errors')

const teacherApplication = async (req, res)=>{
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
}

const getTeachers = async (req, res)=>{
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
}

const createTeacher = async (req, res)=>{
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
}

const updateTeacher = async (req, res)=>{
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
}

const deleteTeacher = async (req, res)=>{
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM teachers WHERE id = ?', [id]);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
    teacherApplication, getTeachers, createTeacher, updateTeacher, deleteTeacher
}