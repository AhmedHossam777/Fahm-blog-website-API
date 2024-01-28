const Post = require('../models/Post');
const User = require('../models/User');

const getPosts = async (req, res) => {
  res.send('Get all posts');
};

const getPost = async (req, res) => {
  res.send('Get post');
};

const createPost = async (req, res) => {
  const { title, description } = req.body;
  const user = await User.findById(req.user.id);

  const post = await Post.create({ title, description, user: user._id });

  user.posts.push(post._id);
  await user.save();

  res.status(201).json({
    status: 'success',
    post,
  });
};

module.exports = {
  getPosts,
  getPost,
  createPost,
};
