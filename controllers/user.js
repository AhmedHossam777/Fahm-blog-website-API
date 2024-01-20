const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const user = req.body;
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

    res.status(201).json({
      status: 'success',
      data: newUser,
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

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    token
  });

};

const userProfile = async (req, res) => {
  res.send('Get me route');
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
