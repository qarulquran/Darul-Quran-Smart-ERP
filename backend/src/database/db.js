/**
 * ISM Smart ERP
 * Central PostgreSQL Database Layer
 *
 * Provides:
 * - Shared PostgreSQL connection pool
 * - Centralized environment configuration
 * - Query helper
 * - Transaction helper
 * - Database health check
 * - Graceful shutdown support
 */

const { Pool } = require("pg");

const {
  env,
} = require("../config/env");

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
// PostgreSQL Pool Configuration
// --------------------------------------------------

const poolConfig = {
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

  max: env.DB_POOL_MAX,

  idleTimeoutMillis:
    env.DB_IDLE_TIMEOUT_MS,

  connectionTimeoutMillis:
    env.DB_CONNECTION_TIMEOUT_MS,
};

// --------------------------------------------------
// Shared PostgreSQL Pool
// --------------------------------------------------

const pool = new Pool(poolConfig);

// --------------------------------------------------
// Pool Events
// --------------------------------------------------

pool.on("connect", () => {
  if (env.NODE_ENV === "development") {
    console.log(
      "PostgreSQL connection established."
    );
  }
});

pool.on("error", (error) => {
  console.error(
    "Unexpected PostgreSQL pool error:"
  );

  console.error(error);
});

// --------------------------------------------------
// Query Helper
// --------------------------------------------------

const query = async (
  text,
  params = []
) => {
  const startTime = Date.now();

  try {
    const result = await pool.query(
      text,
      params
    );

    if (env.NODE_ENV === "development") {
      const duration =
        Date.now() - startTime;

      console.log(
        `Database query completed in ${duration}ms`
      );
    }

    return result;
  } catch (error) {
    console.error(
      "Database query failed:"
    );

    console.error(error.message);

    throw error;
  }
};

// --------------------------------------------------
// Transaction Helper
// --------------------------------------------------

const withTransaction = async (
  callback
) => {
  if (typeof callback !== "function") {
    throw new TypeError(
      "Transaction callback must be a function"
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result =
      await callback(client);

    await client.query("COMMIT");

    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Database rollback failed:"
      );

      console.error(
        rollbackError.message
      );
    }

    throw error;
  } finally {
    client.release();
  }
};

// --------------------------------------------------
// Database Health Check
// --------------------------------------------------

const checkDatabaseConnection =
  async () => {
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

let databaseClosed = false;

const closeDatabase = async () => {
  if (databaseClosed) {
    return;
  }

  databaseClosed = true;

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
