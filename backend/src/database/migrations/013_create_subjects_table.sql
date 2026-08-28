-- ============================================================
-- ISM Smart ERP
-- Migration: 013_create_subjects_table.sql
--
-- Purpose:
-- Create institute-specific academic subjects.
--
-- Each subject belongs to one institute and may optionally
-- be linked to a class and a teacher.
-- ============================================================

CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Subject Identity
    subject_code VARCHAR(100) NOT NULL,

    -- Multilingual Subject Names
    name VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150),
    name_ar VARCHAR(150),

    -- Academic Information
    academic_year VARCHAR(20) NOT NULL,

    -- Optional Class Link
    class_id UUID,

    -- Optional Teacher Link
    teacher_id UUID,

    -- Optional Description
    description TEXT,

    -- Subject Type
    subject_type VARCHAR(50) NOT NULL DEFAULT 'regular',

    -- Marks / Evaluation
    full_marks NUMERIC(8, 2),
    pass_marks NUMERIC(8, 2),

    -- Display Order
    sort_order INTEGER NOT NULL DEFAULT 0,

    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'active',

    -- Additional Configuration
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_subjects_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT subjects_type_check
        CHECK (
            subject_type IN (
                'regular',
                'optional',
                'elective',
                'practical'
            )
        ),

    CONSTRAINT subjects_full_marks_check
        CHECK (
            full_marks IS NULL
            OR full_marks >= 0
        ),

    CONSTRAINT subjects_pass_marks_check
        CHECK (
            pass_marks IS NULL
            OR pass_marks >= 0
        ),

    CONSTRAINT subjects_marks_relation_check
        CHECK (
            full_marks IS NULL
            OR pass_marks IS NULL
            OR pass_marks <= full_marks
        ),

    CONSTRAINT subjects_sort_order_check
        CHECK (
            sort_order >= 0
        ),

    CONSTRAINT subjects_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        ),

    -- Subject code must be unique inside
    -- the same institute and academic year.
    CONSTRAINT uq_subjects_institute_year_code
        UNIQUE (
            institute_id,
            academic_year,
            subject_code
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_subjects_institute_id
    ON subjects(institute_id);

CREATE INDEX IF NOT EXISTS idx_subjects_class_id
    ON subjects(class_id);

CREATE INDEX IF NOT EXISTS idx_subjects_teacher_id
    ON subjects(teacher_id);

CREATE INDEX IF NOT EXISTS idx_subjects_academic_year
    ON subjects(academic_year);

CREATE INDEX IF NOT EXISTS idx_subjects_institute_year
    ON subjects(institute_id, academic_year);

CREATE INDEX IF NOT EXISTS idx_subjects_institute_status
    ON subjects(institute_id, status);

CREATE INDEX IF NOT EXISTS idx_subjects_sort_order
    ON subjects(institute_id, sort_order);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE subjects IS
'Academic subjects belonging to institutes in ISM Smart ERP.';

COMMENT ON COLUMN subjects.institute_id IS
'Institute/tenant that owns the subject.';

COMMENT ON COLUMN subjects.subject_code IS
'Institute-specific subject code.';

COMMENT ON COLUMN subjects.name IS
'Primary subject name.';

COMMENT ON COLUMN subjects.name_bn IS
'Subject name in Bangla.';

COMMENT ON COLUMN subjects.name_ar IS
'Subject name in Arabic.';

COMMENT ON COLUMN subjects.class_id IS
'Optional class associated with the subject.';

COMMENT ON COLUMN subjects.teacher_id IS
'Optional teacher currently associated with the subject.';

COMMENT ON COLUMN subjects.full_marks IS
'Maximum marks for the subject when applicable.';

COMMENT ON COLUMN subjects.pass_marks IS
'Minimum passing marks for the subject when applicable.';

COMMENT ON COLUMN subjects.settings IS
'Additional subject-specific configuration.';
