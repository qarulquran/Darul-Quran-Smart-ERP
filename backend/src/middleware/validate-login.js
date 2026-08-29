/**
 * ISM Smart ERP
 * Login Validation Middleware
 *
 * Validates login request input before
 * it reaches the authentication service.
 */

const {
  z,
} = require("zod");

// --------------------------------------------------
// Login Request Schema
// --------------------------------------------------

const loginSchema = z
  .object({
    identifier: z
      .string()
      .trim()
      .min(
        1,
        "Email or phone is required"
      )
      .max(
        255,
        "Email or phone is too long"
      ),

    password: z
      .string()
      .min(
        1,
        "Password is required"
      )
      .max(
        128,
        "Password is too long"
      ),
  })
  .strict();

// --------------------------------------------------
// Login Validation Middleware
// --------------------------------------------------

const validateLogin = (
  req,
  res,
  next
) => {
  const result =
    loginSchema.safeParse(
      req.body || {}
    );

  if (!result.success) {
    const error = new Error(
      "Invalid login request"
    );

    error.statusCode = 400;
    error.code =
      "INVALID_LOGIN_REQUEST";

    error.validationErrors =
      result.error.issues.map(
        (issue) => ({
          field:
            issue.path.join(".") ||
            "body",

          message:
            issue.message,
        })
      );

    return next(error);
  }

  req.body = result.data;

  return next();
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  validateLogin,
  loginSchema,
};
