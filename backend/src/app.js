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
  notFoundHandler,
  errorHandler,
} = require("./middleware/error-handler");

const app = express();

/**
 * Global Middleware
 */

// Assign a unique ID to every request.
app.use(requestId);

// Configure Cross-Origin Resource Sharing.
app.use(cors(corsOptions));

// Parse incoming JSON requests.
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
 * Basic API Route
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ISM Smart ERP API is running",
    requestId: req.requestId,
  });
});

/**
 * Health Check Route
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
 * 404 Handler
 *
 * Must stay after all application routes.
 */
app.use(notFoundHandler);

/**
 * Global Error Handler
 *
 * Must stay as the final middleware.
 */
app.use(errorHandler);

module.exports = app;
