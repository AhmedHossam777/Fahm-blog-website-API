require('express-async-errors');

const User = require('../models/User');
const AppError = require('../utils/AppError');
const Post = require('./../models/Post');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateJWT');
const verifyToken = require('../utils/verifyToken');

const register = async (req, res, next) => {
  const user = req.body;
  console.log(user);
  const email = user.email;
  const OldUser = await User.findOne({ email: email });

  if (OldUser) {
    return next(new AppError('User already exists', 400));
  }
  const newUser = await User.create(user);

  const [token, refreshToken] = await Promise.all([
    generateAccessToken(newUser),
    generateRefreshToken(newUser),
  ]);

  res.status(201).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email: email }).select('+password');
  if (!user) {
    return next(new AppError('User does not exist', 400));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid credentials', 400));
  }

  const [token, refreshToken] = await Promise.all([
    generateAccessToken(user),
    generateRefreshToken(user),
  ]);

  // Set the refresh token in a cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevent access from client-side scripts
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
  });

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    token,
    refreshToken,
    user: user._id,
  });
};

const userProfile = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id }).populate({
    path: 'posts', // populate posts field in user model with posts data
  });
  if (!user) {
    return next(new AppError('User does not exist', 400));
  }
  res.status(200).json({
    status: 'success',
    data: user,
  });
};

const profilePhotoUpload = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });
  if (!user) {
    return next(new AppError('User does not exist', 400));
  }
  if (user.isBlocked) {
    return next(new AppError('You are blocked', 403));
  }
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  }

  await User.findByIdAndUpdate(
    req.user.id,
    {
      profilePhoto: req.file.path,
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: 'Photo uploaded successfully',
    user,
  });
};

const viewProfile = async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    return next(new AppError('please provide the id in the url', 400));
  }

  const user = await User.findById(userId);
  const viewers = await User.findById(req.user.id);
  if (!user || !viewers) {
    return next(new AppError('User does not exist', 400));
  }

  const isViewed = user.viewers.find(
    (viewer) => viewer.toString() === req.user.id
  );

  if (!isViewed) {
    user.viewers.push(req.user.id);
    await user.save();
  }

  res.status(200).json({
    status: 'success',
    message: 'Profile viewed successfully',
    user: {
      profilePhoto: user.profilePhoto,
      firstName: user.firstName,
      lastName: user.lastName,
      posts: user.posts,
      followers: user.followers,
      following: user.following,
    },
  });
};

const followUser = async (req, res, next) => {
  const followedUser = await User.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (!user || !followedUser) {
    return next(new AppError('User does not exist', 400));
  }

  const isFollow = followedUser.followers.find(
    (follower) => follower.toString() === req.user.id
  );

  if (isFollow) {
    return next(new AppError('You already follow this user!', 400));
  }

  followedUser.followers.push(user);
  user.following.push(followedUser);

  await Promise.all([followedUser.save(), user.save()]);

  res.status(200).json({
    status: 'success',
    message: 'you successfully follow the user!',
  });
};

const unfollowUser = async (req, res, next) => {
  let unfollowedUser = await User.findById(req.params.id);
  let user = await User.findById(req.user.id);

  if (!user || !unfollowedUser) {
    return next(new AppError('User does not exist', 400));
  }

  const isFollow = unfollowedUser.followers.find(
    (followerId) => followerId.toString() === req.user.id
  );

  if (!isFollow) {
    return next(new AppError('You are not following this user!', 400));
  }

  unfollowedUser.followers = unfollowedUser.followers.filter((followerId) => {
    return followerId.toString() !== req.user.id;
  });

  user.following = user.following.filter((followingId) => {
    return followingId.toString() !== unfollowedUser._id.toString();
  });

  await Promise.all([unfollowedUser.save(), user.save()]);

  res.status(200).json({
    status: 'success',
    message: 'You have successfully unfollowed the user!',
  });
};

const blockUser = async (req, res, next) => {
  const blockedUser = await User.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (!user || !blockedUser) {
    return next(new AppError('User does not exist', 400));
  }

  const isBlocked = user.blocked.find(
    (userId) => userId.toString() === req.params.id
  );

  if (isBlocked) {
    return next(new AppError('You already blocked this user', 400));
  }

  user.blocked.push(blockedUser.id);

  user.followers = user.followers.filter((userId) => {
    return userId.toString() !== blockedUser._id.toString();
  });
  user.following = user.following.filter((userId) => {
    return userId.toString() !== blockedUser._id.toString();
  });

  blockedUser.following = blockedUser.following.filter((userId) => {
    return userId.toString() !== user._id.toString();
  });
  blockedUser.followers = blockedUser.followers.filter((userId) => {
    return userId.toString() !== user._id.toString();
  });

  await Promise.all([user.save(), blockedUser.save()]);

  res.status(200).json({
    status: 'success',
    message: 'User blocked successfully!',
  });
};

const unblockUser = async (req, res, next) => {
  const blockedUser = await User.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (!user || !blockedUser) {
    return next(new AppError('User does not exist', 400));
  }

  const isBlocked = user.blocked.find(
    (userId) => userId.toString() === req.params.id
  );

  if (!isBlocked) {
    return next(new AppError('you did not blocked this user', 400));
  }

  user.blocked = user.blocked.filter((userId) => {
    return userId.toString() !== blockedUser._id.toString();
  });

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'user unblocked successfully!',
  });
};

const suspendUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  const isSuspended = user.suspend;
  if (isSuspended) {
    return next(new AppError('user already suspended!', 400));
  }

  user.suspend = true;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'user suspended successfully!',
  });
};

const unSuspendUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const isSuspended = user.suspend;
  if (!isSuspended) {
    return next(new AppError('user is not suspended!', 400));
  }

  user.suspend = false;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'user unSuspended successfully!',
  });
};

const updateUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (password) {
    return next(new AppError('cannot update password in this route', 400));
  }

  const dupEmail = await User.findOne({ email: email });
  if (dupEmail) {
    return next(new AppError('there is a user with this email', 400));
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });
  await updatedUser.save();

  res.status(203).json({
    status: 'success',
    updatedUser,
  });
};

const updateUserPassword = async (req, res, next) => {
  const password = req.body.password;
  const newPassword = req.body.newPassword;

  const user = await User.findById(req.user.id).select('+password');

  const isCorrectPass = user.comparePassword(password);
  if (!isCorrectPass) {
    return next(new AppError('wrong password!', 400));
  }

  user.password = newPassword;

  await user.save();
  res.status(203).json({
    status: 'success',
    message: 'password updated successfully',
  });
};

const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: users,
  });
};

const deleteUser = async (req, res, next) => {
  await User.findOneAndDelete({ _id: req.user.id });
  await Post.deleteMany({ user: req.user.id });
  await Comment.deleteMany({ user: req.user.id });
  await Category.deleteMany({ user: req.user.id });

  res.status(204).json({
    status: 'success',
    message: 'user deleted successfully',
  });
};

const refreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return next(createError(400, 'Refresh token is required'));
  }

  const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (!decoded || decoded === 'TokenExpiredError') {
    return next(createError(401, 'Invalid refresh token'));
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(createError(404, 'User not found'));
  }

  const [newToken, newRefreshToken] = await Promise.all([
    generateAccessToken(user),
    generateRefreshToken(user),
  ]);

  // Set the refresh token in a cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevent access from client-side scripts
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
  });

  res.status(200).json({
    status: 'success',
    user,
    token: newToken,
    refreshToken: newRefreshToken,
  });
};

module.exports = {
  register,
  login,
  userProfile,
  deleteUser,
  profilePhotoUpload,
  viewProfile,
  getAllUsers,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
  suspendUser,
  unSuspendUser,
  updateUser,
  updateUserPassword,
  refreshToken,
};
