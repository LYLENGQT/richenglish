const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const { Schema, model, models } = mongoose;

const genStudentIdentification = () =>
  `STD${uuidv4().replace(/-/g, "").substring(0, 7).toUpperCase()}`;

const studentSchema = new Schema(
  {
    student_identification: {
      type: String,
      unique: true,
      index: true, // Ensure index for performance
    },
    name: { type: String, required: true },
    age: { type: Number },
    nationality: {
      type: String,
      enum: ["KOREAN", "CHINESE"],
      required: true,
    },

    email: { type: String },
    category_level: { type: String },
    class_type: { type: String },
    platform: {
      type: String,
      enum: ["Zoom", "Voov"],
      default: "Zoom",
    },
    platform_link: { type: String },
  },
  { timestamps: true }
);

// Improved pre-save hook with retry logic for duplicates
studentSchema.pre("save", async function (next) {
  if (!this.student_identification) {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        this.student_identification = genStudentIdentification();

        // Check if this ID already exists
        const existing = await mongoose.model("Student").findOne({
          student_identification: this.student_identification,
        });

        if (!existing) {
          break; // ID is unique, proceed
        }

        attempts++;
      } catch (error) {
        return next(error);
      }
    }

    if (attempts === maxAttempts) {
      return next(
        new Error("Failed to generate unique student identification")
      );
    }
  }
  next();
});

// Handle duplicate key errors
studentSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Student identification already exists. Please try again."));
  } else {
    next(error);
  }
});

const Student = models.Student || model("Student", studentSchema);

module.exports = Student;
