const globalErrorHandler = (err, req, res, next) => {
  // console.log(err);
  res.status(500).json({
    status: 'fail',
    message: err.message,
    error : err.stack
  });
}

module.exports = globalErrorHandler;