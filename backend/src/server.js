/**
 * ISM Smart ERP
 * Backend Server
 *
 * Multi-Institution Islamic School / Madrasa Management System
 */

const app = require("./app");
const { env } = require("./config/env");

// --------------------------------------------------
// Server Configuration
// --------------------------------------------------

const PORT = env.PORT || 5000;
const HOST = env.HOST || "0.0.0.0";

let server;

// --------------------------------------------------
// Graceful Shutdown
// --------------------------------------------------

const shutdown = (signal, exitCode = 0) => {
  console.log(`\n${signal} received.`);
  console.log("Shutting down ISM Smart ERP server...");

  if (!server) {
    process.exit(exitCode);
    return;
  }

  server.close(() => {
    console.log("Server closed successfully.");
    process.exit(exitCode);
  });

  setTimeout(() => {
    console.error("Forced server shutdown.");
    process.exit(1);
  }, 10000).unref();
};

// --------------------------------------------------
// Unexpected Errors
// --------------------------------------------------

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:");
  console.error(error);

  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:");
  console.error(error);

  shutdown("Unhandled Promise Rejection", 1);
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

server = app.listen(PORT, HOST, () => {
  console.log("==========================================");
  console.log(" ISM Smart ERP Backend");
  console.log("==========================================");
  console.log(`Server running on: http://${HOST}:${PORT}`);
  console.log(`Environment: ${env.NODE_ENV || "development"}`);
  console.log(`Started: ${new Date().toISOString()}`);
  console.log("==========================================");
});

// --------------------------------------------------
// Process Signals
// --------------------------------------------------

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});
