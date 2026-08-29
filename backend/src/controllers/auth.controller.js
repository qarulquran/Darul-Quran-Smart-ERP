/**
 * ISM Smart ERP
 * Authentication Controller
 *
 * Handles authentication HTTP requests
 * and delegates business logic to auth.service.
 */

const {
  login,
} = require("../services/auth.service");

// --------------------------------------------------
// Login Controller
// --------------------------------------------------

const loginController = async (
  req,
  res,
  next
) => {
  try {
    const {
      identifier,
      password,
    } = req.body || {};

    const result = await login({
      identifier,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",

      data: {
        accessToken: result.accessToken,
        tokenType: result.tokenType,
        user: result.user,
      },

      requestId: req.requestId,
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Current Authentication Status
// --------------------------------------------------

const authStatusController = (
  req,
  res
) => {
  return res.status(200).json({
    success: true,
    message: "Authentication is valid",

    data: {
      authenticated: true,

      user: {
        id: req.auth.userId,
      },

      token: {
        issuedAt: req.auth.issuedAt,
        expiresAt: req.auth.expiresAt,
      },
    },

    requestId: req.requestId,
  });
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  loginController,
  authStatusController,
};
