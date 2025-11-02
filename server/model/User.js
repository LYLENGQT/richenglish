const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Schema, model, models } = mongoose;

const userBaseSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    role: {
      type: String,
      enum: ["teacher", "admin", "super-admin"],
      default: "teacher",
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    timezone: { type: String, default: "Asia/Manila" },
  },
  { timestamps: true, discriminatorKey: "role" }
);

userBaseSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userBaseSchema.methods.checkPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

userBaseSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_SECRET,
    { expiresIn: "1d" }
  );
};

userBaseSchema.methods.generateRefreshToken = async function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_SECRET, {
    expiresIn: "1w",
  });
};

const User = models.User || model("User", userBaseSchema);
module.exports = User;
