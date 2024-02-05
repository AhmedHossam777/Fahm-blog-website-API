const jwt = require('jsonwebtoken');

const verifyToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET); // decoded = { id: 'user id' } from the token payload

    return decoded;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

module.exports = verifyToken;
