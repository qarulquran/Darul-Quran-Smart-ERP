/**
 * ISM Smart ERP
 * Global Error Handler Middleware
 *
 * Provides:
 * - Consistent API error responses
 * - Safe production responses
 * - Detailed server-side error logging
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
// Server-Side Error Logger
// --------------------------------------------------

const logServerError = (
  err,
  req,
  statusCode
) => {
  if (statusCode < 500) {
    return;
  }

  console.error(
    "=========================================="
  );

  console.error(
    "ISM Smart ERP Server Error"
  );

  console.error(
    "=========================================="
  );

  console.error(
    "Request ID:",
    req.requestId || "N/A"
  );

  console.error(
    "Request:",
    `${req.method} ${req.originalUrl}`
  );

  console.error(
    "Status:",
    statusCode
  );

  console.error(
    "Message:",
    err.message || "Unknown error"
  );

  if (err.code) {
    console.error(
      "Error code:",
      err.code
    );
  }

  // PostgreSQL error information
  if (err.severity) {
    console.error(
      "Database severity:",
      err.severity
    );
  }

  if (err.detail) {
    console.error(
      "Database detail:",
      err.detail
    );
  }

  if (err.hint) {
    console.error(
      "Database hint:",
      err.hint
    );
  }

  if (err.schema) {
    console.error(
      "Database schema:",
      err.schema
    );
  }

  if (err.table) {
    console.error(
      "Database table:",
      err.table
    );
  }

  if (err.column) {
    console.error(
      "Database column:",
      err.column
    );
  }

  if (err.constraint) {
    console.error(
      "Database constraint:",
      err.constraint
    );
  }

  if (err.routine) {
    console.error(
      "Database routine:",
      err.routine
    );
  }

  if (err.stack) {
    console.error(
      "Stack trace:"
    );

    console.error(
      err.stack
    );
  }

  console.error(
    "=========================================="
  );
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

  // ------------------------------------------------
  // Log server errors privately
  // ------------------------------------------------

  logServerError(
    err,
    req,
    statusCode
  );

  // ------------------------------------------------
  // Public API Response
  // ------------------------------------------------

  const response = {
    success: false,

    message:
      statusCode >= 500
        ? "Internal server error"
        : err.message ||
          "Request failed",

    code:
      statusCode >= 500
        ? "INTERNAL_SERVER_ERROR"
        : err.code ||
          "REQUEST_FAILED",

    requestId:
      req.requestId || null,
  };

  // ------------------------------------------------
  // Validation Details
  // ------------------------------------------------

  if (
    Array.isArray(
      err.validationErrors
    ) &&
    err.validationErrors.length > 0
  ) {
    response.validationErrors =
      err.validationErrors;
  }

  // ------------------------------------------------
  // Development Debug Information
  // ------------------------------------------------

  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    response.error =
      err.message;

    response.debug = {
      code:
        err.code || null,

      detail:
        err.detail || null,

      table:
        err.table || null,

      column:
        err.column || null,

      constraint:
        err.constraint || null,
    };

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
