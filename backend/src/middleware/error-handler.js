/**
 * ISM Smart ERP
 * Global Error Handler Middleware
 *
 * Handles backend API errors in one standard format.
 */

const notFoundHandler = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  error.statusCode = 404;

  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode =
    err.statusCode ||
    err.status ||
    500;

  const response = {
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message || "Request failed",
  };

  // Show technical error details only during development.
  if (process.env.NODE_ENV !== "production") {
    response.error = err.message;

    if (err.stack) {
      response.stack = err.stack;
    }
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
