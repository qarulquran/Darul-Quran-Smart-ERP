/**
 * ISM Smart ERP
 * Express Application
 *
 * Main backend application configuration.
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const {
  rateLimit,
} = require("express-rate-limit");

const {
  env,
} = require("./config/env");

const {
  corsOptions,
} = require("./config/cors");

const {
  requestId,
} = require("./middleware/request-id");

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

const authRoutes = require(
  "./routes/auth.routes"
);

const instituteOnboardingRoutes = require(
  "./routes/institute-onboarding.routes"
);

const tenantRoutes = require(
  "./routes/tenant.routes"
);

const studentRoutes = require(
  "./routes/student.routes"
);

const app = express();

// --------------------------------------------------
// Security Headers
// --------------------------------------------------

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// --------------------------------------------------
// Request ID
// --------------------------------------------------

app.use(requestId);

// --------------------------------------------------
// Request Logging
// --------------------------------------------------

if (env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// --------------------------------------------------
// CORS
// --------------------------------------------------

app.use(cors(corsOptions));

// --------------------------------------------------
// Global API Rate Limiting
// --------------------------------------------------

const apiRateLimit = rateLimit({
  windowMs:
    15 * 60 * 1000,

  max: 500,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
    code: "API_RATE_LIMIT_EXCEEDED",
  },

  handler: (
    req,
    res,
    next,
    options
  ) => {
    return res
      .status(options.statusCode)
      .json({
        ...options.message,

        requestId:
          req.requestId || null,
      });
  },
});

app.use(
  "/api",
  apiRateLimit
);

// --------------------------------------------------
// Institute Context
// --------------------------------------------------

app.use(instituteContext);

// --------------------------------------------------
// Request Body Parsing
// --------------------------------------------------

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// --------------------------------------------------
// Root Route
// --------------------------------------------------

app.get(
  "/",
  (req, res) => {
    return res.status(200).json({
      success: true,

      message:
        "ISM Smart ERP API is running",

      requestId:
        req.requestId,

      timestamp:
        new Date().toISOString(),
    });
  }
);

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get(
  "/api/v1/health",
  async (req, res, next) => {
    try {
      const database =
        await checkDatabaseConnection();

      return res
        .status(200)
        .json({
          success: true,
          status: "healthy",

          message:
            "ISM Smart ERP backend is healthy",

          services: {
            api: {
              status: "up",
            },

            database: {
              status: "up",

              name:
                database.database_name,

              time:
                database.database_time,
            },
          },

          requestId:
            req.requestId,

          timestamp:
            new Date().toISOString(),
        });
    } catch (error) {
      error.statusCode = 503;
      error.code =
        "DATABASE_HEALTH_CHECK_FAILED";

      error.message =
        "Database health check failed";

      return next(error);
    }
  }
);

// --------------------------------------------------
// API Routes
// --------------------------------------------------

app.use(
  "/api/v1/auth",
  authRoutes
);

app.use(
  "/api/v1/onboarding",
  instituteOnboardingRoutes
);

app.use(
  "/api/v1/tenant",
  tenantRoutes
);

app.use(
  "/api/v1/students",
  studentRoutes
);

/**
 * Future modules:
 *
 * /api/v1/institutes
 * /api/v1/teachers
 * /api/v1/classes
 * /api/v1/subjects
 * /api/v1/attendance
 * /api/v1/fees
 * /api/v1/exams
 * /api/v1/certificates
 */

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------

app.use(notFoundHandler);

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------

app.use(errorHandler);

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = app;
