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
 * Security:
 * - Login rate limiting
 * - Account lock protection
 * - Password verification
 */
router.post(
  "/login",
  loginRateLimit,
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
