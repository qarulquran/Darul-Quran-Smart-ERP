/**
 * ISM Smart ERP
 * Central PostgreSQL Database Layer
 *
 * Provides:
 * - Shared PostgreSQL connection pool
 * - Simple query helper
 * - Transaction helper
 * - Graceful shutdown support
 */

const { Pool } = require("pg");

const {
  getDatabaseConfig,
  validateDatabaseConfig,
} = require("../config/database");

// --------------------------------------------------
// Validate Configuration
// --------------------------------------------------

validateDatabaseConfig();

const databaseConfig = getDatabaseConfig();

// --------------------------------------------------
// Shared PostgreSQL Pool
// --------------------------------------------------

const pool = new Pool({
  host: databaseConfig.host,
  port: databaseConfig.port,
  database: databaseConfig.database,
  user: databaseConfig.user,
  password: databaseConfig.password,

  ssl: databaseConfig.ssl
    ? {
        rejectUnauthorized: false,
      }
    : false,

  max: Number(process.env.DB_POOL_MAX) || 20,
  idleTimeoutMillis:
    Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000,
  connectionTimeoutMillis:
    Number(process.env.DB_CONNECTION_TIMEOUT_MS) || 10000,
});

// --------------------------------------------------
// Pool Events
// --------------------------------------------------

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:");
  console.error(error);
});

// --------------------------------------------------
// Query Helper
// --------------------------------------------------

const query = async (text, params = []) => {
  const start = Date.now();

  try {
    const result = await pool.query(text, params);

    if (process.env.NODE_ENV === "development") {
      const duration = Date.now() - start;

      console.log(
        `Database query completed in ${duration}ms`
      );
    }

    return result;
  } catch (error) {
    console.error("Database query failed:");
    console.error(error.message);

    throw error;
  }
};

// --------------------------------------------------
// Transaction Helper
// --------------------------------------------------

const withTransaction = async (callback) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");

    return result;
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

// --------------------------------------------------
// Database Health Check
// --------------------------------------------------

const checkDatabaseConnection = async () => {
  const result = await pool.query(`
    SELECT
      NOW() AS database_time,
      current_database() AS database_name;
  `);

  return result.rows[0];
};

// --------------------------------------------------
// Graceful Shutdown
// --------------------------------------------------

const closeDatabase = async () => {
  await pool.end();
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  pool,
  query,
  withTransaction,
  checkDatabaseConnection,
  closeDatabase,
};
