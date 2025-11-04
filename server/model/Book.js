const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    original_filename: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    path: {
      type: String,
      required: true,
      trim: true,
      maxlength: 512,
    },
    uploaded_by: {
      type: String,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

module.exports = mongoose.model("Book", bookSchema);
