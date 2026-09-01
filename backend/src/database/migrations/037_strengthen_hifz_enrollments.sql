-- ============================================================
-- ISM Smart ERP
-- Migration 037
-- Strengthen Hifz Student Enrollments
-- ============================================================

-- A student may have historical completed/cancelled enrollments,
-- but only one open enrollment in the same department.

CREATE UNIQUE INDEX IF NOT EXISTS
uq_student_department_open_enrollment
ON student_department_enrollments (
    institute_id,
    student_id,
    academic_department_id
)
WHERE enrollment_status IN (
    'active',
    'paused'
);

CREATE INDEX IF NOT EXISTS
idx_student_department_enrollment_department
ON student_department_enrollments (
    institute_id,
    academic_department_id,
    enrollment_status
);
