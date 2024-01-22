const jwt = require('jsonwebtoken');

const verifyToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    return decoded;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

module.exports = verifyToken;
