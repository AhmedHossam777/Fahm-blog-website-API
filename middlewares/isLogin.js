const getTokenFromHeader = require('../utils/getTokenFromHeader');
const verifyToken = require('../utils/verifyToken');

const isLogin = async (req, res, next) => {
  const token = getTokenFromHeader(req);
  console.log(token);

  if (!token)
    return res.status(401).json({
      status: 'fail',
      message: 'Access denied. No token provided',
    });

  const decoded = await verifyToken(token);
  console.log(decoded);
  
  if (!decoded) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token',
    });
  }
  req.user = decoded; //! req.user is the user object from the token payload (user id)
  console.log(req.user);
  next();
};

module.exports = isLogin;
