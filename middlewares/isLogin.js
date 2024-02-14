const verifyToken = require('../utils/verifyToken');
const createError = require('http-errors');
const User = require('../models/User');
const getTokenFromHeader = require('../utils/getTokenFromHeader');

const isLogin = async (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) {
    return next(createError(401, 'Unauthorized'));
  }
  const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

  if (decoded === 'TokenExpiredError') {
    return next(createError(401, 'Token expired'));
  }
  if (!decoded) {
    return next(createError(401, 'Unauthorized'));
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(createError(401, 'Unauthorized'));
  }
  req.user = user;
  next();
};

module.exports = isLogin;
