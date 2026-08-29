/**
 * ISM Smart ERP
 * Login Rate Limit Middleware
 *
 * Protects the login endpoint from repeated
 * password guessing and brute-force attempts.
 */

const rateLimit = require(
  "express-rate-limit"
);

// --------------------------------------------------
// Login Rate Limiter
// --------------------------------------------------

const loginRateLimit = rateLimit({
  windowMs:
    15 * 60 * 1000,

  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  skipSuccessfulRequests: true,

  message: {
    success: false,
    message:
      "Too many login attempts. Please try again later.",
    code: "LOGIN_RATE_LIMIT_EXCEEDED",
  },

  handler: (
    req,
    res,
    next,
    options
  ) => {
    return res
      .status(options.statusCode)
      .json({
        ...options.message,
        requestId:
          req.requestId || null,
      });
  },
});

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  loginRateLimit,
};
