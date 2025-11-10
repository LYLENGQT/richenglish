const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    start_time: {
      type: String, // e.g., "10:00"
    },
    end_time: {
      type: String, // e.g., "11:00"
    },
    minutes_attended: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    screenshots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screenshot",
      },
    ],
    recording: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recording",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
