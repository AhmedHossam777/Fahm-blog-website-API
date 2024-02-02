const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const generateJWT = async (user, res) => {
  try {
    const token = await signToken(user._id);

    const cookieOption = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
      cookieOption.secure = true;
    }

    res.cookie('jwt', token, cookieOption);

    user.password = undefined;

    res.status(201).json({
      status: 'success',
      token: token,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Error generating JWT:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while generating the JWT token.',
    });
  }
};

module.exports = generateJWT;
