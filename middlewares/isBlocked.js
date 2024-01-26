const User = require('../models/User');
const AppError = require('../utils/AppError');

const isBlocked = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const wantedUser = await User.findById(req.params.id);

  const youBlock = user.blocked.find(
    (userId) => userId.toString() === req.params.id
  );

  if (youBlock) {
    return next(new AppError('you blocked this user!', 400));
  }

  const youAreBlocked = wantedUser.blocked.find(
    (userId) => userId.toString() === req.user.id
  );

  if (youAreBlocked) {
    return next(new AppError('you are blocked from this user!', 400));
  }

  next();
};

module.exports = isBlocked;
