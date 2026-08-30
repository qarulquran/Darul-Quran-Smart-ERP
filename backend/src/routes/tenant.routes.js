/**
 * ISM Smart ERP
 * Tenant Protected Routes
 *
 * Temporary protected endpoint for verifying:
 * 1. JWT authentication
 * 2. Institute selection
 * 3. Institute membership authorization
 */

const express = require("express");

const {
  authenticate,
} = require("../middleware/authenticate");

const {
  authorizeInstitute,
} = require("../middleware/authorize-institute");

const router = express.Router();

// --------------------------------------------------
// Authorized Tenant Context Test
// --------------------------------------------------

router.get(
  "/context",
  authenticate,
  authorizeInstitute,
  (req, res) => {
    return res.status(200).json({
      success: true,

      message:
        "Institute access authorized",

      data: {
        user: {
          id: req.auth.userId,
        },

        institute: {
          id:
            req.institute.id,

          name:
            req.institute.name,

          slug:
            req.institute.slug,

          code:
            req.institute.code,

          membershipId:
            req.institute.membershipId,

          designation:
            req.institute.designation,

          defaultLanguage:
            req.institute.defaultLanguage,

          supportedLanguages:
            req.institute.supportedLanguages,

          userPreferredLanguage:
            req.institute.userPreferredLanguage,
        },
      },

      requestId:
        req.requestId,
    });
  }
);

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = router;
