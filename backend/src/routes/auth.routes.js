/**
 * ISM Smart ERP
 * Authentication Routes
 *
 * Base path:
 * /api/v1/auth
 */

const express = require("express");

const {
  loginController,
  authStatusController,
} = require("../controllers/auth.controller");

const {
  authenticate,
} = require("../middleware/authenticate");

const {
  loginRateLimit,
} = require("../middleware/login-rate-limit");

const {
  validateLogin,
} = require("../middleware/validate-login");

const router = express.Router();

// --------------------------------------------------
// Public Authentication Routes
// --------------------------------------------------

/**
 * POST /api/v1/auth/login
 *
 * Body:
 * {
 *   "identifier": "email-or-phone",
 *   "password": "user-password"
 * }
 *
 * Security flow:
 * 1. Rate limit login attempts
 * 2. Validate request input
 * 3. Authenticate credentials
 */
router.post(
  "/login",
  loginRateLimit,
  validateLogin,
  loginController
);

// --------------------------------------------------
// Protected Authentication Routes
// --------------------------------------------------

/**
 * GET /api/v1/auth/status
 *
 * Header:
 * Authorization: Bearer <access-token>
 */
router.get(
  "/status",
  authenticate,
  authStatusController
);

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = router;
