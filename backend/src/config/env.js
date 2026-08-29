/**
 * ISM Smart ERP
 * Environment Configuration
 *
 * Loads and provides centralized backend
 * environment settings.
 */

const path = require("path");
const dotenv = require("dotenv");

// --------------------------------------------------
// Load Environment File
// --------------------------------------------------

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

// --------------------------------------------------
// Environment Helper
// --------------------------------------------------

const getEnv = (key, defaultValue = "") => {
  const value = process.env[key];

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return defaultValue;
  }

  return value;
};

// --------------------------------------------------
// Application Environment
// --------------------------------------------------

const env = {
  NODE_ENV: getEnv(
    "NODE_ENV",
    "development"
  ),

  HOST: getEnv(
    "HOST",
    "0.0.0.0"
  ),

  PORT: Number(
    getEnv("PORT", 5000)
  ),

  API_PREFIX: getEnv(
    "API_PREFIX",
    "/api/v1"
  ),

  // ------------------------------------------------
  // Database
  // ------------------------------------------------

  DATABASE_URL: getEnv(
    "DATABASE_URL",
    ""
  ),

  // ------------------------------------------------
  // Authentication
  // ------------------------------------------------

  JWT_SECRET: getEnv(
    "JWT_SECRET",
    ""
  ),

  JWT_EXPIRES_IN: getEnv(
    "JWT_EXPIRES_IN",
    "1h"
  ),

  // ------------------------------------------------
  // CORS
  // ------------------------------------------------

  CORS_ORIGIN: getEnv(
    "CORS_ORIGIN",
    "*"
  ),

  // ------------------------------------------------
  // Password Security
  // ------------------------------------------------

  BCRYPT_SALT_ROUNDS: Number(
    getEnv(
      "BCRYPT_SALT_ROUNDS",
      12
    )
  ),

  // ------------------------------------------------
  // Database Pool
  // ------------------------------------------------

  DB_POOL_MAX: Number(
    getEnv(
      "DB_POOL_MAX",
      20
    )
  ),

  DB_IDLE_TIMEOUT_MS: Number(
    getEnv(
      "DB_IDLE_TIMEOUT_MS",
      30000
    )
  ),

  DB_CONNECTION_TIMEOUT_MS: Number(
    getEnv(
      "DB_CONNECTION_TIMEOUT_MS",
      10000
    )
  ),
};

// --------------------------------------------------
// Environment Flags
// --------------------------------------------------

const isProduction =
  env.NODE_ENV === "production";

const isDevelopment =
  env.NODE_ENV === "development";

const isTest =
  env.NODE_ENV === "test";

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  env,
  getEnv,
  isProduction,
  isDevelopment,
  isTest,
};
