const pool = require("../database/db");

const TeacherApplication = {
  async create(application) {
    const {
      firstName,
      lastName,
      email,
      phone,
      degree,
      major,
      englishLevel,
      experience,
      motivation,
      availability,
      internetSpeed,
      computerSpecs,
      hasWebcam,
      hasHeadset,
      hasBackupInternet,
      hasBackupPower,
      teachingEnvironment,
      resumeFile,
      introVideoFile,
      speedTestFile,
    } = application;

    const [result] = await pool.query(
      `INSERT INTO teacher_applications (
        first_name,
        last_name,
        email,
        phone,
        degree,
        major,
        english_level,
        experience,
        motivation,
        availability,
        internet_speed,
        computer_specs,
        has_webcam,
        has_headset,
        has_backup_internet,
        has_backup_power,
        teaching_environment,
        resume_file,
        intro_video_file,
        speed_test_file
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      [
        firstName,
        lastName,
        email,
        phone,
        degree,
        major,
        englishLevel,
        experience,
        motivation,
        availability,
        internetSpeed,
        computerSpecs,
        hasWebcam ? 1 : 0,
        hasHeadset ? 1 : 0,
        hasBackupInternet ? 1 : 0,
        hasBackupPower ? 1 : 0,
        teachingEnvironment,
        resumeFile,
        introVideoFile,
        speedTestFile,
      ]
    );

    if (result.insertId) {
      return TeacherApplication.findById(result.insertId);
    }

    return TeacherApplication.findByEmail(email);
  },

  async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT * FROM teacher_applications WHERE email = ? ORDER BY created_at DESC LIMIT 1`,
      [email]
    );
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM teacher_applications WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async findAll(options = {}) {
    const { status } = options;
    let sql = `SELECT * FROM teacher_applications`;
    const params = [];

    if (status) {
      sql += ` WHERE status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY created_at DESC`;

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async updateStatus(id, status) {
    await pool.query(
      `UPDATE teacher_applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );
    return TeacherApplication.findById(id);
  },
};

module.exports = TeacherApplication;

