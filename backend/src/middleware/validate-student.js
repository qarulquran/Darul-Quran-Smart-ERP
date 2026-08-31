/**
 * ISM Smart ERP
 * Student Request Validation
 *
 * Validates student create and update input.
 *
 * Security:
 * - institute_id is never accepted from the client
 * - tenant ownership comes from authorized institute context
 * - unknown request fields are rejected
 */

const {
  z,
} = require("zod");

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const optionalText = (maxLength) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .or(z.literal(""));

const optionalUuid = z
  .string()
  .trim()
  .uuid("Invalid UUID")
  .optional()
  .or(z.literal(""));

const optionalDate = z
  .string()
  .trim()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Date must use YYYY-MM-DD format"
  )
  .optional()
  .or(z.literal(""));

const optionalEmail = (
  message
) =>
  z
    .string()
    .trim()
    .email(message)
    .max(
      255,
      "Email address is too long"
    )
    .optional()
    .or(z.literal(""));

// --------------------------------------------------
// Student Fields
// --------------------------------------------------

const studentFields = {
  studentCode: z
    .string()
    .trim()
    .min(
      1,
      "Student code is required"
    )
    .max(
      100,
      "Student code is too long"
    ),

  fullName: z
    .string()
    .trim()
    .min(
      2,
      "Student name must be at least 2 characters"
    )
    .max(
      255,
      "Student name is too long"
    ),

  fullNameBn:
    optionalText(255),

  fullNameAr:
    optionalText(255),

  fatherName:
    optionalText(255),

  fatherNameBn:
    optionalText(255),

  fatherNameAr:
    optionalText(255),

  motherName:
    optionalText(255),

  motherNameBn:
    optionalText(255),

  motherNameAr:
    optionalText(255),

  dateOfBirth:
    optionalDate,

  gender: z
    .enum([
      "male",
      "female",
      "other",
    ])
    .optional()
    .or(z.literal("")),

  bloodGroup:
    optionalText(10),

  phone:
    optionalText(50),

  email:
    optionalEmail(
      "Invalid email address"
    ),

  presentAddress:
    optionalText(5000),

  permanentAddress:
    optionalText(5000),

  guardianName:
    optionalText(255),

  guardianRelation:
    optionalText(100),

  guardianPhone:
    optionalText(50),

  guardianEmail:
    optionalEmail(
      "Invalid guardian email address"
    ),

  guardianAddress:
    optionalText(5000),

  admissionDate:
    optionalDate,

  previousInstitute:
    optionalText(255),

  classId:
    optionalUuid,

  sectionId:
    optionalUuid,

  photoUrl:
    optionalText(5000),

  preferredLanguage: z
    .enum([
      "bn",
      "en",
      "ar",
    ])
    .optional(),

  status: z
    .enum([
      "active",
      "inactive",
      "graduated",
      "transferred",
      "suspended",
      "archived",
    ])
    .optional(),

  metadata: z
    .record(
      z.string(),
      z.unknown()
    )
    .optional(),
};

// --------------------------------------------------
// Create Student Schema
// --------------------------------------------------

const createStudentSchema = z
  .object({
    ...studentFields,

    studentCode:
      studentFields.studentCode,

    fullName:
      studentFields.fullName,

    preferredLanguage:
      studentFields
        .preferredLanguage
        .default("bn"),

    status:
      studentFields
        .status
        .default("active"),

    metadata:
      studentFields
        .metadata
        .default({}),
  })
  .strict();

// --------------------------------------------------
// Update Student Schema
// --------------------------------------------------

const updateStudentSchema = z
  .object({
    ...studentFields,

    studentCode:
      studentFields
        .studentCode
        .optional(),

    fullName:
      studentFields
        .fullName
        .optional(),
  })
  .strict()
  .refine(
    (data) =>
      Object.keys(data).length > 0,
    {
      message:
        "At least one student field is required",
    }
  );

// --------------------------------------------------
// Validation Error Helper
// --------------------------------------------------

const handleValidationResult = (
  result,
  req,
  next
) => {
  if (!result.success) {
    const error = new Error(
      "Invalid student request"
    );

    error.statusCode = 400;
    error.code =
      "INVALID_STUDENT_REQUEST";

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
// Validate Create Student
// --------------------------------------------------

const validateCreateStudent = (
  req,
  res,
  next
) => {
  const result =
    createStudentSchema.safeParse(
      req.body || {}
    );

  return handleValidationResult(
    result,
    req,
    next
  );
};

// --------------------------------------------------
// Validate Update Student
// --------------------------------------------------

const validateUpdateStudent = (
  req,
  res,
  next
) => {
  const result =
    updateStudentSchema.safeParse(
      req.body || {}
    );

  return handleValidationResult(
    result,
    req,
    next
  );
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  validateCreateStudent,
  validateUpdateStudent,
  createStudentSchema,
  updateStudentSchema,
};
