const User = require('./../models/User');
const AppError = require('../utils/AppError');

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('user does not exist!', 400));
  }
  const role = user.role;
  if (role !== 'Admin') {
    return next(new AppError('user are not admin!', 400));
  }

  next()
};

module.exports = isAdmin
