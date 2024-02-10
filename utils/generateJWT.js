const jwt = require('jsonwebtoken');

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { userId };
    const secret = process.env.JWT_SECRET;
    const options = {
      expiresIn: process.env.JWT_EXPIRE,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const generateJWT = async (user, res) => {
    const token = await signAccessToken(user._id);

    user.password = undefined;

    return token;
};

module.exports = generateJWT;
