const pool = require('../database/db');

const teacherApplication = async (req,res)=>{
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

const dashboardStats = async (req,res)=>{
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
}

module.exports = {teacherApplication, dashboardStats}