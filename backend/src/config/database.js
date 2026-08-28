/**
 * ISM Smart ERP
 * Database Configuration
 *
 * Central database configuration for the
 * multi-institution ERP backend.
 */

const DATABASE_CONFIG = {
  development: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "ism_smart_erp",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    ssl: false,
  },

  production: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === "true",
  },

  test: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_TEST_NAME || "ism_smart_erp_test",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    ssl: false,
  },
};

const getEnvironment = () => {
  return process.env.NODE_ENV || "development";
};

const getDatabaseConfig = () => {
  const environment = getEnvironment();

  const config =
    DATABASE_CONFIG[environment] || DATABASE_CONFIG.development;

  return {
    ...config,
    environment,
  };
};

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
      `Missing database environment variables: ${missingValues.join(", ")}`
    );
  }

  return true;
};

module.exports = {
  DATABASE_CONFIG,
  getEnvironment,
  getDatabaseConfig,
  validateDatabaseConfig,
};
