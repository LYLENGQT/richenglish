require("dotenv").config();
const mongoose = require("mongoose");
const {
  User,
  SuperAdmin,
  Admin,
  Teacher,
  Student,
  Book,
  Class,
  Message,
  Payout,
  Screenshot,
  Recording,
  Notification,
  BookAssign,
  Attendance,
} = require("./model/");
const ScreenShot = require("./model/ScreenShot");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/RichEnglish";

const studentsData = [
  {
    name: "Joey",
    age: null,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "",
    book: "",
    category_level: "Adult",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Kory (Domyung)",
    age: 49,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "km300xl@naver.com",
    book: "Free-talking",
    category_level: "Adult Novice - Lvl 3",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Anna-W2",
    age: 45,
    nationality: "CHINESE",
    manager_type: "CM",
    email: "",
    book: "Business English Communication 2",
    category_level: "Adult Novice - Lvl 3",
    class_type: "Voov",
    platform: "Voov",
    platform_link: "VOOV link",
  },
  {
    name: "Jason",
    age: 7,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "chaeran.seo@gmail.com",
    book: "Let's Go 3(5th Ed)",
    category_level: "Beginner - Lvl 1",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Anthony(예성)/Pearl",
    age: 16,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "sjj61169@gmail.com",
    book: "Everyone, Speak! Intermediate 2/English for Everyone",
    category_level: "Pre-Intermediate - Lvl 3",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Ryn (Ryeoeun)",
    age: 11,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "hikk35@nate.com",
    book: "Speech Contest 1",
    category_level: "Intermediate - Lvl 1",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Yujun",
    age: 9,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "eltnldi3@naver.com",
    book: "Oxford Phonics World 3",
    category_level: "Pre-Beginner - Lvl 2",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Gloria",
    age: 8,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "mihani7942@gmail.com",
    book: "EFL Phonics 5 - Double Vowels (3rd Ed)",
    category_level: "Beginner - Lvl 1",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Sua",
    age: 11,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "yaong0304@hanmail.net",
    book: "Everybody Up 5",
    category_level: "Pre-Intermediate - Lvl 3",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Allison",
    age: 8,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "berr1999@gmail.com",
    book: "Reading Sketch 1",
    category_level: "Pre-Beginner - Lvl 1",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Ellen",
    age: 8,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "",
    book: "Oxford Phonics World 3",
    category_level: "Pre-Beginner - Lvl 2",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Hakyung",
    age: 14,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "bigjoy9191@gmail.com",
    book: "Easy 2",
    category_level: "Pre-Intermediate - Lvl 3",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Julie (Jiyu)",
    age: 10,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "cecece4567@naver.com",
    book: "Everyone Speak! Beginner 1",
    category_level: "Beginner - Lvl 2",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Elice(SeungAh)",
    age: 13,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "syy0218@naver.com",
    book: "Easy 2",
    category_level: "Pre-Intermediate - Lvl 2",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
  {
    name: "Kan-W2",
    age: 18,
    nationality: "CHINESE",
    manager_type: "CM",
    email: "yangkang32123@163.com",
    book: "Speak your Mind 2",
    category_level: "Adult Novice - Lvl 2",
    class_type: "Voov",
    platform: "Voov",
    platform_link: "",
  },
  {
    name: "Junny(Gamin)",
    age: 13,
    nationality: "KOREAN",
    manager_type: "KM",
    email: "rabbithyun@nate.com",
    book: "New Children's Talk 2",
    category_level: "Pre-Intermediate - Lvl 2",
    class_type: "Zoom",
    platform: "Zoom",
    platform_link: "",
  },
];

const classData = [
  {
    teacher_id: "67264a4bf57e8a6c3f2d8a01",
    student_id: "6907c86dc8dc2fdecb6e577a",
    type: "schedule",
    start_date: "2025-11-05T00:00:00.000Z",
    end_date: "2025-11-05T00:00:00.000Z",
    start_time: "10:00",
    end_time: "11:00",
    duration: 60,
    platform_link: "https://zoom.us/j/1234567890",
    book_id: "690b34193f66e20f635bc62a",
  },
  {
    teacher_id: "67264a4bf57e8a6c3f2d8a01",
    student_id: "6907c86dc8dc2fdecb6e577a",
    type: "reoccurring",
    reoccurringDays: ["M", "W", "F"],
    start_time: "14:00",
    end_time: "15:00",
    duration: 60,
    platform_link: "https://zoom.us/j/2345678901",
    book_id: "690b34193f66e20f635bc62a",
  },
  {
    teacher_id: "67264a4bf57e8a6c3f2d8a01",
    student_id: "6907c86dc8dc2fdecb6e577a",
    type: "makeupClass",
    start_date: "2025-11-06T00:00:00.000Z",
    end_date: "2025-11-06T00:00:00.000Z",
    start_time: "16:00",
    end_time: "17:00",
    duration: 60,
    platform_link: "https://zoom.us/j/3456789012",
    reason: "Student was absent on 2025-11-03",
    note: "Make-up for missed grammar lesson",
    original_class_id: "67264a4bf57e8a6c3f2d8a10",
  },
];

const bookData = [
  {
    title: "Business English Communication 2",
    filename: "business_eng2.pdf",
    original_filename: "business_eng2_orig.pdf",
    path: "/uploads/books/business_eng2.pdf",
    uploaded_by: "67264a4bf57e8a6c3f2d8a03",
  },
  {
    title: "Everyone, Speak! Intermediate 2",
    filename: "everyone_speak_int2.pdf",
    original_filename: "everyone_speak_int2_orig.pdf",
    path: "/uploads/books/everyone_speak_int2.pdf",
    uploaded_by: "67264a4bf57e8a6c3f2d8a03",
  },
  {
    title: "Let's Go 3(5th Ed)",
    filename: "letsgo3.pdf",
    original_filename: "letsgo3_original.pdf",
    path: "/uploads/books/letsgo3.pdf",
    uploaded_by: "67264a4bf57e8a6c3f2d8a03",
  },
  {
    title: "Oxford Phonics World 3",
    filename: "oxford_phonics_3.pdf",
    original_filename: "oxford_phonics_3_orig.pdf",
    path: "/uploads/books/oxford_phonics_3.pdf",
    uploaded_by: "67264a4bf57e8a6c3f2d8a03",
  },
  {
    title: "Reading Sketch 1",
    filename: "reading_sketch_1.pdf",
    original_filename: "reading_sketch_1_orig.pdf",
    path: "/uploads/books/reading_sketch_1.pdf",
    uploaded_by: "67264a4bf57e8a6c3f2d8a03",
  },
];

const usersData = [
  {
    _id: "67264a4bf57e8a6c3f2d8a01",
    name: "Teacher Mitch",
    email: "teacher.mitch@richenglish.com",
    password: "$2a$10$wLnW5BeVuMfOU6SNzqBCe.YNe4GSymyeThq.3.zLuFsJXDjx.jhl2",
    role: "teacher",
    country: "PH",
    status: "active",
    timezone: "Asia/Manila",
    firstName: "Mitch",
    lastName: "Santos",
    phone: "09171234567",
    degree: "BA English",
    major: "Linguistics",
    englishLevel: "C1",
    experience: "2 years",
    motivation: "I love teaching English to kids.",
    availability: "Mon–Fri, 8AM–5PM",
    internetSpeed: "100 Mbps",
    computerSpecs: "Intel i5, 16GB RAM",
    hasWebcam: true,
    hasHeadset: true,
    hasBackupInternet: true,
    hasBackupPower: true,
    teachingEnvironment: "Quiet room with proper lighting",
    resume: "https://drive.google.com/file/d/teacher-resume-id/view",
    introVideo: "https://drive.google.com/file/d/teacher-intro-id/view",
    speedTestScreenshot:
      "https://drive.google.com/file/d/teacher-speedtest-id/view",
    zoom_link: "https://zoom.us/j/123456789",
    reset: {
      expiration: "2025-11-02T20:27:55.658Z",
      otp: "346712",
    },
    updatedAt: "2025-11-02T20:23:20.208Z",
    verification: {
      isVerified: false,
    },
    accepted: true,
  },
  {
    _id: "67264a4bf57e8a6c3f2d8a02",
    name: "Admin User",
    email: "admin@richenglish.com",
    password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "admin",
    country: "PH",
    status: "active",
    timezone: "Asia/Manila",
    assignedTeachers: ["67264a4bf57e8a6c3f2d8a01"],
  },
  {
    _id: "67264a4bf57e8a6c3f2d8a03",
    name: "Super Admin",
    email: "richenglish@admin.com",
    password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "super-admin",
    country: "PH",
    status: "active",
    timezone: "Asia/Manila",
  },
];
const attendanceData = [
  {
    _id: "690b44e65a127980ae2dd001",
    teacher_id: "67264a4bf57e8a6c3f2d8a01",
    student_id: "6907c86dc8dc2fdecb6e577a",
    class_id: "690b33af5a127980ae2dcdbc",
    date: new Date("2025-11-05T00:00:00.000Z"),
    duration: 60,
    start_time: "10:00",
    end_time: "11:00",
    minutes_attended: 55,
    notes: "Student joined 5 minutes late but participated actively.",
    screenshots: ["690b45075a127980ae2dd010", "690b451a5a127980ae2dd011"],
    recording: "690b45315a127980ae2dd012",
    createdAt: new Date("2025-11-05T11:05:00.000Z"),
    updatedAt: new Date("2025-11-05T11:10:00.000Z"),
  },
  {
    _id: "690b44e65a127980ae2dd002",
    teacher_id: "67264a4bf57e8a6c3f2d8a01",
    student_id: "6907c86dc8dc2fdecb6e577a",
    class_id: "690b33af5a127980ae2dcdbd",
    date: new Date("2025-11-06T00:00:00.000Z"),
    duration: 60,
    start_time: "14:00",
    end_time: "15:00",
    minutes_attended: 60,
    notes:
      "Perfect attendance. Student performed well in pronunciation drills.",
    screenshots: ["690b45565a127980ae2dd013", "690b456e5a127980ae2dd014"],
    recording: "690b45795a127980ae2dd015",
    createdAt: new Date("2025-11-06T15:10:00.000Z"),
    updatedAt: new Date("2025-11-06T15:12:00.000Z"),
  },
];

const screenshotData = [
  {
    class_id: "690b33af5a127980ae2dcdbc",
    path: "/uploads/screenshots/class1/screenshot1.png",
    filename: "screenshot1.png",
    drive_link: "https://drive.google.com/file/d/1abc123/view",
    uploaded_by: "67264a4bf57e8a6c3f2d8a01", // User _id (Teacher)
    createdAt: "2025-11-05T11:00:00.000Z",
    updatedAt: "2025-11-05T11:00:00.000Z",
  },
  {
    class_id: "690b33af5a127980ae2dcdbc",
    path: "/uploads/screenshots/class1/screenshot2.png",
    filename: "screenshot2.png",
    drive_link: "https://drive.google.com/file/d/1xyz456/view",
    uploaded_by: "6907c86dc8dc2fdecb6e577a", // User _id (Student)
    createdAt: "2025-11-05T11:05:00.000Z",
    updatedAt: "2025-11-05T11:05:00.000Z",
  },
  {
    class_id: "690b33af5a127980ae2dcdbe",
    path: "/uploads/screenshots/class2/screenshot1.png",
    filename: "screenshot1.png",
    drive_link: "https://drive.google.com/file/d/2pqr789/view",
    uploaded_by: "67264a4bf57e8a6c3f2d8a01", // User _id (Teacher)
    createdAt: "2025-11-06T16:00:00.000Z",
    updatedAt: "2025-11-06T16:00:00.000Z",
  },
];

const recordingsData = [
  {
    class_id: "6730f19a3c2f5b45d8a9c101",
    uploaded_by: "67264a4bf57e8a6c3f2d8a01",
    path: "/uploads/recordings/class101_session1.mp4",
    filename: "class101_session1.mp4",
    drive_link: "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I/view",
  },
  {
    class_id: "6730f19a3c2f5b45d8a9c102",
    uploaded_by: "67264a4bf57e8a6c3f2d8a02",
    path: "/uploads/recordings/class102_session2.mp4",
    filename: "class102_session2.mp4",
    drive_link: "https://drive.google.com/file/d/2B3C4D5E6F7G8H9I0J/view",
  },
  {
    class_id: "6730f19a3c2f5b45d8a9c103",
    uploaded_by: "67264a4bf57e8a6c3f2d8a03",
    path: "/uploads/recordings/class103_session3.mp4",
    filename: "class103_session3.mp4",
    drive_link: "https://drive.google.com/file/d/3C4D5E6F7G8H9I0J1K/view",
  },
];

const payoutData = [
  {
    _id: "690b45df2c1f876b42cd9001",
    teacher_id: "67264a4bf57e8a6c3f2d8a01",
    start_date: "2025-11-01T00:00:00.000Z",
    end_date: "2025-11-15T00:00:00.000Z",
    duration: 600,
    total_class: 10,
    incentives: 0,
    status: "pending",
  },
  {
    _id: "690b45df2c1f876b42cd9002",
    teacher_id: "67264a4bf57e8a6c3f2d8a01",
    start_date: "2025-10-15T00:00:00.000Z",
    end_date: "2025-10-31T00:00:00.000Z",
    duration: 540,
    total_class: 9,
    incentives: 0,
    status: "completed",
  },
  {
    _id: "690b45df2c1f876b42cd9003",
    teacher_id: "67264a4bf57e8a6c3f2d8a01",
    start_date: "2025-11-16T00:00:00.000Z",
    end_date: "2025-11-30T00:00:00.000Z",
    duration: 480,
    total_class: 8,
    incentives: 0,
    status: "processing",
  },
];

const notificationsData = [
  {
    user_id: "672871d3f4a19b2a8b21c1e4", // ObjectId of the teacher
    type: "offline_alert",
    message: "You have an offline student who missed today’s class.",
    is_read: false,
    created_at: new Date("2025-11-03T09:00:00Z"),
  },
  {
    user_id: "672871d3f4a19b2a8b21c1e4",
    type: "schedule_update",
    message: "Your class schedule for Friday has been updated.",
    is_read: true,
    created_at: new Date("2025-11-02T15:00:00Z"),
  },
  {
    user_id: "672871d3f4a19b2a8b21c1e4",
    type: "payout_notice",
    message: "Your payout for October has been processed successfully.",
    is_read: false,
    created_at: new Date("2025-11-01T10:30:00Z"),
  },
  {
    user_id: "672871d3f4a19b2a8b21c1e4",
    type: "offline_alert",
    message: "Student Alice Kim has not logged in for the past 3 days.",
    is_read: false,
    created_at: new Date("2025-11-04T06:45:00Z"),
  },
  {
    user_id: "672871d3f4a19b2a8b21c1e4",
    type: "payout_notice",
    message: "You earned an additional ₱500 incentive for perfect attendance.",
    is_read: true,
    created_at: new Date("2025-11-03T14:20:00Z"),
  },
];

const bookAssignmentData = [
  {
    student_id: "67286fd7c4a19b2a8b21a9d3",
    teacher_id: "672871d3f4a19b2a8b21c1e4",
    book_id: "672874a8e4f89c2b8b21e5f1",
    assigned_by: "67264a4bf57e8a6c3f2d8a03", // Admin
  },
  {
    student_id: "67286fe8c4a19b2a8b21a9d8",
    teacher_id: "672871d3f4a19b2a8b21c1e4",
    book_id: "672874b0e4f89c2b8b21e5f5",
    assigned_by: "67264a4bf57e8a6c3f2d8a03", // Super Admin
  },
  {
    student_id: "67287012c4a19b2a8b21aa10",
    teacher_id: "67287212f4a19b2a8b21c2f8",
    book_id: "672874c2e4f89c2b8b21e601",
    assigned_by: "67264a4bf57e8a6c3f2d8a02", // Admin
  },
  {
    student_id: "67287033c4a19b2a8b21aa22",
    teacher_id: "67287212f4a19b2a8b21c2f8",
    book_id: "672874d4e4f89c2b8b21e60a",
    assigned_by: "67264a4bf57e8a6c3f2d8a03", // Super Admin
  },
  {
    student_id: "67287055c4a19b2a8b21aa36",
    teacher_id: "67287301f4a19b2a8b21c410",
    book_id: "672874e9e4f89c2b8b21e615",
    assigned_by: "67264a4bf57e8a6c3f2d8a02", // Admin
  },
];

async function seedDatabase(model, data) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    const modelName = model.modelName || "UnknownModel";
    console.log(`✅ Using model: ${modelName}`);

    const result = await model.deleteMany({});
    console.log(
      `🗑️ Deleted ${result.deletedCount} existing ${modelName} records`
    );

    const created = await model.insertMany(data);
    console.log(
      `✅ Successfully inserted ${created.length} ${modelName} records`
    );

    created.forEach((doc, i) => {
      const display = doc.name || doc.title || doc._id || `Item ${i + 1}`;
      console.log(`  - ${display}`);
    });
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("🔌 Database connection closed");
    }
  }
}

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await seedDatabase(User, usersData);
    await seedDatabase(Student, studentsData);
    await seedDatabase(Class, classData);
    await seedDatabase(Book, bookData);
    await seedDatabase(Attendance, attendanceData);
    await seedDatabase(Notification, notificationsData);
    await seedDatabase(Screenshot, screenshotData);
    await seedDatabase(Recording, recordingsData);
    await seedDatabase(Payout, payoutData);
    await seedDatabase(BookAssign, bookAssignmentData);

    console.log("🎉 All seeding completed successfully!");
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
})();
