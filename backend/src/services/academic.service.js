/**
 * ISM Smart ERP
 * Academic Service
 *
 * Handles academic structure operations:
 * - Classes
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
      SELECT *
      FROM classes
      WHERE institute_id = $1
      ORDER BY id ASC;
    `,
    [instituteId]
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
      SELECT *
      FROM class_curriculum
      WHERE institute_id = $1
        AND class_id = $2
      ORDER BY id ASC;
    `,
    [instituteId, classId]
  );

  return result.rows;
};

// --------------------------------------------------
// Get Hifz Stages
// --------------------------------------------------

const getHifzStages = async (instituteId) => {
  const result = await query(
    `
      SELECT *
      FROM hifz_stages
      WHERE institute_id = $1
      ORDER BY id ASC;
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
  getClassCurriculum,
  getHifzStages,
};
