const jwt = require('jsonwebtoken');

const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return 'TokenExpiredError';
    }
    console.error(err.message);
    return false;
  }
};

module.exports = verifyToken;
