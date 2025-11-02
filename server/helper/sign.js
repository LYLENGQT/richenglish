const jwt = require("jsonwebtoken");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

/**
 * Verify either access or refresh token
 * @param {string} token - The JWT token string
 * @param {"access"|"refresh"} type - Token type to verify
 * @returns {object} Decoded JWT payload
 */
async function verifyToken(token, type = "access") {
  try {
    if (!token) throw new BadRequestError("Token is required");

    const secret = type === "refresh" ? REFRESH_SECRET : ACCESS_SECRET;

    const payload = jwt.verify(token, secret);
    return payload;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new UnathenticatedError(`${type} token expired`);
    } else if (err.name === "JsonWebTokenError") {
      throw new UnathenticatedError(`Invalid ${type} token`);
    }
    throw err;
  }
}

module.exports = verifyToken;
