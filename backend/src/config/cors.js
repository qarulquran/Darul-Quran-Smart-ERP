/**
 * ISM Smart ERP
 * CORS Configuration
 *
 * Controls which frontend applications
 * are allowed to communicate with the backend API.
 */

const { env } = require("./env");

const getAllowedOrigins = () => {
  if (!env.CORS_ORIGIN || env.CORS_ORIGIN === "*") {
    return "*";
  }

  return env.CORS_ORIGIN
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const allowedOrigins = getAllowedOrigins();

const corsOptions = {
  origin(origin, callback) {
    // Allow requests without an Origin header
    // such as server-to-server requests and API testing tools.
    if (!origin) {
      return callback(null, true);
    }

    // Development/default mode: allow all origins.
    if (allowedOrigins === "*") {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const error = new Error("Origin is not allowed by CORS");
    error.statusCode = 403;

    return callback(error);
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Institute-ID",
  ],

  credentials: true,

  optionsSuccessStatus: 204,
};

module.exports = {
  corsOptions,
  getAllowedOrigins,
};
