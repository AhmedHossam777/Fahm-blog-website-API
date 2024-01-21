const jwt = require('jsonwebtoken');
const getTokenFromHeader = require('../utils/getTokenFromHeader');

const auth = async (req, res, next) => {
  
  const token = getTokenFromHeader(req);
  console.log(token);

  if (!token)
    return res.status(401).json({
      status: 'fail',
      message: 'Access denied. No token provided',
    });

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid token',
    });
  }
};

module.exports = auth;
