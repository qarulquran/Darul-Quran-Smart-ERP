/**
 * ISM Smart ERP
 * Hifz Service
 *
 * Independent Hifz pathway:
 * - Nazera
 * - Hifz
 * - Hifz Revision
 */

const {
  query,
} = require(
  "../database/db"
);

// --------------------------------------------------
// Error Helper
// --------------------------------------------------

const createHifzError = (
  message,
  statusCode,
  code
) => {
  const error =
    new Error(message);

  error.statusCode =
    statusCode;

  error.code =
    code;

  return error;
};

// --------------------------------------------------
// Get Hifz Department
// --------------------------------------------------

const getHifzDepartment = async (
  instituteId
) => {
  const result =
    await query(
      `
        SELECT
          id,
          institute_id,
          department_code,
          name_bn,
          name_en,
          name_ar,
          status

        FROM academic_departments

        WHERE institute_id = $1
          AND department_code = 'HIFZ'

        LIMIT 1;
      `,
      [
        instituteId,
      ]
    );

  const department =
    result.rows[0];

  if (!department) {
    throw createHifzError(
      "Hifz department not found",
      404,
      "HIFZ_DEPARTMENT_NOT_FOUND"
    );
  }

  if (
    department.status !==
    "active"
  ) {
    throw createHifzError(
      "Hifz department is not active",
      400,
      "HIFZ_DEPARTMENT_NOT_ACTIVE"
    );
  }

  return department;
};

// --------------------------------------------------
// Get Student
// --------------------------------------------------

const getHifzStudent = async (
  instituteId,
  studentId
) => {
  const result =
    await query(
      `
        SELECT
          id,
          institute_id,
          student_code,
          full_name,
          class_id,
          section_id,
          status

        FROM students

        WHERE institute_id = $1
          AND id = $2

        LIMIT 1;
      `,
      [
        instituteId,
        studentId,
      ]
    );

  const student =
    result.rows[0];

  if (!student) {
    throw createHifzError(
      "Student not found",
      404,
      "HIFZ_STUDENT_NOT_FOUND"
    );
  }

  if (
    student.status !==
    "active"
  ) {
    throw createHifzError(
      "Student is not active",
      400,
      "HIFZ_STUDENT_NOT_ACTIVE"
    );
  }

  return student;
};

// --------------------------------------------------
// Get Stage By Code
// --------------------------------------------------

const getHifzStageByCode =
  async (
    instituteId,
    departmentId,
    stageCode
  ) => {
    const result =
      await query(
        `
          SELECT
            id,
            institute_id,
            academic_department_id,
            stage_code,
            name_bn,
            name_en,
            name_ar,
            sort_order,
            status

          FROM academic_department_stages

          WHERE institute_id = $1
            AND academic_department_id = $2
            AND stage_code = $3

          LIMIT 1;
        `,
        [
          instituteId,
          departmentId,
          stageCode,
        ]
      );

    const stage =
      result.rows[0];

    if (!stage) {
      throw createHifzError(
        "Hifz stage not found",
        404,
        "HIFZ_STAGE_NOT_FOUND"
      );
    }

    if (
      stage.status !==
      "active"
    ) {
      throw createHifzError(
        "Hifz stage is not active",
        400,
        "HIFZ_STAGE_NOT_ACTIVE"
      );
    }

    return stage;
  };

// --------------------------------------------------
// Get Enrollment By ID
// --------------------------------------------------

const getHifzEnrollmentById =
  async ({
    instituteId,
    enrollmentId,
  }) => {
    const result =
      await query(
        `
          SELECT
            e.id,
            e.institute_id,
            e.student_id,
            e.academic_department_id,
            e.stage_id,
            e.previous_class_id,

            e.enrollment_date,
            e.completion_date,
            e.enrollment_status,
            e.metadata,

            e.created_at,
            e.updated_at,

            s.student_code,
            s.full_name AS student_name,

            d.department_code,
            d.name_bn AS department_name_bn,
            d.name_en AS department_name_en,
            d.name_ar AS department_name_ar,

            st.stage_code,
            st.name_bn AS stage_name_bn,
            st.name_en AS stage_name_en,
            st.name_ar AS stage_name_ar,

            c.class_code
              AS previous_class_code,

            c.name
              AS previous_class_name,

            c.name_bn
              AS previous_class_name_bn,

            c.name_ar
              AS previous_class_name_ar

          FROM student_department_enrollments e

          INNER JOIN students s
            ON s.institute_id =
               e.institute_id
           AND s.id =
               e.student_id

          INNER JOIN academic_departments d
            ON d.institute_id =
               e.institute_id
           AND d.id =
               e.academic_department_id

          INNER JOIN academic_department_stages st
            ON st.institute_id =
               e.institute_id
           AND st.id =
               e.stage_id

          LEFT JOIN classes c
            ON c.institute_id =
               e.institute_id
           AND c.id =
               e.previous_class_id

          WHERE e.institute_id = $1
            AND e.id = $2

          LIMIT 1;
        `,
        [
          instituteId,
          enrollmentId,
        ]
      );

    const enrollment =
      result.rows[0];

    if (!enrollment) {
      throw createHifzError(
        "Hifz enrollment not found",
        404,
        "HIFZ_ENROLLMENT_NOT_FOUND"
      );
    }

    return enrollment;
  };

// --------------------------------------------------
// Create Enrollment
// --------------------------------------------------

const createHifzEnrollment =
  async ({
    instituteId,
    data,
  }) => {
    const {
      studentId,
      stageCode,
      enrollmentDate,
      metadata,
    } = data;

    const department =
      await getHifzDepartment(
        instituteId
      );

    const student =
      await getHifzStudent(
        instituteId,
        studentId
      );

    const stage =
      await getHifzStageByCode(
        instituteId,
        department.id,
        stageCode
      );

    const existingResult =
      await query(
        `
          SELECT id

          FROM student_department_enrollments

          WHERE institute_id = $1
            AND student_id = $2
            AND academic_department_id = $3
            AND enrollment_status
                IN ('active', 'paused')

          LIMIT 1;
        `,
        [
          instituteId,
          student.id,
          department.id,
        ]
      );

    if (
      existingResult.rows.length >
      0
    ) {
      throw createHifzError(
        "Student already has an active or paused Hifz enrollment",
        409,
        "HIFZ_ENROLLMENT_ALREADY_EXISTS"
      );
    }

    try {
      const result =
        await query(
          `
            INSERT INTO student_department_enrollments (
              institute_id,
              student_id,
              academic_department_id,
              stage_id,
              previous_class_id,
              enrollment_date,
              enrollment_status,
              metadata
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              COALESCE(
                $6::date,
                CURRENT_DATE
              ),
              'active',
              $7::jsonb
            )

            RETURNING id;
          `,
          [
            instituteId,
            student.id,
            department.id,
            stage.id,
            student.class_id ||
              null,
            enrollmentDate ||
              null,
            JSON.stringify(
              metadata || {}
            ),
          ]
        );

      return getHifzEnrollmentById({
        instituteId,
        enrollmentId:
          result.rows[0].id,
      });
    } catch (error) {
      if (
        error.code ===
        "23505"
      ) {
        throw createHifzError(
          "Student already has an open Hifz enrollment",
          409,
          "HIFZ_ENROLLMENT_ALREADY_EXISTS"
        );
      }

      throw error;
    }
  };

// --------------------------------------------------
// Update Hifz Stage
// --------------------------------------------------

const updateHifzEnrollmentStage =
  async ({
    instituteId,
    enrollmentId,
    stageCode,
  }) => {
    const current =
      await getHifzEnrollmentById({
        instituteId,
        enrollmentId,
      });

    if (
      current.enrollment_status !==
      "active"
    ) {
      throw createHifzError(
        "Only active Hifz enrollment can progress to another stage",
        400,
        "HIFZ_ENROLLMENT_NOT_ACTIVE"
      );
    }

    const allowedTransitions = {
      NAZERA: "HIFZ",
      HIFZ: "HIFZ_REVISION",
    };

    const expectedNextStage =
      allowedTransitions[
        current.stage_code
      ];

    if (!expectedNextStage) {
      throw createHifzError(
        "This enrollment is already at the final Hifz stage",
        400,
        "HIFZ_FINAL_STAGE_REACHED"
      );
    }

    if (
      stageCode !==
      expectedNextStage
    ) {
      throw createHifzError(
        `Next Hifz stage must be ${expectedNextStage}`,
        400,
        "INVALID_HIFZ_STAGE_TRANSITION"
      );
    }

    const stage =
      await getHifzStageByCode(
        instituteId,
        current.academic_department_id,
        stageCode
      );

    await query(
      `
        UPDATE student_department_enrollments

        SET
          stage_id = $3,
          updated_at =
            CURRENT_TIMESTAMP

        WHERE institute_id = $1
          AND id = $2;
      `,
      [
        instituteId,
        enrollmentId,
        stage.id,
      ]
    );

    return getHifzEnrollmentById({
      instituteId,
      enrollmentId,
    });
  };

// --------------------------------------------------
// Student Enrollment History
// --------------------------------------------------

const getStudentHifzEnrollments =
  async ({
    instituteId,
    studentId,
  }) => {
    await getHifzStudent(
      instituteId,
      studentId
    );

    const department =
      await getHifzDepartment(
        instituteId
      );

    const result =
      await query(
        `
          SELECT
            e.id,
            e.institute_id,
            e.student_id,
            e.academic_department_id,
            e.stage_id,
            e.previous_class_id,

            e.enrollment_date,
            e.completion_date,
            e.enrollment_status,
            e.metadata,

            e.created_at,
            e.updated_at,

            st.stage_code,
            st.name_bn
              AS stage_name_bn,
            st.name_en
              AS stage_name_en,
            st.name_ar
              AS stage_name_ar,

            c.class_code
              AS previous_class_code,

            c.name
              AS previous_class_name

          FROM student_department_enrollments e

          INNER JOIN academic_department_stages st
            ON st.institute_id =
               e.institute_id
           AND st.id =
               e.stage_id

          LEFT JOIN classes c
            ON c.institute_id =
               e.institute_id
           AND c.id =
               e.previous_class_id

          WHERE e.institute_id = $1
            AND e.student_id = $2
            AND e.academic_department_id = $3

          ORDER BY
            e.created_at DESC,
            e.id DESC;
        `,
        [
          instituteId,
          studentId,
          department.id,
        ]
      );

    return result.rows;
  };

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  getHifzDepartment,
  getHifzStudent,
  getHifzStageByCode,
  getHifzEnrollmentById,

  createHifzEnrollment,
  updateHifzEnrollmentStage,
  getStudentHifzEnrollments,
};
