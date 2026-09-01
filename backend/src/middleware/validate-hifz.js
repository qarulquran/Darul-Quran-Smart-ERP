/**
 * ISM Smart ERP
 * Hifz Request Validation
 */

const {
  z,
} = require("zod");

// --------------------------------------------------
// Create Enrollment
// --------------------------------------------------

const createHifzEnrollmentSchema =
  z
    .object({
      studentId: z
        .string()
        .trim()
        .uuid("Invalid student ID"),

      stageCode: z
        .enum([
          "NAZERA",
          "HIFZ",
          "HIFZ_REVISION",
        ])
        .default("NAZERA"),

      enrollmentDate: z
        .string()
        .trim()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          "Date must use YYYY-MM-DD format"
        )
        .optional(),

      metadata: z
        .record(
          z.string(),
          z.unknown()
        )
        .optional()
        .default({}),
    })
    .strict();

// --------------------------------------------------
// Stage Progression
// --------------------------------------------------

const updateHifzStageSchema =
  z
    .object({
      stageCode: z.enum([
        "HIFZ",
        "HIFZ_REVISION",
      ]),
    })
    .strict();

// --------------------------------------------------
// Validation Helper
// --------------------------------------------------

const handleValidationResult = (
  result,
  req,
  next,
  message,
  code
) => {
  if (!result.success) {
    const error =
      new Error(message);

    error.statusCode = 400;
    error.code = code;

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

  req.body =
    result.data;

  return next();
};

// --------------------------------------------------
// Validate Create
// --------------------------------------------------

const validateCreateHifzEnrollment =
  (
    req,
    res,
    next
  ) => {
    const result =
      createHifzEnrollmentSchema
        .safeParse(
          req.body || {}
        );

    return handleValidationResult(
      result,
      req,
      next,
      "Invalid Hifz enrollment request",
      "INVALID_HIFZ_ENROLLMENT_REQUEST"
    );
  };

// --------------------------------------------------
// Validate Stage Update
// --------------------------------------------------

const validateUpdateHifzStage =
  (
    req,
    res,
    next
  ) => {
    const result =
      updateHifzStageSchema
        .safeParse(
          req.body || {}
        );

    return handleValidationResult(
      result,
      req,
      next,
      "Invalid Hifz stage update request",
      "INVALID_HIFZ_STAGE_UPDATE_REQUEST"
    );
  };

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  validateCreateHifzEnrollment,
  validateUpdateHifzStage,

  createHifzEnrollmentSchema,
  updateHifzStageSchema,
};
