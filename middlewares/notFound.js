const notFound = (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'Resource not found on this server',
  });
}

module.exports = notFound;