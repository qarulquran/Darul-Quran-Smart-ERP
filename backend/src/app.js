/**
 * ISM Smart ERP
 * Express Application
 *
 * Main backend application configuration.
 */

const express = require("express");
const cors = require("cors");

const { corsOptions } = require("./config/cors");

const { requestId } = require("./middleware/request-id");
const {
  instituteContext,
} = require("./middleware/institute-context");

const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/error-handler");

const app = express();

/**
 * --------------------------------------------------
 * Global Middleware
 * --------------------------------------------------
 */

// Assign a unique ID to every incoming request.
app.use(requestId);

// Configure Cross-Origin Resource Sharing.
app.use(cors(corsOptions));

// Detect the selected institute/tenant.
//
// IMPORTANT:
// This only identifies the requested institute.
// It does NOT authorize the user.
// Membership authorization will be added later.
app.use(instituteContext);

// Parse incoming JSON request bodies.
app.use(
  express.json({
    limit: "10mb",
  })
);

// Parse URL-encoded request bodies.
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/**
 * --------------------------------------------------
 * Public Routes
 * --------------------------------------------------
 */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ISM Smart ERP API is running",
    requestId: req.requestId,
  });
});

/**
 * Health Check
 */
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ISM Smart ERP backend is healthy",
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
  });
});

/**
 * --------------------------------------------------
 * API Routes
 * --------------------------------------------------
 *
 * Future modules will be registered here:
 *
 * /api/v1/auth
 * /api/v1/institutes
 * /api/v1/students
 * /api/v1/teachers
 * /api/v1/classes
 * /api/v1/subjects
 * /api/v1/attendance
 * /api/v1/fees
 * /api/v1/exams
 * /api/v1/certificates
 */

/**
 * --------------------------------------------------
 * Error Handling
 * --------------------------------------------------
 */

// Must stay after all application routes.
app.use(notFoundHandler);

// Must always be the final middleware.
app.use(errorHandler);

module.exports = app;
