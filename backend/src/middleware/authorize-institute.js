/**
 * ISM Smart ERP
 * Institute Authorization Middleware
 *
 * Verifies that:
 * 1. The request is authenticated.
 * 2. An institute has been selected.
 * 3. The authenticated user belongs to that institute.
 * 4. The institute membership is active.
 *
 * This middleware is a core part of tenant isolation.
 */

const { query } = require("../database/db");

// --------------------------------------------------
// Institute Membership Authorization
// --------------------------------------------------

const authorizeInstitute = async (
  req,
  res,
  next
) => {
  try {
    // Authentication middleware must run first.
    if (!req.auth || !req.auth.userId) {
      const error = new Error(
        "Authentication required"
      );

      error.statusCode = 401;
      error.code = "AUTHENTICATION_REQUIRED";

      return next(error);
    }

    // Institute context middleware must provide
    // the selected institute.
    if (!req.institute || !req.institute.id) {
      const error = new Error(
        "Institute identifier is required"
      );

      error.statusCode = 400;
      error.code = "INSTITUTE_REQUIRED";

      return next(error);
    }

    const userId = req.auth.userId;
    const instituteId = req.institute.id;

    // --------------------------------------------------
    // Verify Institute + Membership
    // --------------------------------------------------

    const result = await query(
      `
        SELECT
          iu.id AS membership_id,
          iu.institute_id,
          iu.user_id,
          iu.status AS membership_status,
          iu.designation,
          iu.preferred_language,

          i.name AS institute_name,
          i.slug AS institute_slug,
          i.institute_code,
          i.status AS institute_status,
          i.default_language,
          i.supported_languages

        FROM institute_users iu

        INNER JOIN institutes i
          ON i.id = iu.institute_id

        WHERE iu.institute_id = $1
          AND iu.user_id = $2

        LIMIT 1;
      `,
      [
        instituteId,
        userId,
      ]
    );

    // --------------------------------------------------
    // Membership Not Found
    // --------------------------------------------------

    if (result.rows.length === 0) {
      const error = new Error(
        "You do not have access to this institute"
      );

      error.statusCode = 403;
      error.code = "INSTITUTE_ACCESS_DENIED";

      return next(error);
    }

    const membership = result.rows[0];

    // --------------------------------------------------
    // Membership Status
    // --------------------------------------------------

    if (membership.membership_status !== "active") {
      const error = new Error(
        "Institute membership is not active"
      );

      error.statusCode = 403;
      error.code = "INSTITUTE_MEMBERSHIP_INACTIVE";

      return next(error);
    }

    // --------------------------------------------------
    // Institute Status
    // --------------------------------------------------

    if (membership.institute_status !== "active") {
      const error = new Error(
        "Institute is not active"
      );

      error.statusCode = 403;
      error.code = "INSTITUTE_INACTIVE";

      return next(error);
    }

    // --------------------------------------------------
    // Attach Authorized Institute Context
    // --------------------------------------------------

    req.institute = {
      id: membership.institute_id,
      membershipId: membership.membership_id,

      name: membership.institute_name,
      slug: membership.institute_slug,
      code: membership.institute_code,

      defaultLanguage:
        membership.default_language,

      supportedLanguages:
        membership.supported_languages,

      userPreferredLanguage:
        membership.preferred_language,

      designation:
        membership.designation,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  authorizeInstitute,
};
