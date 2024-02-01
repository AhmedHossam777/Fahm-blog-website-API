const User = require('../models/User');
const Post = require('../models/Post');

const hidePosts = async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  const userId = post.user;
  const postOwner = await User.findById(userId);
  const blockedUsers = postOwner.blocked;

  if (blockedUsers.includes(req.user.id)) {
    return res.status(200).json({
      status: 'success',
      message: 'you are blocked by the user',
    });
  }

  next();
};

module.exports = hidePosts;
