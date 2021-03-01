const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.log(err);

  /**
   * Error case handler for a bad ObjectId
   * sets message,
   * creates new ErrorResponse object with message and
   * a statsCode for notFound, 404
   */
  if (err.name === 'CastError') {
    const message = `Resource not found with ID of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  /**
   * Error case handler for a duplicate key field.
   * sets message,
   * creates new ErrorResponse object with message and
   * a statsCode for badRequest, 400
   */
  if (err.code === 11000) {
    const message =
      'Duplicate value in key field for Resource where unique value is expected';
    error = new ErrorResponse(message, 400);
  }

  /**
   * Error case handler for validation error(s)
   * sets message,
   * creates new ErrorResponse object with message and
   * a statsCode for badRequest, 400
   */
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  /**
   * deault handler
   * sets status or default
   * sets message or default
   */
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
