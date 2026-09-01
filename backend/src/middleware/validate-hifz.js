/**
 * ISM Smart ERP
 * Hifz Request Validation
 */

const {
  z,
} = require("zod");

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

    if (!result.success) {
      const error =
        new Error(
          "Invalid Hifz enrollment request"
        );

      error.statusCode = 400;
      error.code =
        "INVALID_HIFZ_ENROLLMENT_REQUEST";

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

module.exports = {
  validateCreateHifzEnrollment,
  createHifzEnrollmentSchema,
};
