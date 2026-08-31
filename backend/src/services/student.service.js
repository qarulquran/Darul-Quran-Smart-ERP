/**
 * ISM Smart ERP
 * Student Service
 *
 * Handles institute-scoped student operations.
 *
 * Security:
 * - Every operation is tenant scoped
 * - Class must belong to the same institute
 * - Section must belong to the same institute
 * - Section must belong to the selected class
 */

const {
  query,
} = require("../database/db");

// --------------------------------------------------
// Service Error Helper
// --------------------------------------------------

const createStudentError = (
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
// Normalize Optional Text
// --------------------------------------------------

const normalizeOptionalText = (value) => {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim();

  return normalized || null;
};

// --------------------------------------------------
// Verify Class
// --------------------------------------------------

const verifyClass = async (
  instituteId,
  classId
) => {
  if (!classId) {
    return null;
  }

  const result = await query(
    `
      SELECT
        id,
        institute_id,
        class_code,
        name,
        academic_year,
        status

      FROM classes

      WHERE id = $1
        AND institute_id = $2

      LIMIT 1;
    `,
    [
      classId,
      instituteId,
    ]
  );

  const academicClass =
    result.rows[0];

  if (!academicClass) {
    throw createStudentError(
      "Class not found in this institute",
      400,
      "INVALID_STUDENT_CLASS"
    );
  }

  if (
    academicClass.status !== "active"
  ) {
    throw createStudentError(
      "Selected class is not active",
      400,
      "STUDENT_CLASS_NOT_ACTIVE"
    );
  }

  return academicClass;
};

// --------------------------------------------------
// Verify Section
// --------------------------------------------------

const verifySection = async (
  instituteId,
  sectionId,
  classId
) => {
  if (!sectionId) {
    return null;
  }

  if (!classId) {
    throw createStudentError(
      "Class is required when a section is selected",
      400,
      "STUDENT_CLASS_REQUIRED_FOR_SECTION"
    );
  }

  const result = await query(
    `
      SELECT
        id,
        institute_id,
        class_id,
        section_code,
        name,
        status

      FROM sections

      WHERE id = $1
        AND institute_id = $2
        AND class_id = $3

      LIMIT 1;
    `,
    [
      sectionId,
      instituteId,
      classId,
    ]
  );

  const section =
    result.rows[0];

  if (!section) {
    throw createStudentError(
      "Section not found for the selected class in this institute",
      400,
      "INVALID_STUDENT_SECTION"
    );
  }

  if (
    section.status !== "active"
  ) {
    throw createStudentError(
      "Selected section is not active",
      400,
      "STUDENT_SECTION_NOT_ACTIVE"
    );
  }

  return section;
};

// --------------------------------------------------
// Create Student
// --------------------------------------------------

const createStudent = async ({
  instituteId,
  data,
}) => {
  if (!instituteId) {
    throw createStudentError(
      "Institute is required",
      400,
      "STUDENT_INSTITUTE_REQUIRED"
    );
  }

  const {
    studentCode,
    fullName,
    fullNameBn,
    fullNameAr,

    fatherName,
    fatherNameBn,
    fatherNameAr,

    motherName,
    motherNameBn,
    motherNameAr,

    dateOfBirth,
    gender,
    bloodGroup,

    phone,
    email,

    presentAddress,
    permanentAddress,

    guardianName,
    guardianRelation,
    guardianPhone,
    guardianEmail,
    guardianAddress,

    admissionDate,
    previousInstitute,

    classId,
    sectionId,

    photoUrl,
    preferredLanguage,
    status,
    metadata,
  } = data;

  await verifyClass(
    instituteId,
    classId
  );

  await verifySection(
    instituteId,
    sectionId,
    classId
  );

  const duplicateResult =
    await query(
      `
        SELECT id
        FROM students
        WHERE institute_id = $1
          AND student_code = $2
        LIMIT 1;
      `,
      [
        instituteId,
        studentCode,
      ]
    );

  if (
    duplicateResult.rows.length > 0
  ) {
    throw createStudentError(
      "Student code already exists in this institute",
      409,
      "STUDENT_CODE_ALREADY_EXISTS"
    );
  }

  try {
    const result = await query(
      `
        INSERT INTO students (
          institute_id,
          student_code,

          full_name,
          full_name_bn,
          full_name_ar,

          father_name,
          father_name_bn,
          father_name_ar,

          mother_name,
          mother_name_bn,
          mother_name_ar,

          date_of_birth,
          gender,
          blood_group,

          phone,
          email,

          present_address,
          permanent_address,

          guardian_name,
          guardian_relation,
          guardian_phone,
          guardian_email,
          guardian_address,

          admission_date,
          previous_institute,

          class_id,
          section_id,

          photo_url,
          preferred_language,
          status,
          metadata
        )

        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          $15,
          $16,
          $17,
          $18,
          $19,
          $20,
          $21,
          $22,
          $23,
          COALESCE($24::date, CURRENT_DATE),
          $25,
          $26,
          $27,
          $28,
          $29,
          $30,
          $31::jsonb
        )

        RETURNING
          id,
          institute_id,
          student_code,

          full_name,
          full_name_bn,
          full_name_ar,

          father_name,
          father_name_bn,
          father_name_ar,

          mother_name,
          mother_name_bn,
          mother_name_ar,

          date_of_birth,
          gender,
          blood_group,

          phone,
          email,

          present_address,
          permanent_address,

          guardian_name,
          guardian_relation,
          guardian_phone,
          guardian_email,
          guardian_address,

          admission_date,
          previous_institute,

          class_id,
          section_id,

          photo_url,
          preferred_language,
          status,
          metadata,

          created_at,
          updated_at;
      `,
      [
        instituteId,
        studentCode,

        fullName,
        normalizeOptionalText(
          fullNameBn
        ),
        normalizeOptionalText(
          fullNameAr
        ),

        normalizeOptionalText(
          fatherName
        ),
        normalizeOptionalText(
          fatherNameBn
        ),
        normalizeOptionalText(
          fatherNameAr
        ),

        normalizeOptionalText(
          motherName
        ),
        normalizeOptionalText(
          motherNameBn
        ),
        normalizeOptionalText(
          motherNameAr
        ),

        dateOfBirth || null,
        gender || null,
        normalizeOptionalText(
          bloodGroup
        ),

        normalizeOptionalText(
          phone
        ),
        normalizeOptionalText(
          email
        ),

        normalizeOptionalText(
          presentAddress
        ),
        normalizeOptionalText(
          permanentAddress
        ),

        normalizeOptionalText(
          guardianName
        ),
        normalizeOptionalText(
          guardianRelation
        ),
        normalizeOptionalText(
          guardianPhone
        ),
        normalizeOptionalText(
          guardianEmail
        ),
        normalizeOptionalText(
          guardianAddress
        ),

        admissionDate || null,
        normalizeOptionalText(
          previousInstitute
        ),

        classId || null,
        sectionId || null,

        normalizeOptionalText(
          photoUrl
        ),

        preferredLanguage || "bn",
        status || "active",

        JSON.stringify(
          metadata || {}
        ),
      ]
    );

    return result.rows[0];
  } catch (error) {
    if (
      error.code === "23505"
    ) {
      throw createStudentError(
        "Student code already exists in this institute",
        409,
        "STUDENT_CODE_ALREADY_EXISTS"
      );
    }

    throw error;
  }
};

// --------------------------------------------------
// List Students
// --------------------------------------------------

const listStudents = async ({
  instituteId,
}) => {
  if (!instituteId) {
    throw createStudentError(
      "Institute is required",
      400,
      "STUDENT_INSTITUTE_REQUIRED"
    );
  }

  const result = await query(
    `
      SELECT
        s.id,
        s.institute_id,
        s.student_code,

        s.full_name,
        s.full_name_bn,
        s.full_name_ar,

        s.father_name,
        s.mother_name,

        s.date_of_birth,
        s.gender,
        s.blood_group,

        s.phone,
        s.email,

        s.guardian_name,
        s.guardian_relation,
        s.guardian_phone,
        s.guardian_email,

        s.admission_date,

        s.class_id,
        c.class_code,
        c.name AS class_name,

        s.section_id,
        sec.section_code,
        sec.name AS section_name,

        s.photo_url,
        s.preferred_language,
        s.status,

        s.created_at,
        s.updated_at

      FROM students s

      LEFT JOIN classes c
        ON c.id = s.class_id
        AND c.institute_id = s.institute_id

      LEFT JOIN sections sec
        ON sec.id = s.section_id
        AND sec.institute_id = s.institute_id

      WHERE s.institute_id = $1

      ORDER BY
        s.created_at DESC,
        s.student_code ASC;
    `,
    [
      instituteId,
    ]
  );

  return result.rows;
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  createStudent,
  listStudents,
  verifyClass,
  verifySection,
};
