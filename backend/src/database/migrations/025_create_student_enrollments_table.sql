-- ============================================================
-- ISM Smart ERP
-- Migration: 025_create_student_enrollments_table.sql
--
-- Purpose:
-- Store student class/section enrollment history
-- for each academic year.
--
-- This allows the system to preserve historical academic
-- placement instead of relying only on students.class_id.
-- ============================================================

-- ============================================================
-- Supporting Composite Unique Constraint
-- ============================================================

-- Required for tenant-safe Academic Year relationship.
ALTER TABLE academic_years
    ADD CONSTRAINT uq_academic_years_id_institute
    UNIQUE (id, institute_id);

-- students, classes, and sections already have the required
-- tenant-aware UNIQUE (id, institute_id) constraints.

-- ============================================================
-- Student Enrollments Table
-- ============================================================

CREATE TABLE IF NOT EXISTS student_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Student
    student_id UUID NOT NULL,

    -- Academic Year
    academic_year_id UUID NOT NULL,

    -- Academic Placement
    class_id UUID NOT NULL,
    section_id UUID,

    -- Student Position / Identity in Class
    roll_number VARCHAR(50),

    -- Enrollment Information
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Optional Completion / Exit Date
    end_date DATE,

    -- Enrollment Status
    status VARCHAR(30) NOT NULL DEFAULT 'active',

    -- Optional Promotion Information
    promotion_status VARCHAR(30) NOT NULL DEFAULT 'pending',

    -- Institute member who created the enrollment
    enrolled_by UUID,

    -- Optional Notes
    remarks TEXT,

    -- Additional Flexible Information
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_student_enrollments_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_student_enrollments_student
        FOREIGN KEY (student_id, institute_id)
        REFERENCES students(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_enrollments_academic_year
        FOREIGN KEY (academic_year_id, institute_id)
        REFERENCES academic_years(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_enrollments_class
        FOREIGN KEY (class_id, institute_id)
        REFERENCES classes(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_enrollments_section
        FOREIGN KEY (section_id, institute_id)
        REFERENCES sections(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_enrollments_enrolled_by
        FOREIGN KEY (enrolled_by, institute_id)
        REFERENCES institute_users(id, institute_id)
        ON DELETE RESTRICT,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT student_enrollments_date_check
        CHECK (
            end_date IS NULL
            OR end_date >= enrollment_date
        ),

    CONSTRAINT student_enrollments_status_check
        CHECK (
            status IN (
                'active',
                'completed',
                'promoted',
                'transferred',
                'withdrawn',
                'suspended',
                'cancelled',
                'archived'
            )
        ),

    CONSTRAINT student_enrollments_promotion_status_check
        CHECK (
            promotion_status IN (
                'pending',
                'promoted',
                'repeated',
                'completed',
                'not_applicable'
            )
        ),

    -- A student can have only one primary enrollment
    -- for the same academic year.
    CONSTRAINT uq_student_enrollments_student_year
        UNIQUE (
            institute_id,
            student_id,
            academic_year_id
        )
);

-- ============================================================
-- Roll Number Uniqueness
-- ============================================================

-- A non-null roll number cannot be assigned twice
-- within the same institute, academic year, class and section.
CREATE UNIQUE INDEX IF NOT EXISTS
    uq_student_enrollments_class_section_roll
ON student_enrollments (
    institute_id,
    academic_year_id,
    class_id,
    COALESCE(section_id, '00000000-0000-0000-0000-000000000000'::uuid),
    roll_number
)
WHERE roll_number IS NOT NULL;

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_student_enrollments_institute
    ON student_enrollments(institute_id);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_student
    ON student_enrollments(student_id);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_academic_year
    ON student_enrollments(academic_year_id);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_class
    ON student_enrollments(class_id);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_section
    ON student_enrollments(section_id);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_status
    ON student_enrollments(status);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_institute_year
    ON student_enrollments(
        institute_id,
        academic_year_id
    );

CREATE INDEX IF NOT EXISTS idx_student_enrollments_institute_class
    ON student_enrollments(
        institute_id,
        academic_year_id,
        class_id
    );

CREATE INDEX IF NOT EXISTS idx_student_enrollments_student_history
    ON student_enrollments(
        institute_id,
        student_id,
        academic_year_id
    );

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE student_enrollments IS
'Academic-year-based student class and section enrollment history in ISM Smart ERP.';

COMMENT ON COLUMN student_enrollments.institute_id IS
'Institute/tenant that owns the enrollment record.';

COMMENT ON COLUMN student_enrollments.student_id IS
'Student associated with the enrollment.';

COMMENT ON COLUMN student_enrollments.academic_year_id IS
'Academic year associated with the enrollment.';

COMMENT ON COLUMN student_enrollments.class_id IS
'Class in which the student is enrolled for the academic year.';

COMMENT ON COLUMN student_enrollments.section_id IS
'Optional section in which the student is enrolled.';

COMMENT ON COLUMN student_enrollments.roll_number IS
'Student roll number for the class and section during the academic year.';

COMMENT ON COLUMN student_enrollments.enrollment_date IS
'Date on which the enrollment became effective.';

COMMENT ON COLUMN student_enrollments.status IS
'Current status of this historical enrollment record.';

COMMENT ON COLUMN student_enrollments.promotion_status IS
'Promotion outcome for the student at the end of the academic year.';

COMMENT ON COLUMN student_enrollments.enrolled_by IS
'Institute membership that created the enrollment record.';

COMMENT ON COLUMN student_enrollments.metadata IS
'Flexible additional enrollment information.';
