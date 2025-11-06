const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const classSchema = new Schema({
  teacher_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  book_id: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: false,
  },

  type: {
    type: String,
    enum: ["schedule", "reoccurring", "makeupClass"],
    required: true,
  },

  start_date: {
    type: Date,
    required: function () {
      return this.type !== "reoccurring";
    },
  },
  end_date: {
    type: Date,
    required: function () {
      return this.type !== "reoccurring";
    },
  },

  start_time: { type: String, required: true }, // e.g. "14:00"
  end_time: { type: String, required: true }, // e.g. "15:00"
  duration: { type: Number }, // in minutes

  reoccurringDays: {
    type: [String],
    enum: ["M", "T", "W", "TH", "F", "SAT", "SUN"],
    required: function () {
      return this.type === "reoccurring";
    },
    validate: {
      validator: function (v) {
        return (
          this.type !== "reoccurring" || (Array.isArray(v) && v.length > 0)
        );
      },
      message: "Reoccurring classes must specify at least one day.",
    },
  },

  platform_link: { type: String },

  reason: {
    type: String,
    required: function () {
      return this.type === "makeupClass";
    },
  },
  note: {
    type: String,
    required: function () {
      return this.type === "makeupClass";
    },
  },
  original_class_id: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: function () {
      return this.type === "makeupClass";
    },
  },
});

const Class = model("Class", classSchema);

module.exports = Class;
