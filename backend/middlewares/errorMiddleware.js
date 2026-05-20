/**
 * 404 Not Found handler.
 * Triggered when no route matches the incoming request.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global error handler.
 * Catches all errors passed via next(error) and returns a JSON response.
 */
const errorHandler = (err, req, res, next) => {
  // Sometimes a 200 slips through — default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Include stack trace only in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
