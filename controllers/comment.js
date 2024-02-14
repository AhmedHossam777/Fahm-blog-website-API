require('express-async-errors');


const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const AppError = require('../utils/AppError');

const getCommentsOfPost = async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('comments');

  if (!post) {
    return next(new AppError('Post does not exist', 400));
  }

  res.status(200).json({
    status: 'success',
    comments: post.comments,
  });
};

const getComment = async (req, res,next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new AppError('Comment does not exist', 400));
  }
  res.status(200).json({
    status: 'success',
    comment,
  });
};

const createComment = async (req, res, next) => {
  const post = await Post.findById(req.body.post);
  if (!post) {
    return next(new AppError('Post does not exist', 400));
  }
  const comment = await Comment.create({
    post: req.body.post,
    user: req.user.id,
    description: req.body.description,
  });
  post.comments.push(comment._id);
  await post.save();
  res.status(201).json({
    status: 'success',
    comment,
  });
};

const updateComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new AppError('Comment does not exist', 400));
  }
  if (comment.user.toString() !== req.user.id) {
    return next(new AppError('You are not allowed to update this comment', 400));
  }
  comment.description = req.body.description;
  await comment.save();
  res.status(200).json({
    status: 'success',
    comment,
  });
}

const deleteComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new AppError('Comment does not exist', 400));
  }
  if (comment.user.toString() !== req.user.id) {
    return next(new AppError('You are not allowed to delete this comment', 400));
  }
  await Comment.findByIdAndDelete(comment._id);
  res.status(200).json({
    status: 'success',
    message: 'Comment deleted successfully',
  });
}


const likeComment = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError('Comment does not exist', 400));
  }

  const likedUsersId = comment.likes;
  if (likedUsersId.includes(user._id)) {
    return next(new AppError('You already liked this comment', 400));
  }

  comment.likes.push(user._id);
  await comment.save();

  res.status(200).json({
    status: 'success',
    message: 'You liked this comment',
  });
}


module.exports = {
  getCommentsOfPost,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
};
