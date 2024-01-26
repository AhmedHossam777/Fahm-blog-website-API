const User = require('./../models/User');
const AppError = require('../utils/AppError');

const isSuspended = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('user does not exist!', 400));
  }

  if (user.suspend) {
    return next(new AppError('user is suspended!', 400));
  }

  next();
};

module.exports = isSuspended;
