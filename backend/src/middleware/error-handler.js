/**
 * ISM Smart ERP
 * Global Error Handler Middleware
 *
 * Provides a consistent API error response format.
 */

const notFoundHandler = (
  req,
  res,
  next
) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  error.statusCode = 404;
  error.code = "ROUTE_NOT_FOUND";

  next(error);
};

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------

const errorHandler = (
  err,
  req,
  res,
  next
) => {
  const statusCode =
    err.statusCode ||
    err.status ||
    500;

  const response = {
    success: false,

    message:
      statusCode === 500
        ? "Internal server error"
        : err.message ||
          "Request failed",

    code:
      err.code ||
      (statusCode === 500
        ? "INTERNAL_SERVER_ERROR"
        : "REQUEST_FAILED"),

    requestId:
      req.requestId || null,
  };

  // --------------------------------------------------
  // Validation Details
  // --------------------------------------------------

  if (
    Array.isArray(
      err.validationErrors
    ) &&
    err.validationErrors.length > 0
  ) {
    response.validationErrors =
      err.validationErrors;
  }

  // --------------------------------------------------
  // Development Debug Information
  // --------------------------------------------------

  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    response.error =
      err.message;

    if (err.stack) {
      response.stack =
        err.stack;
    }
  }

  return res
    .status(statusCode)
    .json(response);
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  notFoundHandler,
  errorHandler,
};
