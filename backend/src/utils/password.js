/**
 * ISM Smart ERP
 * Password Security Utility
 *
 * Handles secure password hashing
 * and password verification using bcryptjs.
 */

const bcrypt = require("bcryptjs");

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const getSaltRounds = () => {
  const configuredRounds = Number(
    process.env.BCRYPT_SALT_ROUNDS
  );

  if (
    Number.isInteger(configuredRounds) &&
    configuredRounds >= 10 &&
    configuredRounds <= 15
  ) {
    return configuredRounds;
  }

  return 12;
};

// --------------------------------------------------
// Password Validation
// --------------------------------------------------

const validatePassword = (password) => {
  if (typeof password !== "string") {
    throw new Error("Password must be a string");
  }

  if (password.length < 8) {
    throw new Error(
      "Password must be at least 8 characters long"
    );
  }

  if (password.length > 128) {
    throw new Error(
      "Password must not exceed 128 characters"
    );
  }

  return true;
};

// --------------------------------------------------
// Hash Password
// --------------------------------------------------

const hashPassword = async (password) => {
  validatePassword(password);

  const saltRounds = getSaltRounds();

  return bcrypt.hash(password, saltRounds);
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
