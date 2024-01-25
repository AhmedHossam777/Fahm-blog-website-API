const User = require('../models/User');
const generateJWT = require('../utils/generateJWT');
const AppError = require('../utils/AppError');

const register = async (req, res, next) => {
  const user = req.body;
  console.log(user);
  const email = user.email;
  const OldUser = await User.findOne({ email: email });

  if (OldUser) {
    return next(new AppError('User already exists', 400));
  }
  const newUser = await User.create(user);

  const token = generateJWT(newUser._id);

  res.status(201).json({
    status: 'success',
    data: newUser,
    token,
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

  const token = generateJWT(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    token,
    user: user._id,
  });
};

const userProfile = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });
  if (!user) {
    return next(new AppError('User does not exist', 400));
  }
  res.status(200).json({
    status: 'success',
    data: user,
  });
};

const updateUser = async (req, res) => {
  res.send('Update user route');
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
  const user = await User.findById(req.params.id);
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
    user: [
      user.profilePhoto,
      user.firstName,
      user.lastName,
      user.posts,
      user.followers,
      user.following,
    ],
  });
};

const followUser = async (req, res, next) => {
  const followingUser = await User.findById(req.params.id);
  const followerUser = await User.findById(req.user.id);

  if (!followerUser || !followingUser) {
    return next(new AppError('User does not exist', 400));
  }

  const isFollow = followingUser.followers.find(
    (follower) => follower.toString() === req.user.id
  );

  if (isFollow) {
    return next(new AppError('You already follow this user!', 400));
  }

  followingUser.followers.push(followerUser);
  followerUser.following.push(followingUser);

  await followerUser.save();
  await followingUser.save();

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

  await unfollowedUser.save();
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'You have successfully unfollowed the user!',
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
  const users = await User.findOneAndDelete({ _id: req.params.id });
  await users.save();
  res.status(200).json({
    status: 'success',
    message: 'user deleted successfully',
  });
};

module.exports = {
  register,
  login,
  userProfile,
  deleteUser,
  updateUser,
  profilePhotoUpload,
  viewProfile,
  getAllUsers,
  followUser,
  unfollowUser,
};
