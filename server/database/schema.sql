-- Rich English Teacher Portal Database Schema
-- MySQL Database Setup

CREATE DATABASE IF NOT EXISTS richenglish;
USE richenglish;

-- Teachers table
CREATE TABLE teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('teacher', 'admin') DEFAULT 'teacher',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
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
    teacher_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- Classes table
CREATE TABLE classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    teacher_id INT NOT NULL,
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
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- Attendance table
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT NOT NULL,
    student_id INT NOT NULL,
    teacher_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'makeup', 'substitute') DEFAULT 'present',
    minutes_attended INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- Makeup classes table
CREATE TABLE makeup_classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    teacher_id INT NOT NULL,
    original_class_id INT,
    makeup_date DATE NOT NULL,
    makeup_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    reason VARCHAR(200),
    absent_dates TEXT,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (original_class_id) REFERENCES classes(id) ON DELETE SET NULL
);

-- Substitute classes table
CREATE TABLE substitute_classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    original_teacher_id INT NOT NULL,
    substitute_teacher_id INT NOT NULL,
    class_date DATE NOT NULL,
    class_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    reason VARCHAR(200),
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (original_teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (substitute_teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

CREATE TABLE message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES teachers(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES teachers(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO message (sender_id, receiver_id, message)
VALUES
(1, 2, 'Hello! This is teacher 1 sending a message to teacher 2.'),
(2, 1, 'Hi! This is teacher 2 replying to teacher 1.'),
(1, 2, 'Can we meet tomorrow morning?'),
(2, 1, 'Sure, tomorrow at 9 AM works for me.');


-- Insert sample teacher data
INSERT INTO teachers (name, email, password, role) VALUES 
('Teacher Mitch', 'teacher.mitch@richenglish.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),
('Admin User', 'admin@richenglish.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample students based on CSV data
INSERT INTO students (name, age, nationality, manager_type, email, book, category_level, class_type, platform, platform_link, teacher_id) VALUES 
('Esther (Kyunghee)', 52, 'KOREAN', 'KM', 'lovelykh03@gmailk.com', 'English Verbs 1', 'Adult Novice - Lvl 3', 'Zoom', 'Zoom', '', 1),
('Joey', NULL, 'KOREAN', 'KM', '', '', 'Adult', 'Zoom', 'Zoom', '', 1),
('Kory (Domyung)', 49, 'KOREAN', 'KM', 'km300xl@naver.com', 'Free-talking', 'Adult Novice - Lvl 3', 'Zoom', 'Zoom', '', 1),
('Anna-W2', 45, 'CHINESE', 'CM', '', 'Business English Communication 2', 'Adult Novice - Lvl 3', 'Voov', 'Voov', 'VOOV link', 1),
('Jason', 7, 'KOREAN', 'KM', 'chaeran.seo@gmail.com', 'Let\'s Go 3(5th Ed)', 'Beginner - Lvl 1', 'Zoom', 'Zoom', '', 1),
('Anthony(예성)/Pearl', 16, 'KOREAN', 'KM', 'sjj61169@gmail.com', 'Everyone, Speak! Intermediate 2/English for Everyone', 'Pre-Intermediate - Lvl 3', 'Zoom', 'Zoom', '', 1),
('Ryn (Ryeoeun)', 11, 'KOREAN', 'KM', 'hikk35@nate.com', 'Speech Contest 1', 'Intermediate - Lvl 1', 'Zoom', 'Zoom', '', 1),
('Yujun', 9, 'KOREAN', 'KM', 'eltnldi3@naver.com', 'Oxford Phonics World 3', 'Pre-Beginner - Lvl 2', 'Zoom', 'Zoom', '', 1),
('Gloria', 8, 'KOREAN', 'KM', 'mihani7942@gmail.com', 'EFL Phonics 5 - Double Vowels (3rd Ed)', 'Beginner - Lvl 1', 'Zoom', 'Zoom', '', 1),
('Sua', 11, 'KOREAN', 'KM', 'yaong0304@hanmail.net', 'Everybody Up 5', 'Pre-Intermediate - Lvl 3', 'Zoom', 'Zoom', '', 1),
('Allison', 8, 'KOREAN', 'KM', 'berr1999@gmail.com', 'Reading Sketch 1', 'Pre-Beginner - Lvl 1', 'Zoom', 'Zoom', '', 1),
('Ellen', 8, 'KOREAN', 'KM', '', 'Oxford Phonics World 3', 'Pre-Beginner - Lvl 2', 'Zoom', 'Zoom', '', 1),
('Hakyung', 14, 'KOREAN', 'KM', 'bigjoy9191@gmail.com', 'Easy 2', 'Pre-Intermediate - Lvl 3', 'Zoom', 'Zoom', '', 1),
('Julie (Jiyu)', 10, 'KOREAN', 'KM', 'cecece4567@naver.com', 'Everyone Speak! Beginner 1', 'Beginner - Lvl 2', 'Zoom', 'Zoom', '', 1),
('Elice(SeungAh)', 13, 'KOREAN', 'KM', 'syy0218@naver.com', 'Easy 2', 'Pre-Intermediate - Lvl 2', 'Zoom', 'Zoom', '', 1),
('Kan-W2', 18, 'KOREAN', 'CM', 'yangkang32123@163.com', 'Speak your Mind 2', 'Adult Novice - Lvl 2', 'Voov', 'Voov', '', 1),
('Junny(Gamin)', 13, 'KOREAN', 'KM', 'rabbithyun@nate.com', 'New Children\'s Talk 2', 'Pre-Intermediate - Lvl 2', 'Zoom', 'Zoom', '', 1);
