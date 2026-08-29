/**
 * ISM Smart ERP
 * Authentication Middleware
 *
 * Verifies JWT access tokens and attaches
 * authenticated user information to the request.
 */

const {
  verifyAccessToken,
} = require("../utils/token");

// --------------------------------------------------
// Extract Bearer Token
// --------------------------------------------------

const getBearerToken = (req) => {
  const authorization =
    req.get("Authorization");

  if (!authorization) {
    return null;
  }

  const parts =
    authorization.trim().split(/\s+/);

  if (
    parts.length !== 2 ||
    parts[0].toLowerCase() !== "bearer" ||
    !parts[1]
  ) {
    return null;
  }

  return parts[1];
};

// --------------------------------------------------
// Authentication Middleware
// --------------------------------------------------

const authenticate = (
  req,
  res,
  next
) => {
  try {
    const token =
      getBearerToken(req);

    if (!token) {
      const error = new Error(
        "Authentication required"
      );

      error.statusCode = 401;
      error.code =
        "AUTHENTICATION_REQUIRED";

      return next(error);
    }

    const payload =
      verifyAccessToken(token);

    if (!payload.userId) {
      const error = new Error(
        "Invalid access token"
      );

      error.statusCode = 401;
      error.code =
        "INVALID_ACCESS_TOKEN";

      return next(error);
    }

    req.auth = {
      userId: payload.userId,
      tokenId: payload.jti || null,
      issuedAt: payload.iat || null,
      expiresAt: payload.exp || null,
    };

    return next();
  } catch (error) {
    const authError = new Error(
      "Invalid or expired access token"
    );

    authError.statusCode = 401;
    authError.code =
      "INVALID_ACCESS_TOKEN";

    return next(authError);
  }
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  authenticate,
  getBearerToken,
};
