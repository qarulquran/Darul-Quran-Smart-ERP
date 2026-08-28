/**
 * ISM Smart ERP
 * Permission Authorization Middleware
 *
 * Role-Based Access Control (RBAC)
 *
 * Verifies that the authenticated institute member
 * has the required permission through an active role.
 *
 * Required middleware order:
 * 1. authenticate
 * 2. authorizeInstitute
 * 3. authorizePermission(...)
 */

const { query } = require("../database/db");

// --------------------------------------------------
// Permission Code Validation
// --------------------------------------------------

const normalizePermissionCodes = (permissions) => {
  const permissionCodes = permissions
    .flat()
    .filter(
      (permission) =>
        typeof permission === "string"
    )
    .map((permission) => permission.trim())
    .filter(Boolean);

  return [...new Set(permissionCodes)];
};

// --------------------------------------------------
// Permission Authorization Factory
// --------------------------------------------------

const authorizePermission = (...permissions) => {
  const requiredPermissions =
    normalizePermissionCodes(permissions);

  if (requiredPermissions.length === 0) {
    throw new Error(
      "At least one permission is required"
    );
  }

  return async (req, res, next) => {
    try {
      // Authentication must run first.
      if (!req.auth || !req.auth.userId) {
        const error = new Error(
          "Authentication required"
        );

        error.statusCode = 401;
        error.code = "AUTHENTICATION_REQUIRED";

        return next(error);
      }

      // Institute authorization must run first.
      if (
        !req.institute ||
        !req.institute.id ||
        !req.institute.membershipId
      ) {
        const error = new Error(
          "Institute authorization required"
        );

        error.statusCode = 403;
        error.code =
          "INSTITUTE_AUTHORIZATION_REQUIRED";

        return next(error);
      }

      const instituteId = req.institute.id;
      const membershipId =
        req.institute.membershipId;

      // --------------------------------------------------
      // Find Granted Permissions
      // --------------------------------------------------

      const result = await query(
        `
          SELECT DISTINCT
            p.code AS permission_code

          FROM institute_user_roles iur

          INNER JOIN roles r
            ON r.id = iur.role_id

          INNER JOIN role_permissions rp
            ON rp.role_id = r.id

          INNER JOIN permissions p
            ON p.id = rp.permission_id

          WHERE iur.institute_user_id = $1
            AND r.institute_id = $2
            AND p.code = ANY($3::text[]);
        `,
        [
          membershipId,
          instituteId,
          requiredPermissions,
        ]
      );

      const grantedPermissions = new Set(
        result.rows.map(
          (row) => row.permission_code
        )
      );

      // --------------------------------------------------
      // Require All Requested Permissions
      // --------------------------------------------------

      const missingPermissions =
        requiredPermissions.filter(
          (permission) =>
            !grantedPermissions.has(permission)
        );

      if (missingPermissions.length > 0) {
        const error = new Error(
          "You do not have permission to perform this action"
        );

        error.statusCode = 403;
        error.code = "PERMISSION_DENIED";

        return next(error);
      }

      // --------------------------------------------------
      // Attach Permission Context
      // --------------------------------------------------

      req.permissions = {
        required: requiredPermissions,
        granted: Array.from(
          grantedPermissions
        ),
      };

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  authorizePermission,
};
