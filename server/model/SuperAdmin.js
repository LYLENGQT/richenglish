const mongoose = require("mongoose");
const User = require("./User");

const { Schema, models } = mongoose;

const superAdminSchema = new Schema({});

const SuperAdmin =
  models.SuperAdmin || User.discriminator("super-admin", superAdminSchema);

module.exports = SuperAdmin;
