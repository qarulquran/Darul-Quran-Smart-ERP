/**
 * ISM Smart ERP
 * Environment Configuration
 *
 * Central place for backend environment settings.
 */

const getEnv = (key, defaultValue = "") => {
  const value = process.env[key];

  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  return value;
};

const env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),

  PORT: Number(getEnv("PORT", 5000)),

  HOST: getEnv("HOST", "0.0.0.0"),

  DATABASE_URL: getEnv("DATABASE_URL", ""),

  JWT_SECRET: getEnv("JWT_SECRET", ""),

  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d"),

  CORS_ORIGIN: getEnv("CORS_ORIGIN", "*"),
};

const isProduction = env.NODE_ENV === "production";
const isDevelopment = env.NODE_ENV === "development";

module.exports = {
  env,
  getEnv,
  isProduction,
  isDevelopment,
};
