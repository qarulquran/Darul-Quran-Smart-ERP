/**
 * ISM Smart ERP
 * Backend Server
 *
 * Multi-Institution Islamic School / Madrasa Management System
 */

const app = require("./app");
const { env } = require("./config/env");

const {
  checkDatabaseConnection,
  closeDatabase,
} = require("./database/db");

const PORT = env.PORT || 5000;
const HOST = env.HOST || "0.0.0.0";

let server = null;
let isShuttingDown = false;

// --------------------------------------------------
// Graceful Shutdown
// --------------------------------------------------

const shutdown = async (signal, exitCode = 0) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`\n${signal} received.`);
  console.log("Shutting down ISM Smart ERP server...");

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      console.log("HTTP server closed successfully.");
    }

    await closeDatabase();

    console.log("Database connections closed successfully.");
    console.log("Shutdown completed.");

    process.exit(exitCode);
  } catch (error) {
    console.error("Error during shutdown:");
    console.error(error);

    process.exit(1);
  }
};

// --------------------------------------------------
// Process Error Handlers
// --------------------------------------------------

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:");
  console.error(error);

  shutdown("Uncaught Exception", 1);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:");
  console.error(error);

  shutdown("Unhandled Promise Rejection", 1);
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

const startServer = async () => {
  try {
    console.log("==========================================");
    console.log(" ISM Smart ERP Backend");
    console.log("==========================================");
    console.log("Checking database connection...");

    const databaseStatus =
      await checkDatabaseConnection();

    console.log(
      `Database connected: ${databaseStatus.database_name}`
    );

    console.log(
      `Database time: ${databaseStatus.database_time}`
    );

    server = app.listen(PORT, HOST, () => {
      console.log("------------------------------------------");
      console.log(`Server running on: http://${HOST}:${PORT}`);
      console.log(
        `Environment: ${env.NODE_ENV || "development"}`
      );
      console.log(
        `Started: ${new Date().toISOString()}`
      );
      console.log("==========================================");
    });
  } catch (error) {
    console.error("==========================================");
    console.error(" Failed to start ISM Smart ERP backend");
    console.error("==========================================");
    console.error(error);

    try {
      await closeDatabase();
    } catch (closeError) {
      console.error(
        "Failed to close database connections:"
      );
      console.error(closeError);
    }

    process.exit(1);
  }
};

// --------------------------------------------------
// Shutdown Signals
// --------------------------------------------------

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

// --------------------------------------------------
// Launch
// --------------------------------------------------

startServer();
