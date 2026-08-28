/**
 * ISM Smart ERP
 * JWT Token Utility
 *
 * Handles creation and verification of
 * authentication access tokens.
 */

const jwt = require("jsonwebtoken");

// --------------------------------------------------
// JWT Configuration
// --------------------------------------------------

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is required"
    );
  }

  if (
    process.env.NODE_ENV === "production" &&
    secret.length < 32
  ) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters in production"
    );
  }

  return secret;
};

const getAccessTokenExpiry = () => {
  return process.env.JWT_EXPIRES_IN || "1h";
};

// --------------------------------------------------
// Generate Access Token
// --------------------------------------------------

const generateAccessToken = (payload) => {
  if (!payload || typeof payload !== "object") {
    throw new Error(
      "Token payload must be an object"
    );
  }

  if (!payload.userId) {
    throw new Error(
      "Token payload must contain userId"
    );
  }

  return jwt.sign(
    payload,
    getJwtSecret(),
    {
      expiresIn: getAccessTokenExpiry(),
      algorithm: "HS256",
      issuer: "ism-smart-erp",
      audience: "ism-smart-erp-api",
    }
  );
};

// --------------------------------------------------
// Verify Access Token
// --------------------------------------------------

const verifyAccessToken = (token) => {
  if (!token || typeof token !== "string") {
    throw new Error(
      "Access token is required"
    );
  }

  return jwt.verify(
    token,
    getJwtSecret(),
    {
      algorithms: ["HS256"],
      issuer: "ism-smart-erp",
      audience: "ism-smart-erp-api",
    }
  );
};

// --------------------------------------------------
// Decode Token
// --------------------------------------------------

const decodeAccessToken = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }

  return jwt.decode(token);
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  decodeAccessToken,
};
