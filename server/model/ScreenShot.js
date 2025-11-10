const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Drive = require("./DriveFile");

const ScreenshotSchema = new Schema(
  {
    class_id: {
      type: String,
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
    uploaded_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Screenshot", ScreenshotSchema);
