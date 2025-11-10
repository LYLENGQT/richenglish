const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const { Schema, model, models } = mongoose;

const genStudentIdentification = () =>
  `STD${uuidv4().replace(/-/g, "").substring(0, 7)}`;

const studentSchema = new Schema(
  {
    student_identification: {
      type: String,
      unique: true,
    },
    name: { type: String, required: true },
    age: { type: Number },
    nationality: {
      type: String,
      enum: ["KOREAN", "CHINESE"],
      required: true,
    },
    manager_type: {
      type: String,
      enum: ["KM", "CM"],
      required: true,
    },
    email: { type: String },
    book: { type: String },
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

studentSchema.pre("save", function (next) {
  if (!this.student_identification) {
    this.student_identification = genStudentIdentification();
  }
  next();
});

const Student = models.Student || model("Student", studentSchema);

module.exports = Student;
