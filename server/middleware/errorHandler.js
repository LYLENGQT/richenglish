const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    error: {
      message: err.message || "Something went wrong. Please try again later",
      code: err.statusCode || null,
    },
  };

  if (err.code === "ER_DUP_ENTRY") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.error.message = "Duplicate entry. Please choose another value.";
  }

  if (
    err.code === "ER_ROW_IS_REFERENCED_2" ||
    err.code === "ER_NO_REFERENCED_ROW_2"
  ) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.error.message = "This action violates a database constraint.";
  }

  return res.status(customError.statusCode).json({ error: customError.error });
};

module.exports = errorHandler;
