/**
 * ISM Smart ERP
 * Request ID Middleware
 *
 * Assigns a unique ID to every incoming API request.
 * Useful for logging, debugging, auditing,
 * and tracking requests across the system.
 */

const crypto = require("crypto");

const requestId = (req, res, next) => {
  const incomingRequestId = req.get("X-Request-ID");

  const id =
    incomingRequestId && incomingRequestId.trim()
      ? incomingRequestId.trim()
      : crypto.randomUUID();

  req.requestId = id;

  res.setHeader("X-Request-ID", id);

  next();
};

module.exports = {
  requestId,
};
