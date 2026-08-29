/**
 * ISM Smart ERP
 * Authentication Service
 *
 * Handles:
 * - Email or phone login
 * - Password verification
 * - Failed login tracking
 * - Temporary account locking
 * - Successful login tracking
 * - JWT access token generation
 */

const crypto = require("crypto");

const { query } = require("../database/db");

const {
  verifyPassword,
} = require("../utils/password");

const {
  generateAccessToken,
} = require("../utils/token");

// --------------------------------------------------
// Security Configuration
// --------------------------------------------------

const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const ACCOUNT_LOCK_MINUTES = 15;

// --------------------------------------------------
// Service Error Helper
// --------------------------------------------------

const createAuthError = (
  message,
  statusCode,
  code
) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.code = code;

  return error;
};

// --------------------------------------------------
// Normalize Login Identifier
// --------------------------------------------------

const normalizeIdentifier = (identifier) => {
  if (typeof identifier !== "string") {
    return "";
  }

  return identifier.trim();
};

// --------------------------------------------------
// Find User
// --------------------------------------------------

const findUserByIdentifier = async (
  identifier
) => {
  const normalizedIdentifier =
    normalizeIdentifier(identifier);

  if (!normalizedIdentifier) {
    return null;
  }

  const result = await query(
    `
      SELECT
        id,
        full_name,
        full_name_bn,
        full_name_ar,
        email,
        phone,
        password_hash,
        preferred_language,
        photo_url,
        status,
        email_verified,
        phone_verified,
        last_login_at,
        password_changed_at,
        failed_login_attempts,
        locked_until,
        created_at,
        updated_at

      FROM users

      WHERE
        LOWER(email) = LOWER($1)
        OR phone = $1

      LIMIT 1;
    `,
    [normalizedIdentifier]
  );

  return result.rows[0] || null;
};

// --------------------------------------------------
// Record Failed Login
// --------------------------------------------------

const recordFailedLogin = async (user) => {
  const currentAttempts =
    Number(user.failed_login_attempts) || 0;

  const nextAttempts =
    currentAttempts + 1;

  if (
    nextAttempts >=
    MAX_FAILED_LOGIN_ATTEMPTS
  ) {
    await query(
      `
        UPDATE users

        SET
          failed_login_attempts = $2,
          locked_until =
            CURRENT_TIMESTAMP
            + ($3 * INTERVAL '1 minute'),
          updated_at = CURRENT_TIMESTAMP

        WHERE id = $1;
      `,
      [
        user.id,
        nextAttempts,
        ACCOUNT_LOCK_MINUTES,
      ]
    );

    return;
  }

  await query(
    `
      UPDATE users

      SET
        failed_login_attempts = $2,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $1;
    `,
    [
      user.id,
      nextAttempts,
    ]
  );
};

// --------------------------------------------------
// Record Successful Login
// --------------------------------------------------

const recordSuccessfulLogin = async (
  userId
) => {
  await query(
    `
      UPDATE users

      SET
        failed_login_attempts = 0,
        locked_until = NULL,
        last_login_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $1;
    `,
    [userId]
  );
};

// --------------------------------------------------
// Build Safe User Response
// --------------------------------------------------

const buildSafeUser = (user) => {
  return {
    id: user.id,

    fullName: user.full_name,
    fullNameBn: user.full_name_bn,
    fullNameAr: user.full_name_ar,

    email: user.email,
    phone: user.phone,

    preferredLanguage:
      user.preferred_language,

    photoUrl: user.photo_url,

    emailVerified:
      user.email_verified,

    phoneVerified:
      user.phone_verified,

    lastLoginAt:
      user.last_login_at,
  };
};

// --------------------------------------------------
// Login
// --------------------------------------------------

const login = async ({
  identifier,
  password,
}) => {
  const normalizedIdentifier =
    normalizeIdentifier(identifier);

  if (
    !normalizedIdentifier ||
    typeof password !== "string" ||
    !password
  ) {
    throw createAuthError(
      "Email or phone and password are required",
      400,
      "LOGIN_CREDENTIALS_REQUIRED"
    );
  }

  const user =
    await findUserByIdentifier(
      normalizedIdentifier
    );

  // Keep the public error generic so that attackers
  // cannot easily discover registered accounts.
  if (!user) {
    throw createAuthError(
      "Invalid email, phone, or password",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  // --------------------------------------------------
  // Global Account Status
  // --------------------------------------------------

  if (user.status !== "active") {
    throw createAuthError(
      "This account is not available for login",
      403,
      "ACCOUNT_NOT_ACTIVE"
    );
  }

  // --------------------------------------------------
  // Temporary Login Lock
  // --------------------------------------------------

  if (
    user.locked_until &&
    new Date(user.locked_until).getTime() >
      Date.now()
  ) {
    throw createAuthError(
      "Too many failed login attempts. Please try again later",
      423,
      "ACCOUNT_TEMPORARILY_LOCKED"
    );
  }

  // --------------------------------------------------
  // Verify Password
  // --------------------------------------------------

  const passwordMatches =
    await verifyPassword(
      password,
      user.password_hash
    );

  if (!passwordMatches) {
    await recordFailedLogin(user);

    throw createAuthError(
      "Invalid email, phone, or password",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  // --------------------------------------------------
  // Successful Login
  // --------------------------------------------------

  await recordSuccessfulLogin(user.id);

  const accessToken =
    generateAccessToken({
      userId: user.id,
      jti: crypto.randomUUID(),
    });

  return {
    accessToken,
    tokenType: "Bearer",

    user: {
      ...buildSafeUser(user),
      lastLoginAt: new Date().toISOString(),
    },
  };
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  login,
  findUserByIdentifier,
};
