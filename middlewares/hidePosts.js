const User = require('../models/User');
const Post = require('../models/Post');

const hidePosts = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const blockedUsersId = user.blocked;
  let posts = [];

  for (const userId of blockedUsersId) {
    posts = await Post.find({ user: userId });
  }

  if (posts) {
    res.send('you are blocked')
  }

  next();
};

module.exports = hidePosts;
