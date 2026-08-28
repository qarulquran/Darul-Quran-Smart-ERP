/**
 * ISM Smart ERP
 * Backend Server
 *
 * Multi-Institution Islamic School / Madrasa Management System
 */

const app = require("./app");

// --------------------------------------------------
// Server Configuration
// --------------------------------------------------

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// --------------------------------------------------
// Start Server
// --------------------------------------------------

const server = app.listen(PORT, HOST, () => {
  console.log("==========================================");
  console.log(" ISM Smart ERP Backend");
  console.log("==========================================");
  console.log(`Server running on port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Started: ${new Date().toISOString()}`);
  console.log("==========================================");
});

// --------------------------------------------------
// Graceful Shutdown
// --------------------------------------------------

const shutdown = (signal) => {
  console.log(`\n${signal} received.`);
  console.log("Shutting down ISM Smart ERP server...");

  server.close(() => {
    console.log("Server closed successfully.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced server shutdown.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// --------------------------------------------------
// Unexpected Errors
// --------------------------------------------------

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:");
  console.error(error);

  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:");
  console.error(error);

  process.exit(1);
});
