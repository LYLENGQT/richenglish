const mongoose = require("mongoose");
const Drive = require("./DriveFile");

const recordingSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    drive: Drive,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recording", recordingSchema);
