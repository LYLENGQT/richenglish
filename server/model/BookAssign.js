const mongoose = require("mongoose");
const User = require("./User");

const bookAssignmentSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    assigned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (userId) {
          const user = await User.findById(userId);
          return user && ["admin", "super-admin"].includes(user.role);
        },
        message:
          "Only users with roles 'admin' or 'super-admin' can assign books.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookAssign", bookAssignmentSchema);
