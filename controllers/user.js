const User = require('../models/User');
const jwt = require('jsonwebtoken');
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

  const user = await User.findOne({ email: email });
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

const deleteUser = async (req, res) => {
  res.send('Delete user route');
};

const updateUser = async (req, res) => {
  res.send('Update user route');
};

module.exports = {
  register,
  login,
  userProfile,
  deleteUser,
  updateUser,
};
