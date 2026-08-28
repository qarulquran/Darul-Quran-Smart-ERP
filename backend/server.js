require("dotenv").config();

const app = require("./app");

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log("==========================================");
  console.log("ISM Smart ERP Backend");
  console.log(`Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(`Port        : ${PORT}`);
  console.log(`API Prefix  : ${process.env.API_PREFIX || "/api/v1"}`);
  console.log("==========================================");
});

const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down safely...`);

  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:", error);

  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
