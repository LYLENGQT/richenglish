const mongoose = require("mongoose");
const User = require("./User");

const { Schema, models } = mongoose;

const adminSchema = new Schema({
  assignedTeachers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Admin = models.Admin || User.discriminator("admin", adminSchema);

module.exports = Admin;
