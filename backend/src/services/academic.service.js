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
// Get Classes
// --------------------------------------------------

const getClasses = async (instituteId) => {
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
  const result = await query(
    `
      SELECT
        sec.*
      FROM sections sec

      INNER JOIN classes c
        ON c.institute_id = sec.institute_id
       AND c.id = sec.class_id

      WHERE sec.institute_id = $1
        AND sec.class_id = $2
        AND sec.status = 'active'
        AND c.status = 'active'

      ORDER BY
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

const getHifzStages = async (instituteId) => {
  const result = await query(
    `
      SELECT
        ads.*
      FROM academic_department_stages ads

      INNER JOIN academic_departments ad
        ON ad.institute_id = ads.institute_id
       AND ad.id = ads.academic_department_id

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
  getClassCurriculum,
  getHifzStages,
};
