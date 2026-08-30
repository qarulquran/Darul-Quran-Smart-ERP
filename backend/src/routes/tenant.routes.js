/**
 * ISM Smart ERP
 * Tenant Protected Routes
 *
 * Handles:
 * - Authenticated institute discovery
 * - Tenant membership authorization
 * - RBAC permission authorization testing
 */

const express = require("express");

const {
  query,
} = require("../database/db");

const {
  authenticate,
} = require("../middleware/authenticate");

const {
  authorizeInstitute,
} = require("../middleware/authorize-institute");

const {
  authorizePermission,
} = require("../middleware/authorize-permission");

const router = express.Router();

// --------------------------------------------------
// List Institutes Available To Logged-In User
// --------------------------------------------------

router.get(
  "/institutes",
  authenticate,
  async (req, res, next) => {
    try {
      const result = await query(
        `
          SELECT
            i.id,
            i.name,
            i.slug,
            i.institute_code,
            i.status,
            i.default_language,
            i.supported_languages,

            iu.id AS membership_id,
            iu.membership_status,
            iu.designation,
            iu.preferred_language

          FROM institute_users iu

          INNER JOIN institutes i
            ON i.id = iu.institute_id

          WHERE iu.user_id = $1
            AND iu.membership_status = 'active'
            AND i.status = 'active'

          ORDER BY i.name ASC;
        `,
        [
          req.auth.userId,
        ]
      );

      return res.status(200).json({
        success: true,

        message:
          "Institutes retrieved successfully",

        data: {
          institutes:
            result.rows.map(
              (row) => ({
                id: row.id,
                name: row.name,
                slug: row.slug,
                code:
                  row.institute_code,
                status:
                  row.status,

                defaultLanguage:
                  row.default_language,

                supportedLanguages:
                  row.supported_languages,

                membership: {
                  id:
                    row.membership_id,

                  status:
                    row.membership_status,

                  designation:
                    row.designation,

                  preferredLanguage:
                    row.preferred_language,
                },
              })
            ),
        },

        requestId:
          req.requestId,
      });
    } catch (error) {
      return next(error);
    }
  }
);

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
          id:
            req.auth.userId,
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
// RBAC Permission Test
// --------------------------------------------------

router.get(
  "/permission-test",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "dashboard.view"
  ),
  (req, res) => {
    return res.status(200).json({
      success: true,

      message:
        "Permission access authorized",

      data: {
        user: {
          id:
            req.auth.userId,
        },

        institute: {
          id:
            req.institute.id,
          name:
            req.institute.name,
        },

        permissions:
          req.permissions,
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
