const User = require('../models/User');
const AppError = require('../utils/AppError');

const isBlocked = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const wantedUser = await User.findById(req.params.id);

  const youBlock = user.blocked.find(
    (userId) => userId.toString() === req.params.id
  );

  if (youBlock) {
    return res.send('you blocked this user')
  }

  const youAreBlocked = wantedUser.blocked.find(
    (userId) => userId.toString() === req.user.id
  );

  if (youAreBlocked) {
    return res.send('you are blocked')
  }

  next();
};

module.exports = isBlocked;
