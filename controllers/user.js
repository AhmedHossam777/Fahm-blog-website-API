const User = require('../models/User');
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT');

const register = async (req, res) => {
  const user = req.body;
  console.log(user);
  try {
    
    const email = user.email;
    const OldUser = await User.findOne({ email: email });

    if (OldUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists',
      });
    }
    const newUser = await User.create(user);
    
    const token = generateJWT(newUser._id);

    res.status(201).json({
      status: 'success',
      data: newUser,
      token
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide email and password',
    });

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({
      status: 'fail',
      message: 'User does not exist',
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({
      status: 'fail',
      message: 'Incorrect password',
    });
  }

  const token = generateJWT(user._id);
  
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    token,
    user: user._id
  });

};

const userProfile = async (req, res) => {
  
  const user = await User.findOne({ _id: req.user.id });
  if (!user) {
    return res.status(400).json({
      status: 'fail',
      message: 'User does not exist',
    });
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
