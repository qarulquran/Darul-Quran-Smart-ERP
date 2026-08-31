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
 * - Student lookup/update is restricted to the authorized institute
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
          *;
      `,
      [
        instituteId,
        studentCode,

        fullName,
        normalizeOptionalText(fullNameBn),
        normalizeOptionalText(fullNameAr),

        normalizeOptionalText(fatherName),
        normalizeOptionalText(fatherNameBn),
        normalizeOptionalText(fatherNameAr),

        normalizeOptionalText(motherName),
        normalizeOptionalText(motherNameBn),
        normalizeOptionalText(motherNameAr),

        dateOfBirth || null,
        gender || null,
        normalizeOptionalText(bloodGroup),

        normalizeOptionalText(phone),
        normalizeOptionalText(email),

        normalizeOptionalText(presentAddress),
        normalizeOptionalText(permanentAddress),

        normalizeOptionalText(guardianName),
        normalizeOptionalText(guardianRelation),
        normalizeOptionalText(guardianPhone),
        normalizeOptionalText(guardianEmail),
        normalizeOptionalText(guardianAddress),

        admissionDate || null,
        normalizeOptionalText(previousInstitute),

        classId || null,
        sectionId || null,

        normalizeOptionalText(photoUrl),

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
// Get Student By ID
// --------------------------------------------------

const getStudentById = async ({
  instituteId,
  studentId,
}) => {
  if (!instituteId) {
    throw createStudentError(
      "Institute is required",
      400,
      "STUDENT_INSTITUTE_REQUIRED"
    );
  }

  if (!studentId) {
    throw createStudentError(
      "Student ID is required",
      400,
      "STUDENT_ID_REQUIRED"
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
        s.father_name_bn,
        s.father_name_ar,

        s.mother_name,
        s.mother_name_bn,
        s.mother_name_ar,

        s.date_of_birth,
        s.gender,
        s.blood_group,

        s.phone,
        s.email,

        s.present_address,
        s.permanent_address,

        s.guardian_name,
        s.guardian_relation,
        s.guardian_phone,
        s.guardian_email,
        s.guardian_address,

        s.admission_date,
        s.previous_institute,

        s.class_id,
        c.class_code,
        c.name AS class_name,
        c.name_bn AS class_name_bn,
        c.name_ar AS class_name_ar,
        c.academic_year,

        s.section_id,
        sec.section_code,
        sec.name AS section_name,
        sec.name_bn AS section_name_bn,
        sec.name_ar AS section_name_ar,

        s.photo_url,
        s.preferred_language,
        s.status,
        s.metadata,

        s.created_at,
        s.updated_at

      FROM students s

      LEFT JOIN classes c
        ON c.id = s.class_id
        AND c.institute_id = s.institute_id

      LEFT JOIN sections sec
        ON sec.id = s.section_id
        AND sec.institute_id = s.institute_id
        AND sec.class_id = s.class_id

      WHERE s.id = $1
        AND s.institute_id = $2

      LIMIT 1;
    `,
    [
      studentId,
      instituteId,
    ]
  );

  const student =
    result.rows[0];

  if (!student) {
    throw createStudentError(
      "Student not found",
      404,
      "STUDENT_NOT_FOUND"
    );
  }

  return student;
};

// --------------------------------------------------
// Update Student
// --------------------------------------------------

const updateStudent = async ({
  instituteId,
  studentId,
  data,
}) => {
  const currentStudent =
    await getStudentById({
      instituteId,
      studentId,
    });

  const studentCode =
    data.studentCode !== undefined
      ? data.studentCode
      : currentStudent.student_code;

  const fullName =
    data.fullName !== undefined
      ? data.fullName
      : currentStudent.full_name;

  const classId =
    data.classId !== undefined
      ? data.classId || null
      : currentStudent.class_id;

  const sectionId =
    data.sectionId !== undefined
      ? data.sectionId || null
      : currentStudent.section_id;

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
          AND id <> $3

        LIMIT 1;
      `,
      [
        instituteId,
        studentCode,
        studentId,
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
        UPDATE students

        SET
          student_code = $3,
          full_name = $4,
          full_name_bn = $5,
          full_name_ar = $6,

          father_name = $7,
          father_name_bn = $8,
          father_name_ar = $9,

          mother_name = $10,
          mother_name_bn = $11,
          mother_name_ar = $12,

          date_of_birth = $13,
          gender = $14,
          blood_group = $15,

          phone = $16,
          email = $17,

          present_address = $18,
          permanent_address = $19,

          guardian_name = $20,
          guardian_relation = $21,
          guardian_phone = $22,
          guardian_email = $23,
          guardian_address = $24,

          admission_date = $25,
          previous_institute = $26,

          class_id = $27,
          section_id = $28,

          photo_url = $29,
          preferred_language = $30,
          status = $31,
          metadata = $32::jsonb,

          updated_at = CURRENT_TIMESTAMP

        WHERE id = $1
          AND institute_id = $2

        RETURNING *;
      `,
      [
        studentId,
        instituteId,

        studentCode,
        fullName,

        data.fullNameBn !== undefined
          ? normalizeOptionalText(data.fullNameBn)
          : currentStudent.full_name_bn,

        data.fullNameAr !== undefined
          ? normalizeOptionalText(data.fullNameAr)
          : currentStudent.full_name_ar,

        data.fatherName !== undefined
          ? normalizeOptionalText(data.fatherName)
          : currentStudent.father_name,

        data.fatherNameBn !== undefined
          ? normalizeOptionalText(data.fatherNameBn)
          : currentStudent.father_name_bn,

        data.fatherNameAr !== undefined
          ? normalizeOptionalText(data.fatherNameAr)
          : currentStudent.father_name_ar,

        data.motherName !== undefined
          ? normalizeOptionalText(data.motherName)
          : currentStudent.mother_name,

        data.motherNameBn !== undefined
          ? normalizeOptionalText(data.motherNameBn)
          : currentStudent.mother_name_bn,

        data.motherNameAr !== undefined
          ? normalizeOptionalText(data.motherNameAr)
          : currentStudent.mother_name_ar,

        data.dateOfBirth !== undefined
          ? data.dateOfBirth || null
          : currentStudent.date_of_birth,

        data.gender !== undefined
          ? data.gender || null
          : currentStudent.gender,

        data.bloodGroup !== undefined
          ? normalizeOptionalText(data.bloodGroup)
          : currentStudent.blood_group,

        data.phone !== undefined
          ? normalizeOptionalText(data.phone)
          : currentStudent.phone,

        data.email !== undefined
          ? normalizeOptionalText(data.email)
          : currentStudent.email,

        data.presentAddress !== undefined
          ? normalizeOptionalText(data.presentAddress)
          : currentStudent.present_address,

        data.permanentAddress !== undefined
          ? normalizeOptionalText(data.permanentAddress)
          : currentStudent.permanent_address,

        data.guardianName !== undefined
          ? normalizeOptionalText(data.guardianName)
          : currentStudent.guardian_name,

        data.guardianRelation !== undefined
          ? normalizeOptionalText(data.guardianRelation)
          : currentStudent.guardian_relation,

        data.guardianPhone !== undefined
          ? normalizeOptionalText(data.guardianPhone)
          : currentStudent.guardian_phone,

        data.guardianEmail !== undefined
          ? normalizeOptionalText(data.guardianEmail)
          : currentStudent.guardian_email,

        data.guardianAddress !== undefined
          ? normalizeOptionalText(data.guardianAddress)
          : currentStudent.guardian_address,

        data.admissionDate !== undefined
          ? data.admissionDate
          : currentStudent.admission_date,

        data.previousInstitute !== undefined
          ? normalizeOptionalText(data.previousInstitute)
          : currentStudent.previous_institute,

        classId,
        sectionId,

        data.photoUrl !== undefined
          ? normalizeOptionalText(data.photoUrl)
          : currentStudent.photo_url,

        data.preferredLanguage !== undefined
          ? data.preferredLanguage
          : currentStudent.preferred_language,

        data.status !== undefined
          ? data.status
          : currentStudent.status,

        JSON.stringify(
          data.metadata !== undefined
            ? data.metadata
            : currentStudent.metadata || {}
        ),
      ]
    );

    const student =
      result.rows[0];

    if (!student) {
      throw createStudentError(
        "Student not found",
        404,
        "STUDENT_NOT_FOUND"
      );
    }

    return student;
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
// Exports
// --------------------------------------------------

module.exports = {
  createStudent,
  listStudents,
  getStudentById,
  updateStudent,
  verifyClass,
  verifySection,
};
