/**
 * ISM Smart ERP
 * Institute Onboarding Controller
 *
 * Handles HTTP requests for creating
 * a new institute and its first administrator.
 */

const {
  onboardInstitute,
} = require("../services/institute-onboarding.service");

// --------------------------------------------------
// Create Institute Controller
// --------------------------------------------------

const createInstituteController = async (
  req,
  res,
  next
) => {
  try {
    const {
      instituteName,
      ownerName,
      email,
      phone,
      password,
      preferredLanguage,
    } = req.body;

    const result =
      await onboardInstitute({
        instituteName,
        ownerName,
        email,
        phone,
        password,
        preferredLanguage,
      });

    return res
      .status(201)
      .json({
        success: true,

        message:
          "Institute registration completed successfully",

        data: {
          institute:
            result.institute,

          owner:
            result.owner,

          membership:
            result.membership,

          role:
            result.role,
        },

        requestId:
          req.requestId,
      });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  createInstituteController,
};
