const jwt = require("jsonwebtoken");
const Token = require("../models/Tokens");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

async function signAndStoreToken(
  teacher,
  tokenType = "access",
  expiresIn = "24h"
) {
  const token = jwt.sign(
    { id: teacher.id, email: teacher.email, role: teacher.role },
    JWT_SECRET,
    { expiresIn }
  );

  let expiresAt = new Date(Date.now() + parseExpiresIn(expiresIn));

  await Token.create(teacher.id, tokenType, token, expiresAt);
  return token;
}

async function verifyToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const tokenRecord = await Token.findValidTokenByTokenString(token);
    if (!tokenRecord) {
      throw new Error("Token is invalid or revoked");
    }

    return payload;
  } catch (error) {
    throw error;
  }
}

function parseExpiresIn(expiresIn) {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 24 * 60 * 60 * 1000;
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return 24 * 60 * 60 * 1000;
  }
}

module.exports = { signAndStoreToken, verifyToken, parseExpiresIn };
