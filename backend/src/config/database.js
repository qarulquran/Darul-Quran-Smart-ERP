/**
 * ISM Smart ERP
 * Database Migration Runner
 *
 * Runs SQL migration files in numeric filename order
 * and records successfully completed migrations.
 */

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const {
  getDatabaseConfig,
  validateDatabaseConfig,
} = require("../config/database");

// --------------------------------------------------
// Configuration
// --------------------------------------------------

validateDatabaseConfig();

const databaseConfig = getDatabaseConfig();

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
});

const migrationsDirectory = path.join(
  __dirname,
  "migrations"
);

// --------------------------------------------------
// Migration Tracking Table
// --------------------------------------------------

const ensureMigrationsTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGSERIAL PRIMARY KEY,
      migration_name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// --------------------------------------------------
// Read Migration Files
// --------------------------------------------------

const getMigrationFiles = () => {
  if (!fs.existsSync(migrationsDirectory)) {
    throw new Error(
      `Migration directory not found: ${migrationsDirectory}`
    );
  }

  return fs
    .readdirSync(migrationsDirectory)
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );
};

// --------------------------------------------------
// Read Completed Migrations
// --------------------------------------------------

const getCompletedMigrations = async (client) => {
  const result = await client.query(`
    SELECT migration_name
    FROM schema_migrations
    ORDER BY migration_name ASC;
  `);

  return new Set(
    result.rows.map((row) => row.migration_name)
  );
};

// --------------------------------------------------
// Run One Migration
// --------------------------------------------------

const runMigration = async (client, fileName) => {
  const filePath = path.join(
    migrationsDirectory,
    fileName
  );

  const sql = fs.readFileSync(filePath, "utf8");

  if (!sql.trim()) {
    throw new Error(
      `Migration file is empty: ${fileName}`
    );
  }

  console.log(`Running: ${fileName}`);

  await client.query("BEGIN");

  try {
    await client.query(sql);

    await client.query(
      `
        INSERT INTO schema_migrations (
          migration_name
        )
        VALUES ($1);
      `,
      [fileName]
    );

    await client.query("COMMIT");

    console.log(`Completed: ${fileName}`);
  } catch (error) {
    await client.query("ROLLBACK");

    throw new Error(
      `Migration failed: ${fileName}\n${error.message}`
    );
  }
};

// --------------------------------------------------
// Run All Pending Migrations
// --------------------------------------------------

const migrate = async () => {
  let client;

  try {
    console.log("==========================================");
    console.log(" ISM Smart ERP Database Migration");
    console.log("==========================================");

    client = await pool.connect();

    console.log("Database connection established.");

    await ensureMigrationsTable(client);

    const migrationFiles = getMigrationFiles();

    if (migrationFiles.length === 0) {
      console.log("No migration files found.");
      return;
    }

    const completedMigrations =
      await getCompletedMigrations(client);

    const pendingMigrations =
      migrationFiles.filter(
        (file) => !completedMigrations.has(file)
      );

    console.log(
      `Total migrations: ${migrationFiles.length}`
    );

    console.log(
      `Completed migrations: ${completedMigrations.size}`
    );

    console.log(
      `Pending migrations: ${pendingMigrations.length}`
    );

    if (pendingMigrations.length === 0) {
      console.log("Database is already up to date.");
      return;
    }

    for (const fileName of pendingMigrations) {
      await runMigration(client, fileName);
    }

    console.log("==========================================");
    console.log(" All migrations completed successfully.");
    console.log("==========================================");
  } catch (error) {
    console.error("==========================================");
    console.error(" Database migration failed");
    console.error("==========================================");
    console.error(error.message);

    process.exitCode = 1;
  } finally {
    if (client) {
      client.release();
    }

    await pool.end();
  }
};

// --------------------------------------------------
// Execute
// --------------------------------------------------

migrate();
