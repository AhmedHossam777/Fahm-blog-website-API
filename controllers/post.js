const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');

const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.status(200).json({
    status: 'success',
    posts,
  });
};

const getPost = async (req, res) => {
  res.send('Get post');
};

const createPost = async (req, res, next) => {
  const { title, description, category } = req.body;

  const user = await User.findById(req.user.id);
  const userCategory = await Category.findOne({
    user: req.user.id,
    title: category,
  });

  if (!userCategory) {
    return next(
      new AppError(
        'category does not exist in the user profile please create it first',
        404
      )
    );
  }

  const post = await Post.create({
    title,
    description,
    user: user._id,
    category: userCategory.title,
  });

  userCategory.posts.push(post._id);
  user.posts.push(post._id);
  await user.save();
  await userCategory.save();

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
