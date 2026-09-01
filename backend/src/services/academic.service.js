/**
 * ISM Smart ERP
 * Academic Service
 *
 * Handles academic structure operations:
 * - Classes
 * - Class sections
 * - Class curriculum / subjects / kitab
 * - Hifz stages
 */

const {
  query,
} = require("../database/db");

// --------------------------------------------------
// Academic Error Helper
// --------------------------------------------------

const createAcademicError = (
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
// Verify Class
// --------------------------------------------------

const verifyAcademicClass = async (
  instituteId,
  classId
) => {
  const result = await query(
    `
      SELECT
        id,
        institute_id,
        class_code,
        name,
        status
      FROM classes
      WHERE institute_id = $1
        AND id = $2
      LIMIT 1;
    `,
    [
      instituteId,
      classId,
    ]
  );

  const academicClass =
    result.rows[0];

  if (!academicClass) {
    throw createAcademicError(
      "Class not found in this institute",
      404,
      "ACADEMIC_CLASS_NOT_FOUND"
    );
  }

  if (
    academicClass.status !== "active"
  ) {
    throw createAcademicError(
      "Selected class is not active",
      400,
      "ACADEMIC_CLASS_NOT_ACTIVE"
    );
  }

  return academicClass;
};

// --------------------------------------------------
// Get Classes
// --------------------------------------------------

const getClasses = async (
  instituteId
) => {
  const result = await query(
    `
      SELECT
        c.*
      FROM classes c
      WHERE c.institute_id = $1
        AND c.status = 'active'
      ORDER BY
        c.sort_order ASC,
        c.id ASC;
    `,
    [instituteId]
  );

  return result.rows;
};

// --------------------------------------------------
// Get Class Sections
// --------------------------------------------------

const getClassSections = async (
  instituteId,
  classId
) => {
  await verifyAcademicClass(
    instituteId,
    classId
  );

  const result = await query(
    `
      SELECT
        sec.*
      FROM sections sec
      WHERE sec.institute_id = $1
        AND sec.class_id = $2
        AND sec.status = 'active'
      ORDER BY
        sec.sort_order ASC,
        sec.name ASC,
        sec.id ASC;
    `,
    [
      instituteId,
      classId,
    ]
  );

  return result.rows;
};

// --------------------------------------------------
// Create Class Section
// --------------------------------------------------

const createClassSection = async ({
  instituteId,
  classId,
  data,
}) => {
  await verifyAcademicClass(
    instituteId,
    classId
  );

  const {
    sectionCode,
    name,
    nameBn,
    nameEn,
    nameAr,
    description,
    capacity,
    sortOrder,
    status,
    settings,
  } = data;

  try {
    const result = await query(
      `
        INSERT INTO sections (
          institute_id,
          class_id,
          section_code,

          name,
          name_bn,
          name_en,
          name_ar,

          description,
          capacity,
          sort_order,
          status,
          settings
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
          $12::jsonb
        )
        RETURNING *;
      `,
      [
        instituteId,
        classId,
        sectionCode,
        name,
        nameBn || null,
        nameEn || name,
        nameAr || null,
        description || null,
        capacity ?? null,
        sortOrder ?? 0,
        status || "active",
        JSON.stringify(
          settings || {}
        ),
      ]
    );

    return result.rows[0];
  } catch (error) {
    if (
      error.code === "23505"
    ) {
      throw createAcademicError(
        "Section code already exists for this class",
        409,
        "SECTION_CODE_ALREADY_EXISTS"
      );
    }

    if (
      error.code === "23514"
    ) {
      throw createAcademicError(
        "Invalid section configuration",
        400,
        "INVALID_SECTION_CONFIGURATION"
      );
    }

    throw error;
  }
};

// --------------------------------------------------
// Get Class Curriculum
// --------------------------------------------------

const getClassCurriculum = async (
  instituteId,
  classId
) => {
  const result = await query(
    `
      SELECT
        cc.id,
        cc.institute_id,
        cc.class_id,
        cc.subject_id,
        cc.is_required,
        cc.is_optional,
        cc.sort_order,
        cc.status,
        cc.metadata,
        cc.created_at,
        cc.updated_at,

        s.subject_code,
        s.subject_type,
        s.name_bn,
        s.name_en,
        s.name_ar,
        s.description_bn,
        s.description_en,
        s.description_ar

      FROM class_curriculum cc

      INNER JOIN academic_subjects s
        ON s.institute_id = cc.institute_id
       AND s.id = cc.subject_id

      WHERE cc.institute_id = $1
        AND cc.class_id = $2
        AND cc.status = 'active'
        AND s.status = 'active'

      ORDER BY
        cc.sort_order ASC,
        s.name_en ASC;
    `,
    [
      instituteId,
      classId,
    ]
  );

  return result.rows;
};

// --------------------------------------------------
// Get Hifz Stages
// --------------------------------------------------

const getHifzStages = async (
  instituteId
) => {
  const result = await query(
    `
      SELECT
        ads.*
      FROM academic_department_stages ads

      INNER JOIN academic_departments ad
        ON ad.institute_id = ads.institute_id
       AND ad.id =
         ads.academic_department_id

      WHERE ads.institute_id = $1
        AND ad.department_code = 'HIFZ'
        AND ads.status = 'active'
        AND ad.status = 'active'

      ORDER BY
        ads.sort_order ASC,
        ads.id ASC;
    `,
    [instituteId]
  );

  return result.rows;
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  getClasses,
  getClassSections,
  createClassSection,
  getClassCurriculum,
  getHifzStages,
  verifyAcademicClass,
};
