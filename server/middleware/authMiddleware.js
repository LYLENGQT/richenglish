const {
  UnathenticatedError,
  BadRequestError,
} = require('../errors')
const { verifyToken } = require('../helper/sign')


const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) throw new BadRequestError('Access token required');
  
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    throw new UnathenticatedError(err.message || 'Invalid token');
  }
};

const requireAdmin = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized access to this route');
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin
};