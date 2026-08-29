/**
 * ISM Smart ERP
 * Institute Onboarding Routes
 *
 * Base path:
 * /api/v1/onboarding
 */

const express = require("express");

const {
  validateInstituteOnboarding,
} = require(
  "../middleware/validate-institute-onboarding"
);

const {
  createInstituteController,
} = require(
  "../controllers/institute-onboarding.controller"
);

const router = express.Router();

// --------------------------------------------------
// Public Institute Registration
// --------------------------------------------------

/**
 * POST /api/v1/onboarding/institute
 *
 * Creates:
 * - Institute
 * - First owner/admin user
 * - Institute membership
 * - Admin role assignment
 */
router.post(
  "/institute",
  validateInstituteOnboarding,
  createInstituteController
);

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = router;
