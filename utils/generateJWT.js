const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const generateJWT = async (user, res) => {
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

    return token;
};

module.exports = generateJWT;
