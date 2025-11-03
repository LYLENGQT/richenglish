const mongoose = require("mongoose");
const { Student } = require("./model/");

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

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const result = await Student.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} existing students`);

    const createdStudents = [];

    for (const studentData of studentsData) {
      const student = new Student(studentData);
      await student.save();
      createdStudents.push(student);
    }

    console.log(`✅ Successfully inserted ${createdStudents.length} students`);
    console.log("\n📋 Created Students:");
    createdStudents.forEach((s) =>
      console.log(`  - ${s.name} (ID: ${s.student_identification})`)
    );
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

seedDatabase();
