/**
 * ISM Smart ERP
 * Password Security Utility
 *
 * Handles:
 * - Password validation
 * - Secure password hashing
 * - Password verification
 * - Centralized bcrypt configuration
 */

const bcrypt = require("bcryptjs");

const {
  env,
} = require("../config/env");

// --------------------------------------------------
// Password Security Constants
// --------------------------------------------------

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

const MIN_SALT_ROUNDS = 10;
const MAX_SALT_ROUNDS = 15;
const DEFAULT_SALT_ROUNDS = 12;

// --------------------------------------------------
// Bcrypt Salt Rounds
// --------------------------------------------------

const getSaltRounds = () => {
  const configuredRounds = Number(
    env.BCRYPT_SALT_ROUNDS
  );

  if (
    Number.isInteger(configuredRounds) &&
    configuredRounds >= MIN_SALT_ROUNDS &&
    configuredRounds <= MAX_SALT_ROUNDS
  ) {
    return configuredRounds;
  }

  return DEFAULT_SALT_ROUNDS;
};

// --------------------------------------------------
// Password Validation
// --------------------------------------------------

const validatePassword = (password) => {
  if (typeof password !== "string") {
    throw new Error(
      "Password must be a string"
    );
  }

  if (
    password.length <
    MIN_PASSWORD_LENGTH
  ) {
    throw new Error(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    );
  }

  if (
    password.length >
    MAX_PASSWORD_LENGTH
  ) {
    throw new Error(
      `Password must not exceed ${MAX_PASSWORD_LENGTH} characters`
    );
  }

  return true;
};

// --------------------------------------------------
// Hash Password
// --------------------------------------------------

const hashPassword = async (
  password
) => {
  validatePassword(password);

  const saltRounds =
    getSaltRounds();

  return bcrypt.hash(
    password,
    saltRounds
  );
};

// --------------------------------------------------
// Verify Password
// --------------------------------------------------

const verifyPassword = async (
  password,
  passwordHash
) => {
  if (
    typeof password !== "string" ||
    typeof passwordHash !== "string" ||
    !password ||
    !passwordHash
  ) {
    return false;
  }

  try {
    return await bcrypt.compare(
      password,
      passwordHash
    );
  } catch (error) {
    return false;
  }
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  hashPassword,
  verifyPassword,
  validatePassword,
  getSaltRounds,
};
