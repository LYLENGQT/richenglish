const mongoose = require("mongoose");
const { Schema, model } = mongoose;

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
    drive_link: {
      type: String,
      required: true,
    },
    uploaded_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Screenshot", ScreenshotSchema);
