/**
 * ISM Smart ERP
 * Institute Onboarding Validation Middleware
 *
 * Validates new institute registration requests.
 */

const {
  z,
} = require("zod");

// --------------------------------------------------
// Validation Schema
// --------------------------------------------------

const instituteOnboardingSchema = z
  .object({
    instituteName: z
      .string()
      .trim()
      .min(
        2,
        "Institute name must be at least 2 characters"
      )
      .max(
        255,
        "Institute name is too long"
      ),

    ownerName: z
      .string()
      .trim()
      .min(
        2,
        "Owner name must be at least 2 characters"
      )
      .max(
        255,
        "Owner name is too long"
      ),

    email: z
      .string()
      .trim()
      .email(
        "Invalid email address"
      )
      .max(
        255,
        "Email address is too long"
      )
      .optional()
      .or(z.literal("")),

    phone: z
      .string()
      .trim()
      .min(
        5,
        "Phone number is too short"
      )
      .max(
        50,
        "Phone number is too long"
      )
      .optional()
      .or(z.literal("")),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      )
      .max(
        128,
        "Password is too long"
      ),

    preferredLanguage: z
      .enum([
        "bn",
        "en",
        "ar",
      ])
      .optional()
      .default("bn"),
  })
  .strict()
  .superRefine(
    (
      data,
      ctx
    ) => {
      const hasEmail =
        typeof data.email === "string" &&
        data.email.trim() !== "";

      const hasPhone =
        typeof data.phone === "string" &&
        data.phone.trim() !== "";

      if (
        !hasEmail &&
        !hasPhone
      ) {
        ctx.addIssue({
          code: "custom",
          path: [
            "email",
          ],
          message:
            "Email or phone is required",
        });
      }
    }
  );

// --------------------------------------------------
// Validation Middleware
// --------------------------------------------------

const validateInstituteOnboarding = (
  req,
  res,
  next
) => {
  const result =
    instituteOnboardingSchema.safeParse(
      req.body || {}
    );

  if (!result.success) {
    const error = new Error(
      "Invalid institute registration request"
    );

    error.statusCode = 400;
    error.code =
      "INVALID_INSTITUTE_ONBOARDING_REQUEST";

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
  validateInstituteOnboarding,
  instituteOnboardingSchema,
};
