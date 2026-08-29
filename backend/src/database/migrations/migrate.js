/**
 * ISM Smart ERP
 * Database Migration Runner
 *
 * Features:
 * - Uses the shared PostgreSQL connection pool
 * - Runs SQL migrations in filename order
 * - Tracks completed migrations
 * - Uses transactions
 * - Uses a PostgreSQL advisory lock
 * - Detects modified applied migrations
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const {
  pool,
  closeDatabase,
} = require("./db");

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const migrationsDirectory = path.join(
  __dirname,
  "migrations"
);

const MIGRATION_FILE_PATTERN =
  /^\d{3}_.+\.sql$/;

const MIGRATION_LOCK_ID = 731245901;

// --------------------------------------------------
// Migration Tracking Table
// --------------------------------------------------

const ensureMigrationsTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGSERIAL PRIMARY KEY,

      migration_name VARCHAR(255)
        NOT NULL
        UNIQUE,

      checksum VARCHAR(64),

      executed_at TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
    );
  `);

  /*
   * Compatibility:
   * If schema_migrations was created by the
   * previous runner, add checksum safely.
   */
  await client.query(`
    ALTER TABLE schema_migrations
    ADD COLUMN IF NOT EXISTS checksum VARCHAR(64);
  `);
};

// --------------------------------------------------
// Migration Files
// --------------------------------------------------

const getMigrationFiles = () => {
  if (!fs.existsSync(migrationsDirectory)) {
    throw new Error(
      `Migration directory not found: ${migrationsDirectory}`
    );
  }

  return fs
    .readdirSync(migrationsDirectory)
    .filter((fileName) =>
      MIGRATION_FILE_PATTERN.test(fileName)
    )
    .sort((a, b) =>
      a.localeCompare(
        b,
        undefined,
        {
          numeric: true,
          sensitivity: "base",
        }
      )
    );
};

// --------------------------------------------------
// Checksum
// --------------------------------------------------

const createChecksum = (content) => {
  return crypto
    .createHash("sha256")
    .update(content, "utf8")
    .digest("hex");
};

// --------------------------------------------------
// Applied Migrations
// --------------------------------------------------

const getAppliedMigrations = async (
  client
) => {
  const result = await client.query(`
    SELECT
      migration_name,
      checksum,
      executed_at

    FROM schema_migrations

    ORDER BY migration_name ASC;
  `);

  return new Map(
    result.rows.map((row) => [
      row.migration_name,
      row,
    ])
  );
};

// --------------------------------------------------
// Run One Migration
// --------------------------------------------------

const runMigration = async (
  client,
  fileName,
  sql,
  checksum
) => {
  console.log(`Running: ${fileName}`);

  await client.query("BEGIN");

  try {
    await client.query(sql);

    await client.query(
      `
        INSERT INTO schema_migrations (
          migration_name,
          checksum
        )
        VALUES ($1, $2);
      `,
      [
        fileName,
        checksum,
      ]
    );

    await client.query("COMMIT");

    console.log(`Completed: ${fileName}`);
  } catch (error) {
    await client.query("ROLLBACK");

    const migrationError = new Error(
      `Migration failed: ${fileName}\n${error.message}`
    );

    migrationError.cause = error;

    throw migrationError;
  }
};

// --------------------------------------------------
// Verify Applied Migration
// --------------------------------------------------

const verifyAppliedMigration = async (
  client,
  fileName,
  sql,
  checksum,
  appliedMigration
) => {
  /*
   * Older migration records may not have a checksum.
   * Record the current checksum once so future edits
   * can be detected.
   */
  if (!appliedMigration.checksum) {
    await client.query(
      `
        UPDATE schema_migrations
        SET checksum = $2
        WHERE migration_name = $1;
      `,
      [
        fileName,
        checksum,
      ]
    );

    console.log(
      `Checksum recorded: ${fileName}`
    );

    return;
  }

  if (
    appliedMigration.checksum !== checksum
  ) {
    throw new Error(
      [
        `Applied migration was modified: ${fileName}`,
        "Do not edit an already-applied migration.",
        "Create a new migration file instead.",
      ].join("\n")
    );
  }

  console.log(`Skipped: ${fileName}`);
};

// --------------------------------------------------
// Run All Migrations
// --------------------------------------------------

const migrate = async () => {
  let client;
  let lockAcquired = false;

  try {
    console.log(
      "=========================================="
    );
    console.log(
      " ISM Smart ERP Database Migration"
    );
    console.log(
      "=========================================="
    );

    client = await pool.connect();

    console.log(
      "Database connection established."
    );

    // Prevent two migration processes from
    // running at the same time.
    await client.query(
      "SELECT pg_advisory_lock($1);",
      [MIGRATION_LOCK_ID]
    );

    lockAcquired = true;

    console.log(
      "Migration lock acquired."
    );

    await ensureMigrationsTable(client);

    const migrationFiles =
      getMigrationFiles();

    const appliedMigrations =
      await getAppliedMigrations(client);

    console.log(
      `Migration files: ${migrationFiles.length}`
    );

    console.log(
      `Previously applied: ${appliedMigrations.size}`
    );

    let appliedCount = 0;
    let skippedCount = 0;

    for (const fileName of migrationFiles) {
      const filePath = path.join(
        migrationsDirectory,
        fileName
      );

      const sql = fs.readFileSync(
        filePath,
        "utf8"
      );

      if (!sql.trim()) {
        throw new Error(
          `Migration file is empty: ${fileName}`
        );
      }

      const checksum =
        createChecksum(sql);

      const appliedMigration =
        appliedMigrations.get(fileName);

      if (appliedMigration) {
        await verifyAppliedMigration(
          client,
          fileName,
          sql,
          checksum,
          appliedMigration
        );

        skippedCount += 1;
        continue;
      }

      await runMigration(
        client,
        fileName,
        sql,
        checksum
      );

      appliedCount += 1;
    }

    console.log(
      "=========================================="
    );

    console.log(
      " Database migrations completed successfully."
    );

    console.log(
      `Applied now: ${appliedCount}`
    );

    console.log(
      `Skipped: ${skippedCount}`
    );

    console.log(
      "=========================================="
    );
  } catch (error) {
    console.error(
      "=========================================="
    );

    console.error(
      " Database migration failed"
    );

    console.error(
      "=========================================="
    );

    console.error(error.message);

    process.exitCode = 1;
  } finally {
    if (client && lockAcquired) {
      try {
        await client.query(
          "SELECT pg_advisory_unlock($1);",
          [MIGRATION_LOCK_ID]
        );

        console.log(
          "Migration lock released."
        );
      } catch (error) {
        console.error(
          "Failed to release migration lock:"
        );

        console.error(error.message);
      }
    }

    if (client) {
      client.release();
    }

    try {
      await closeDatabase();
    } catch (error) {
      console.error(
        "Failed to close database pool:"
      );

      console.error(error.message);

      process.exitCode = 1;
    }
  }
};

// --------------------------------------------------
// Execute
// --------------------------------------------------

if (require.main === module) {
  migrate();
}

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  migrate,
};
