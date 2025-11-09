const mongoose = require("mongoose");

const Drive = new mongoose.Schema(
  {
    id: { type: String, trim: true }, // Google Drive file ID
    webViewLink: { type: String, trim: true }, // Link to view in browser
    src: { type: String, trim: true }, // Optional: direct download/view link
  },
  { _id: false }
);

module.exports = Drive;
