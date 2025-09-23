const { StatusCodes } = require("http-status-codes");
const CustomError = require("./custom-error.js");

class BadRequestError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    console.log(this.statusCode)
  }
}

module.exports = BadRequestError;