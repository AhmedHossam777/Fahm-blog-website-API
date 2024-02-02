const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');

const getFeed = async (req, res, next) => {
  const posts = await Post.find();
  if (posts.length === 0) {
    return res.status(200).json({
      status: 'success',
      message: 'there is no posts yet',
    });
  }
  res.status(200).json({
    status: 'success',
    posts,
  });
};

const getPostsOfFollowedUsers = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const following = user.following;
  if (following.length === 0) {
    return res.status(200).json({
      status: 'success',
      message: 'you still did not follow anyone',
    });
  }

  let posts = [];
  for (const userId of following) {
    posts = await Post.find({ user: userId });
  }

  res.status(200).json({
    status: 'success',
    posts,
  });
};

const getPost = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const postId = req.params.id;
  if (!postId) {
    return next(new AppError('please provide the id in the url', 400));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError('there is no post with that id', 400));
  }

  if (!post.views.includes(user._id)) {
    post.views.push(user._id);
  }

  res.status(200).json({
    status: 'success',
    post,
  });
};

const createPost = async (req, res, next) => {
  console.log(req.file);
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
    photo: req.file.path, // path of the uploaded image
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

const likePost = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next('there is no post with that id', 404);
  }

  const likedUsersId = post.likes;
  if (likedUsersId.includes(user._id)) {
    return next(new AppError('you already liked this post', 400));
  }

  post.likes.push(user._id);
  await post.save();

  res.status(200).json({
    status: 'success',
    message: 'you liked this post',
  });
};

const disLikePost = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next('there is no post with that id', 404);
  }

  const disLikedUsersId = post.dislikes;
  if (disLikedUsersId.includes(user._id)) {
    return next(new AppError('you already disliked this post', 400));
  }

  post.dislikes.push(user._id);
  await post.save();

  res.status(200).json({
    status: 'success',
    message: 'you disliked this post',
  });
};

const deletePost = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next('there is no post with that id', 404);
  }

  if (post.user.toString() != user._id.toString()) {
    return next(
      new AppError('you are not authorized to delete this post', 403)
    );
  }

  await Post.findByIdAndDelete(post._id);

  res.status(200).json({
    status: 'success',
    message: 'post deleted successfully',
  });
};

const updatePost = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next('there is no post with that id', 404);
  }

  if (post.user.toString() != user._id.toString()) {
    return next(
      new AppError('you are not authorized to update this post', 403)
    );
  }

  const updatedPost = await Post.findByIdAndUpdate(post._id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'post updated successfully',
    updatedPost,
  });
};

module.exports = {
  getPost,
  createPost,
  getFeed,
  getPostsOfFollowedUsers,
  likePost,
  disLikePost,
  deletePost,
  updatePost,
};
