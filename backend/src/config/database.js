/**
 * ISM Smart ERP
 * Database Configuration
 *
 * Central PostgreSQL database configuration
 * for the multi-institution ERP backend.
 */

const {
  env,
  getEnv,
} = require("./env");

// --------------------------------------------------
// Shared Database Values
// --------------------------------------------------

const getSharedDatabaseValues = () => {
  return {
    host: getEnv("DB_HOST", "localhost"),

    port: Number(
      getEnv("DB_PORT", 5432)
    ),

    user: getEnv(
      "DB_USER",
      "postgres"
    ),

    password: getEnv(
      "DB_PASSWORD",
      ""
    ),
  };
};

// --------------------------------------------------
// Environment Database Configuration
// --------------------------------------------------

const DATABASE_CONFIG = {
  development: {
    ...getSharedDatabaseValues(),

    database: getEnv(
      "DB_NAME",
      "ism_smart_erp"
    ),

    ssl: false,
  },

  production: {
    host: getEnv("DB_HOST", ""),

    port: Number(
      getEnv("DB_PORT", 5432)
    ),

    database: getEnv(
      "DB_NAME",
      ""
    ),

    user: getEnv(
      "DB_USER",
      ""
    ),

    password: getEnv(
      "DB_PASSWORD",
      ""
    ),

    ssl:
      getEnv(
        "DB_SSL",
        "false"
      ).toLowerCase() === "true",
  },

  test: {
    ...getSharedDatabaseValues(),

    database: getEnv(
      "DB_TEST_NAME",
      "ism_smart_erp_test"
    ),

    ssl: false,
  },
};

// --------------------------------------------------
// Current Environment
// --------------------------------------------------

const getEnvironment = () => {
  return env.NODE_ENV || "development";
};

// --------------------------------------------------
// Current Database Configuration
// --------------------------------------------------

const getDatabaseConfig = () => {
  const environment = getEnvironment();

  const config =
    DATABASE_CONFIG[environment] ||
    DATABASE_CONFIG.development;

  return {
    ...config,
    environment,
  };
};

// --------------------------------------------------
// Validate Database Configuration
// --------------------------------------------------

const validateDatabaseConfig = () => {
  const environment = getEnvironment();
  const config = getDatabaseConfig();

  if (environment !== "production") {
    return true;
  }

  const requiredValues = [
    ["DB_HOST", config.host],
    ["DB_NAME", config.database],
    ["DB_USER", config.user],
    ["DB_PASSWORD", config.password],
  ];

  const missingValues = requiredValues
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingValues.length > 0) {
    throw new Error(
      `Missing database environment variables: ${missingValues.join(
        ", "
      )}`
    );
  }

  return true;
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  DATABASE_CONFIG,
  getEnvironment,
  getDatabaseConfig,
  validateDatabaseConfig,
};
