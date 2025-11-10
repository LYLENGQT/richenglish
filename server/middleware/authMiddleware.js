const {
  UnathenticatedError,
  BadRequestError,
  UnathoizedError,
} = require("../errors");
const verifyToken = require("../helper/sign");

const authenticateToken = async (req, res, next) => {
  try {
    const { token, refresh } = req.cookies;

    if (!token) throw new BadRequestError("Access token required");

    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    throw new UnathenticatedError(err.message || "Invalid token");
  }
};

const requireAdmin = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new UnathoizedError("Unauthorized access to this route");
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
};
