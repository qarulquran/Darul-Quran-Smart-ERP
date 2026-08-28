/**
 * ISM Smart ERP
 * Institute Context Middleware
 *
 * Reads the institute/tenant identifier from the request.
 *
 * IMPORTANT:
 * This middleware does NOT authorize access by itself.
 * Authentication and membership verification will later
 * confirm whether the logged-in user is allowed to access
 * the selected institute.
 */

const INSTITUTE_HEADER = "X-Institute-ID";

const instituteContext = (req, res, next) => {
  const instituteId = req.get(INSTITUTE_HEADER);

  /**
   * Public routes may not require an institute.
   * Protected tenant routes will enforce this later.
   */
  if (!instituteId) {
    req.institute = null;
    return next();
  }

  const normalizedInstituteId = instituteId.trim();

  /**
   * Reject empty institute identifiers.
   */
  if (!normalizedInstituteId) {
    const error = new Error("Invalid institute identifier");

    error.statusCode = 400;
    error.code = "INVALID_INSTITUTE_ID";

    return next(error);
  }

  /**
   * Prevent excessively large identifiers.
   *
   * UUID, numeric ID, slug, and similar identifier
   * formats remain supported at this stage.
   */
  if (normalizedInstituteId.length > 100) {
    const error = new Error("Institute identifier is too long");

    error.statusCode = 400;
    error.code = "INVALID_INSTITUTE_ID";

    return next(error);
  }

  /**
   * Store the selected institute in request context.
   *
   * This is NOT proof that the user has access.
   * Membership authorization will be performed later.
   */
  req.institute = {
    id: normalizedInstituteId,
  };

  next();
};

module.exports = {
  instituteContext,
  INSTITUTE_HEADER,
};
