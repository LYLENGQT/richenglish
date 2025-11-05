const mongoose = require("mongoose");
const User = require("./User");

const { Schema, models } = mongoose;

const teacherSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  degree: { type: String },
  major: { type: String },
  englishLevel: { type: String },
  experience: { type: String },
  motivation: { type: String },
  availability: { type: String },
  internetSpeed: { type: String },
  computerSpecs: { type: String },
  hasWebcam: { type: Boolean, default: false },
  hasHeadset: { type: Boolean, default: false },
  hasBackupInternet: { type: Boolean, default: false },
  hasBackupPower: { type: Boolean, default: false },
  teachingEnvironment: { type: String },
  resume: { type: String },
  introVideo: { type: String },
  speedTestScreenshot: { type: String },
  assignedAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  zoom_link: { type: String },
  accepted: { type: Boolean, default: false },
  birth_day: { type: Date },
});

const Teacher = models.Teacher || User.discriminator("teacher", teacherSchema);

module.exports = Teacher;
