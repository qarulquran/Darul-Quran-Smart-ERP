/**
 * ISM Smart ERP
 * Academic Service
 *
 * Handles:
 * - Classes
 * - Sections
 * - Subjects / Kitab
 * - Class curriculum
 * - Hifz stages
 */

const {
  query,
} = require("../database/db");

// --------------------------------------------------
// Error Helper
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
// Verify Subject
// --------------------------------------------------

const verifyAcademicSubject = async (
  instituteId,
  subjectId
) => {
  const result = await query(
    `
      SELECT *
      FROM academic_subjects
      WHERE institute_id = $1
        AND id = $2
      LIMIT 1;
    `,
    [
      instituteId,
      subjectId,
    ]
  );

  const subject =
    result.rows[0];

  if (!subject) {
    throw createAcademicError(
      "Academic subject not found",
      404,
      "ACADEMIC_SUBJECT_NOT_FOUND"
    );
  }

  return subject;
};

// --------------------------------------------------
// Classes
// --------------------------------------------------

const getClasses = async (
  instituteId
) => {
  const result = await query(
    `
      SELECT c.*
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
// Sections
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
      SELECT sec.*
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

    throw error;
  }
};

// --------------------------------------------------
// Subjects
// --------------------------------------------------

const getAcademicSubjects = async (
  instituteId
) => {
  const result = await query(
    `
      SELECT *
      FROM academic_subjects
      WHERE institute_id = $1
        AND status <> 'archived'
      ORDER BY
        name_en ASC,
        subject_code ASC;
    `,
    [instituteId]
  );

  return result.rows;
};

const createAcademicSubject = async ({
  instituteId,
  data,
}) => {
  const {
    subjectCode,
    subjectType,
    nameBn,
    nameEn,
    nameAr,
    descriptionBn,
    descriptionEn,
    descriptionAr,
    status,
    metadata,
  } = data;

  try {
    const result = await query(
      `
        INSERT INTO academic_subjects (
          institute_id,
          subject_code,
          subject_type,
          name_bn,
          name_en,
          name_ar,
          description_bn,
          description_en,
          description_ar,
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
          $11::jsonb
        )
        RETURNING *;
      `,
      [
        instituteId,
        subjectCode,
        subjectType,
        nameBn,
        nameEn,
        nameAr,
        descriptionBn || null,
        descriptionEn || null,
        descriptionAr || null,
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
      throw createAcademicError(
        "Subject code already exists",
        409,
        "ACADEMIC_SUBJECT_CODE_EXISTS"
      );
    }

    throw error;
  }
};

const updateAcademicSubject = async ({
  instituteId,
  subjectId,
  data,
}) => {
  const current =
    await verifyAcademicSubject(
      instituteId,
      subjectId
    );

  try {
    const result = await query(
      `
        UPDATE academic_subjects
        SET
          subject_code = $3,
          subject_type = $4,
          name_bn = $5,
          name_en = $6,
          name_ar = $7,
          description_bn = $8,
          description_en = $9,
          description_ar = $10,
          status = $11,
          metadata = $12::jsonb,
          updated_at = CURRENT_TIMESTAMP
        WHERE institute_id = $1
          AND id = $2
        RETURNING *;
      `,
      [
        instituteId,
        subjectId,

        data.subjectCode ??
          current.subject_code,

        data.subjectType ??
          current.subject_type,

        data.nameBn ??
          current.name_bn,

        data.nameEn ??
          current.name_en,

        data.nameAr ??
          current.name_ar,

        data.descriptionBn !== undefined
          ? data.descriptionBn || null
          : current.description_bn,

        data.descriptionEn !== undefined
          ? data.descriptionEn || null
          : current.description_en,

        data.descriptionAr !== undefined
          ? data.descriptionAr || null
          : current.description_ar,

        data.status ??
          current.status,

        JSON.stringify(
          data.metadata !== undefined
            ? data.metadata
            : current.metadata || {}
        ),
      ]
    );

    return result.rows[0];
  } catch (error) {
    if (
      error.code === "23505"
    ) {
      throw createAcademicError(
        "Subject code already exists",
        409,
        "ACADEMIC_SUBJECT_CODE_EXISTS"
      );
    }

    throw error;
  }
};

// --------------------------------------------------
// Curriculum
// --------------------------------------------------

const getClassCurriculum = async (
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
        ON s.institute_id =
           cc.institute_id
       AND s.id =
           cc.subject_id

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

const assignSubjectToClass = async ({
  instituteId,
  classId,
  data,
}) => {
  await verifyAcademicClass(
    instituteId,
    classId
  );

  await verifyAcademicSubject(
    instituteId,
    data.subjectId
  );

  const isOptional =
    data.isOptional === true;

  const result = await query(
    `
      INSERT INTO class_curriculum (
        institute_id,
        class_id,
        subject_id,
        is_required,
        is_optional,
        sort_order,
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
        'active',
        $7::jsonb
      )

      ON CONFLICT (
        institute_id,
        class_id,
        subject_id
      )

      DO UPDATE SET
        is_required =
          EXCLUDED.is_required,

        is_optional =
          EXCLUDED.is_optional,

        sort_order =
          EXCLUDED.sort_order,

        status =
          'active',

        metadata =
          EXCLUDED.metadata,

        updated_at =
          CURRENT_TIMESTAMP

      RETURNING *;
    `,
    [
      instituteId,
      classId,
      data.subjectId,
      !isOptional,
      isOptional,
      data.sortOrder ?? 0,
      JSON.stringify(
        data.metadata || {}
      ),
    ]
  );

  return result.rows[0];
};

const removeSubjectFromClass = async ({
  instituteId,
  classId,
  subjectId,
}) => {
  await verifyAcademicClass(
    instituteId,
    classId
  );

  const result = await query(
    `
      DELETE FROM class_curriculum
      WHERE institute_id = $1
        AND class_id = $2
        AND subject_id = $3
      RETURNING id;
    `,
    [
      instituteId,
      classId,
      subjectId,
    ]
  );

  if (
    result.rows.length === 0
  ) {
    throw createAcademicError(
      "Subject is not assigned to this class",
      404,
      "CLASS_CURRICULUM_NOT_FOUND"
    );
  }

  return true;
};

// --------------------------------------------------
// Hifz Stages
// --------------------------------------------------

const getHifzStages = async (
  instituteId
) => {
  const result = await query(
    `
      SELECT ads.*
      FROM academic_department_stages ads

      INNER JOIN academic_departments ad
        ON ad.institute_id =
           ads.institute_id
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

  getAcademicSubjects,
  createAcademicSubject,
  updateAcademicSubject,

  getClassCurriculum,
  assignSubjectToClass,
  removeSubjectFromClass,

  getHifzStages,

  verifyAcademicClass,
  verifyAcademicSubject,
};
