/**
 * ISM Smart ERP
 * JWT Token Utility
 *
 * Handles:
 * - JWT access token creation
 * - JWT access token verification
 * - Safe token decoding
 * - Centralized JWT configuration
 */

const jwt = require("jsonwebtoken");

const {
  env,
} = require("../config/env");

// --------------------------------------------------
// JWT Constants
// --------------------------------------------------

const JWT_ALGORITHM = "HS256";
const JWT_ISSUER = "ism-smart-erp";
const JWT_AUDIENCE = "ism-smart-erp-api";

// --------------------------------------------------
// JWT Secret
// --------------------------------------------------

const getJwtSecret = () => {
  const secret =
    typeof env.JWT_SECRET === "string"
      ? env.JWT_SECRET.trim()
      : "";

  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is required"
    );
  }

  if (
    env.NODE_ENV === "production" &&
    secret.length < 32
  ) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters in production"
    );
  }

  return secret;
};

// --------------------------------------------------
// Access Token Expiry
// --------------------------------------------------

const getAccessTokenExpiry = () => {
  return env.JWT_EXPIRES_IN || "1h";
};

// --------------------------------------------------
// Validate Token Payload
// --------------------------------------------------

const validateTokenPayload = (payload) => {
  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    throw new Error(
      "Token payload must be an object"
    );
  }

  if (
    typeof payload.userId !== "string" ||
    !payload.userId.trim()
  ) {
    throw new Error(
      "Token payload must contain a valid userId"
    );
  }

  return true;
};

// --------------------------------------------------
// Generate Access Token
// --------------------------------------------------

const generateAccessToken = (payload) => {
  validateTokenPayload(payload);

  return jwt.sign(
    payload,
    getJwtSecret(),
    {
      expiresIn:
        getAccessTokenExpiry(),

      algorithm:
        JWT_ALGORITHM,

      issuer:
        JWT_ISSUER,

      audience:
        JWT_AUDIENCE,
    }
  );
};

// --------------------------------------------------
// Verify Access Token
// --------------------------------------------------

const verifyAccessToken = (token) => {
  if (
    typeof token !== "string" ||
    !token.trim()
  ) {
    throw new Error(
      "Access token is required"
    );
  }

  return jwt.verify(
    token.trim(),
    getJwtSecret(),
    {
      algorithms: [
        JWT_ALGORITHM,
      ],

      issuer:
        JWT_ISSUER,

      audience:
        JWT_AUDIENCE,
    }
  );
};

// --------------------------------------------------
// Decode Access Token
// --------------------------------------------------

const decodeAccessToken = (token) => {
  if (
    typeof token !== "string" ||
    !token.trim()
  ) {
    return null;
  }

  try {
    return jwt.decode(
      token.trim()
    );
  } catch (error) {
    return null;
  }
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  decodeAccessToken,
  validateTokenPayload,
};
