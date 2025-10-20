-- Rich English Teacher Portal Database Schema
-- MySQL Database Setup

CREATE DATABASE IF NOT EXISTS richenglish;
USE richenglish;

-- Use 10-char UUID-like IDs: LEFT(REPLACE(UUID(),'-',''),10)

DELIMITER $$

-- utility function to generate 10-char id
DROP FUNCTION IF EXISTS gen_short_uuid$$
CREATE FUNCTION gen_short_uuid()
RETURNS CHAR(10) DETERMINISTIC
RETURN LEFT(REPLACE(UUID(),'-',''),10)$$

-- user
DROP TRIGGER IF EXISTS before_user_insert$$
CREATE TRIGGER before_user_insert
BEFORE INSERT ON `user`
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- students
DROP TRIGGER IF EXISTS before_students_insert$$
CREATE TRIGGER before_students_insert
BEFORE INSERT ON students
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
  IF NEW.student_identification IS NULL OR NEW.student_identification = '' THEN
    SET NEW.student_identification = CONCAT('STD', SUBSTRING(gen_short_uuid(),1,7));
  END IF;
END$$

-- schedules
DROP TRIGGER IF EXISTS before_schedules_insert$$
CREATE TRIGGER before_schedules_insert
BEFORE INSERT ON schedules
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- tokens
DROP TRIGGER IF EXISTS before_tokens_insert$$
CREATE TRIGGER before_tokens_insert
BEFORE INSERT ON tokens
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- classes
DROP TRIGGER IF EXISTS before_classes_insert$$
CREATE TRIGGER before_classes_insert
BEFORE INSERT ON classes
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- attendance
DROP TRIGGER IF EXISTS before_attendance_insert$$
CREATE TRIGGER before_attendance_insert
BEFORE INSERT ON attendance
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- makeup_classes
DROP TRIGGER IF EXISTS before_makeup_classes_insert$$
CREATE TRIGGER before_makeup_classes_insert
BEFORE INSERT ON makeup_classes
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- substitute_classes
DROP TRIGGER IF EXISTS before_substitute_classes_insert$$
CREATE TRIGGER before_substitute_classes_insert
BEFORE INSERT ON substitute_classes
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- message
DROP TRIGGER IF EXISTS before_message_insert$$
CREATE TRIGGER before_message_insert
BEFORE INSERT ON message
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- books
DROP TRIGGER IF EXISTS before_books_insert$$
CREATE TRIGGER before_books_insert
BEFORE INSERT ON books
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- book_assignments
DROP TRIGGER IF EXISTS before_book_assignments_insert$$
CREATE TRIGGER before_book_assignments_insert
BEFORE INSERT ON book_assignments
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- payouts
DROP TRIGGER IF EXISTS before_payouts_insert$$
CREATE TRIGGER before_payouts_insert
BEFORE INSERT ON payouts
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- notifications
DROP TRIGGER IF EXISTS before_notifications_insert$$
CREATE TRIGGER before_notifications_insert
BEFORE INSERT ON notifications
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- screenshots
DROP TRIGGER IF EXISTS before_screenshots_insert$$
CREATE TRIGGER before_screenshots_insert
BEFORE INSERT ON screenshots
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- recordings
DROP TRIGGER IF EXISTS before_recordings_insert$$
CREATE TRIGGER before_recordings_insert
BEFORE INSERT ON recordings
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

-- settings
DROP TRIGGER IF EXISTS before_settings_insert$$
CREATE TRIGGER before_settings_insert
BEFORE INSERT ON settings
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = gen_short_uuid();
  END IF;
END$$

DELIMITER ;

CREATE TABLE `user` (
    id CHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    zoom_link VARCHAR(255),
    country VARCHAR(50) NOT NULL,
    role ENUM('teacher', 'admin', 'super-admin') DEFAULT 'teacher',
    status ENUM('active', 'inactive') DEFAULT 'active',
    timezone VARCHAR(50) DEFAULT 'Asia/Manila' AFTER role;
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id CHAR(10) PRIMARY KEY,
    student_identification VARCHAR(20) UNIQUE,
    name VARCHAR(100) NOT NULL,
    age INT,
    nationality ENUM('KOREAN', 'CHINESE') NOT NULL,
    manager_type ENUM('KM', 'CM') NOT NULL,
    email VARCHAR(100),
    book VARCHAR(200),
    category_level VARCHAR(100),
    class_type VARCHAR(50),
    platform ENUM('Zoom', 'Voov') DEFAULT 'Zoom',
    platform_link VARCHAR(500),
    teacher_id CHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES `user`(id) ON DELETE SET NULL
);

CREATE TABLE schedules (
    id CHAR(10) PRIMARY KEY,
    teacher_id CHAR(10),
    student_id CHAR(10),
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    zoom_link VARCHAR(255),
    status ENUM('scheduled','completed','missed','cancelled') DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES `user`(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE tokens (
    id CHAR(10) PRIMARY KEY,
    user_id CHAR(10) NOT NULL,
    token_type ENUM('access', 'refresh') DEFAULT 'access',
    token VARCHAR(512) NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(id)
);

CREATE TABLE classes (
    id CHAR(10) PRIMARY KEY,
    student_id CHAR(10) NOT NULL,
    teacher_id CHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    days_of_week VARCHAR(20) NOT NULL, -- e.g., "M-F", "W & F"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES `user`(id) ON DELETE CASCADE
);

CREATE TABLE attendance (
    id CHAR(10) PRIMARY KEY,
    class_id CHAR(10) NOT NULL,
    student_id CHAR(10) NOT NULL,
    teacher_id CHAR(10) NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'makeup', 'substitute') DEFAULT 'present',
    minutes_attended INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES `user`(id) ON DELETE CASCADE
);

CREATE TABLE makeup_classes (
    id CHAR(10) PRIMARY KEY,
    student_id CHAR(10) NOT NULL,
    teacher_id CHAR(10) NOT NULL,
    original_class_id CHAR(10),
    makeup_date DATE NOT NULL,
    makeup_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    reason VARCHAR(200),
    absent_dates TEXT,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (original_class_id) REFERENCES classes(id) ON DELETE SET NULL
);

CREATE TABLE substitute_classes (
    id CHAR(10) PRIMARY KEY,
    student_id CHAR(10) NOT NULL,
    original_teacher_id CHAR(10) NOT NULL,
    substitute_teacher_id CHAR(10) NOT NULL,
    class_date DATE NOT NULL,
    class_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    reason VARCHAR(200),
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (original_teacher_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (substitute_teacher_id) REFERENCES `user`(id) ON DELETE CASCADE
);

CREATE TABLE message (
    id CHAR(10) PRIMARY KEY,
    sender_id CHAR(10) NOT NULL,
    receiver_id CHAR(10) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES `user`(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES `user`(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE books (
        id CHAR(10) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        original_filename VARCHAR(255),
        path VARCHAR(512) NOT NULL,
        uploaded_by CHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploaded_by) REFERENCES user(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE book_assignments (
    id CHAR(10) PRIMARY KEY,
    book_id CHAR(10) NOT NULL,
    student_id CHAR(10) NOT NULL,
    teacher_id CHAR(10),
    assigned_by CHAR(10),
    date_assigned DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active','completed') DEFAULT 'active',
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES `user`(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_by) REFERENCES `user`(id) ON DELETE SET NULL
);

CREATE TABLE payouts (
    id CHAR(10) PRIMARY KEY,
    teacher_id CHAR(10),
    admin_id CHAR(10),
    month VARCHAR(20),
    total_classes INT DEFAULT 0,
    rate_per_class DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('pending','paid','verified') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES `user`(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES `user`(id) ON DELETE SET NULL
);

CREATE TABLE notifications (
    id CHAR(10) PRIMARY KEY,
    user_id CHAR(10) NOT NULL,
    type ENUM('offline_alert','schedule_update','payout_notice'),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
);

CREATE TABLE screenshots (
    id CHAR(10) PRIMARY KEY,
    teacher_id CHAR(10) NOT NULL,
    student_id CHAR(10),
    schedule_id CHAR(10),
    screenshot_url VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE SET NULL
);

CREATE TABLE recordings (
    id CHAR(10) PRIMARY KEY,
    teacher_id CHAR(10) NOT NULL,
    student_id CHAR(10),
    schedule_id CHAR(10),
    drive_link VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE SET NULL
);

-- 11. settings
CREATE TABLE settings (
    id CHAR(10) PRIMARY KEY,
    `key` VARCHAR(100) NOT NULL,
    `value` VARCHAR(255),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO `user` (id, name, email, password, role, country) VALUES
(LEFT(REPLACE(UUID(),'-',''),10), 'Teacher Mitch', 'teacher.mitch@richenglish.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'PH'),
(LEFT(REPLACE(UUID(),'-',''),10), 'Admin User', 'admin@richenglish.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'PH'),
(LEFT(REPLACE(UUID(),'-',''),10), 'Super Admin', 'richenglish@admin.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super-admin', 'PH');

INSERT INTO students (name, age, nationality, manager_type, email, book, category_level, class_type, platform, platform_link, teacher_id) VALUES 
('Esther (Kyunghee)', 52, 'KOREAN', 'KM', 'lovelykh03@gmailk.com', 'English Verbs 1', 'Adult Novice - Lvl 3', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Joey', NULL, 'KOREAN', 'KM', '', '', 'Adult', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Kory (Domyung)', 49, 'KOREAN', 'KM', 'km300xl@naver.com', 'Free-talking', 'Adult Novice - Lvl 3', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Anna-W2', 45, 'CHINESE', 'CM', '', 'Business English Communication 2', 'Adult Novice - Lvl 3', 'Voov', 'Voov', 'VOOV link', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Jason', 7, 'KOREAN', 'KM', 'chaeran.seo@gmail.com', 'Let''s Go 3(5th Ed)', 'Beginner - Lvl 1', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Anthony(예성)/Pearl', 16, 'KOREAN', 'KM', 'sjj61169@gmail.com', 'Everyone, Speak! Intermediate 2/English for Everyone', 'Pre-Intermediate - Lvl 3', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Ryn (Ryeoeun)', 11, 'KOREAN', 'KM', 'hikk35@nate.com', 'Speech Contest 1', 'Intermediate - Lvl 1', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Yujun', 9, 'KOREAN', 'KM', 'eltnldi3@naver.com', 'Oxford Phonics World 3', 'Pre-Beginner - Lvl 2', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Gloria', 8, 'KOREAN', 'KM', 'mihani7942@gmail.com', 'EFL Phonics 5 - Double Vowels (3rd Ed)', 'Beginner - Lvl 1', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Sua', 11, 'KOREAN', 'KM', 'yaong0304@hanmail.net', 'Everybody Up 5', 'Pre-Intermediate - Lvl 3', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Allison', 8, 'KOREAN', 'KM', 'berr1999@gmail.com', 'Reading Sketch 1', 'Pre-Beginner - Lvl 1', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Ellen', 8, 'KOREAN', 'KM', '', 'Oxford Phonics World 3', 'Pre-Beginner - Lvl 2', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Hakyung', 14, 'KOREAN', 'KM', 'bigjoy9191@gmail.com', 'Easy 2', 'Pre-Intermediate - Lvl 3', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Julie (Jiyu)', 10, 'KOREAN', 'KM', 'cecece4567@naver.com', 'Everyone Speak! Beginner 1', 'Beginner - Lvl 2', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Elice(SeungAh)', 13, 'KOREAN', 'KM', 'syy0218@naver.com', 'Easy 2', 'Pre-Intermediate - Lvl 2', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Kan-W2', 18, 'KOREAN', 'CM', 'yangkang32123@163.com', 'Speak your Mind 2', 'Adult Novice - Lvl 2', 'Voov', 'Voov', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
('Junny(Gamin)', 13, 'KOREAN', 'KM', 'rabbithyun@nate.com', 'New Children''s Talk 2', 'Pre-Intermediate - Lvl 2', 'Zoom', 'Zoom', '', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'));

INSERT INTO message (sender_id, receiver_id, message)
VALUES
((SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), (SELECT id FROM `user` WHERE email = 'admin@richenglish.com'), 'Hello! This is teacher 1 sending a message to teacher 2.'),
((SELECT id FROM `user` WHERE email = 'admin@richenglish.com'), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), 'Hi! This is teacher 2 replying to teacher 1.'),
((SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), (SELECT id FROM `user` WHERE email = 'admin@richenglish.com'), 'Can we meet tomorrow morning?'),
((SELECT id FROM `user` WHERE email = 'admin@richenglish.com'), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), 'Sure, tomorrow at 9 AM works for me.');



INSERT INTO books (id, title, filename, original_filename, path, uploaded_by) VALUES
(LEFT(REPLACE(UUID(),'-',''),10), 'Let''s Go 3(5th Ed)', 'letsgo3.pdf', 'letsgo3_original.pdf', '/uploads/books/letsgo3.pdf', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
(LEFT(REPLACE(UUID(),'-',''),10), 'Everyone, Speak! Intermediate 2', 'everyone_speak_int2.pdf', 'everyone_speak_int2_orig.pdf', '/uploads/books/everyone_speak_int2.pdf', (SELECT id FROM `user` WHERE email = 'admin@richenglish.com')),
(LEFT(REPLACE(UUID(),'-',''),10), 'Oxford Phonics World 3', 'oxford_phonics_3.pdf', 'oxford_phonics_3_orig.pdf', '/uploads/books/oxford_phonics_3.pdf', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
(LEFT(REPLACE(UUID(),'-',''),10), 'Business English Communication 2', 'business_eng2.pdf', 'business_eng2_orig.pdf', '/uploads/books/business_eng2.pdf', (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com')),
(LEFT(REPLACE(UUID(),'-',''),10), 'Reading Sketch 1', 'reading_sketch_1.pdf', 'reading_sketch_1_orig.pdf', '/uploads/books/reading_sketch_1.pdf', (SELECT id FROM `user` WHERE email = 'admin@richenglish.com'));

INSERT INTO book_assignments (book_id, student_id, teacher_id, assigned_by, status)
VALUES
((SELECT id FROM books WHERE title = 'Let''s Go 3(5th Ed)' LIMIT 1), (SELECT id FROM students WHERE name LIKE 'Jason%' LIMIT 1), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), (SELECT id FROM `user` WHERE email = 'admin@richenglish.com'), 'active'),
((SELECT id FROM books WHERE title = 'Everyone, Speak! Intermediate 2' LIMIT 1), (SELECT id FROM students WHERE name LIKE 'Anthony%' LIMIT 1), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), 'active'),
((SELECT id FROM books WHERE title = 'Oxford Phonics World 3' LIMIT 1), (SELECT id FROM students WHERE name LIKE 'Yujun%' LIMIT 1), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), (SELECT id FROM `user` WHERE email = 'admin@richenglish.com'), 'active'),
((SELECT id FROM books WHERE title = 'Reading Sketch 1' LIMIT 1), (SELECT id FROM students WHERE name LIKE 'Allison%' LIMIT 1), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), 'active');

INSERT INTO schedules (teacher_id, student_id, date, start_time, end_time, zoom_link, status)
VALUES
((SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), (SELECT id FROM students WHERE name LIKE 'Esther%' LIMIT 1), DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00', '09:30:00', 'https://zoom.us/j/123456789', 'scheduled'),
((SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), (SELECT id FROM students WHERE name LIKE 'Jason%' LIMIT 1), DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', '10:30:00', 'https://zoom.us/j/987654321', 'scheduled'),
((SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), (SELECT id FROM students WHERE name LIKE 'Yujun%' LIMIT 1), DATE_ADD(CURDATE(), INTERVAL 3 DAY), '11:00:00', '11:30:00', 'https://zoom.us/j/555666777', 'scheduled');

/* Classes */
INSERT INTO classes (student_id, teacher_id, start_time, end_time, duration_minutes, days_of_week, start_date, end_date, status)
VALUES
((SELECT id FROM students WHERE name LIKE 'Esther%' LIMIT 1), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), '09:00:00', '09:30:00', 30, 'M,W,F', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 'active'),
((SELECT id FROM students WHERE name LIKE 'Jason%' LIMIT 1), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), '10:00:00', '10:30:00', 30, 'T,Th', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 'active');

/* Attendance (use class inserted above) */
INSERT INTO attendance (class_id, student_id, teacher_id, date, status, minutes_attended, notes)
VALUES
((SELECT id FROM classes WHERE student_id = (SELECT id FROM students WHERE name LIKE 'Esther%' LIMIT 1) LIMIT 1), (SELECT id FROM students WHERE name LIKE 'Esther%' LIMIT 1), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), CURDATE(), 'present', 30, 'On time'),
((SELECT id FROM classes WHERE student_id = (SELECT id FROM students WHERE name LIKE 'Jason%' LIMIT 1) LIMIT 1), (SELECT id FROM students WHERE name LIKE 'Jason%' LIMIT 1), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), CURDATE(), 'absent', 0, 'No show');

/* Makeup classes */
INSERT INTO makeup_classes (student_id, teacher_id, original_class_id, makeup_date, makeup_time, duration_minutes, reason, absent_dates, status, notes)
VALUES
((SELECT id FROM students WHERE name LIKE 'Jason%' LIMIT 1), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), (SELECT id FROM classes WHERE student_id = (SELECT id FROM students WHERE name LIKE 'Jason%' LIMIT 1) LIMIT 1), DATE_ADD(CURDATE(), INTERVAL 5 DAY), '10:00:00', 30, 'Missed previous class', '2025-10-01', 'scheduled', 'Teacher to confirm');

/* Substitute classes */
INSERT INTO substitute_classes (student_id, original_teacher_id, substitute_teacher_id, class_date, class_time, duration_minutes, reason, status, notes)
VALUES
((SELECT id FROM students WHERE name LIKE 'Esther%' LIMIT 1), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), (SELECT id FROM `user` WHERE email = 'admin@richenglish.com'), DATE_ADD(CURDATE(), INTERVAL 7 DAY), '09:00:00', 30, 'Original teacher absent', 'scheduled', 'Admin covering');

/* Tokens */
INSERT INTO tokens (id, user_id, token_type, token, is_valid, expires_at)
VALUES
(LEFT(REPLACE(UUID(),'-',''),10), (SELECT id FROM `user` WHERE email = 'teacher.mitch@richenglish.com'), 'access', 'test_access_token_1', TRUE, DATE_ADD(NOW(), INTERVAL 1 HOUR)),
(LEFT(REPLACE(UUID(),'-',''),10), (SELECT id FROM `user` WHERE email = 'admin@richenglish.com'), 'refresh', 'test_refresh_token_1', TRUE, DATE_ADD(NOW(), INTERVAL 30 DAY));
