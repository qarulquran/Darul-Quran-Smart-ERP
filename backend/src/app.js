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

const {
  checkDatabaseConnection,
} = require("./database/db");

const authRoutes = require("./routes/auth.routes");

const app = express();

// --------------------------------------------------
// Core Middleware
// --------------------------------------------------

app.use(requestId);

app.use(cors(corsOptions));

app.use(instituteContext);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// --------------------------------------------------
// Root Route
// --------------------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ISM Smart ERP API is running",
    requestId: req.requestId,
  });
});

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/api/v1/health", async (req, res, next) => {
  try {
    const database = await checkDatabaseConnection();

    res.status(200).json({
      success: true,
      status: "healthy",
      message: "ISM Smart ERP backend is healthy",

      services: {
        api: {
          status: "up",
        },

        database: {
          status: "up",
          name: database.database_name,
          time: database.database_time,
        },
      },

      requestId: req.requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    error.statusCode = 503;
    error.message = "Database health check failed";

    next(error);
  }
});

// --------------------------------------------------
// API Routes
// --------------------------------------------------

app.use(
  "/api/v1/auth",
  authRoutes
);

/**
 * Future modules:
 *
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

// --------------------------------------------------
// Error Handling
// --------------------------------------------------

app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;
