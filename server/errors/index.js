const CustomError = require("./custom-error.js");
const BadRequestError = require("./bad-request.js");
const NotFoundError = require("./not-found.js");
const UnathenticatedError = require("./unathenticated.js");
const UnathoizedError = require("./unathorized.js");

module.exports = {
  BadRequestError,
  CustomError,
  NotFoundError,
  UnathenticatedError,
  UnathoizedError,
};