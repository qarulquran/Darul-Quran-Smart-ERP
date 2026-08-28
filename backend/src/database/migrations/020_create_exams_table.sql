-- ============================================================
-- ISM Smart ERP
-- Migration: 020_create_exams_table.sql
--
-- Purpose:
-- Create institute-specific examination records.
--
-- Examples:
-- Monthly Test
-- Half Yearly Examination
-- Annual Examination
-- Model Test
-- ============================================================

CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Exam Identity
    exam_code VARCHAR(100) NOT NULL,

    -- Multilingual Exam Names
    name VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150),
    name_ar VARCHAR(150),

    -- Academic Information
    academic_year VARCHAR(20) NOT NULL,

    -- Optional Class Scope
    class_id UUID,

    -- Examination Period
    start_date DATE,
    end_date DATE,

    -- Result Configuration
    total_marks NUMERIC(10, 2),

    -- Optional Description
    description TEXT,

    -- Exam Status
    status VARCHAR(30) NOT NULL DEFAULT 'draft',

    -- Result Publication
    result_published BOOLEAN NOT NULL DEFAULT FALSE,
    result_published_at TIMESTAMPTZ,

    -- Institute member who created the exam
    created_by UUID,

    -- Additional Configuration
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_exams_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_exams_class
        FOREIGN KEY (class_id, institute_id)
        REFERENCES classes(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_exams_created_by
        FOREIGN KEY (created_by, institute_id)
        REFERENCES institute_users(id, institute_id)
        ON DELETE RESTRICT,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT exams_total_marks_check
        CHECK (
            total_marks IS NULL
            OR total_marks >= 0
        ),

    CONSTRAINT exams_date_check
        CHECK (
            start_date IS NULL
            OR end_date IS NULL
            OR end_date >= start_date
        ),

    CONSTRAINT exams_status_check
        CHECK (
            status IN (
                'draft',
                'scheduled',
                'ongoing',
                'completed',
                'cancelled',
                'archived'
            )
        ),

    -- Exam code must be unique inside the same institute
    -- and academic year.
    CONSTRAINT uq_exams_institute_year_code
        UNIQUE (
            institute_id,
            academic_year,
            exam_code
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_exams_institute
    ON exams(institute_id);

CREATE INDEX IF NOT EXISTS idx_exams_class
    ON exams(class_id);

CREATE INDEX IF NOT EXISTS idx_exams_academic_year
    ON exams(academic_year);

CREATE INDEX IF NOT EXISTS idx_exams_status
    ON exams(status);

CREATE INDEX IF NOT EXISTS idx_exams_start_date
    ON exams(start_date);

CREATE INDEX IF NOT EXISTS idx_exams_created_by
    ON exams(created_by);

CREATE INDEX IF NOT EXISTS idx_exams_institute_year
    ON exams(
        institute_id,
        academic_year
    );

CREATE INDEX IF NOT EXISTS idx_exams_institute_class
    ON exams(
        institute_id,
        class_id
    );

CREATE INDEX IF NOT EXISTS idx_exams_institute_status
    ON exams(
        institute_id,
        status
    );

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE exams IS
'Institute-specific examination records in ISM Smart ERP.';

COMMENT ON COLUMN exams.institute_id IS
'Institute/tenant that owns the examination.';

COMMENT ON COLUMN exams.exam_code IS
'Institute-specific examination code.';

COMMENT ON COLUMN exams.name IS
'Primary examination name.';

COMMENT ON COLUMN exams.name_bn IS
'Examination name in Bangla.';

COMMENT ON COLUMN exams.name_ar IS
'Examination name in Arabic.';

COMMENT ON COLUMN exams.academic_year IS
'Academic year for which the examination is conducted.';

COMMENT ON COLUMN exams.class_id IS
'Optional class for which the examination is configured.';

COMMENT ON COLUMN exams.total_marks IS
'Optional overall maximum marks for the examination.';

COMMENT ON COLUMN exams.result_published IS
'Indicates whether examination results have been published.';

COMMENT ON COLUMN exams.created_by IS
'Institute membership that created the examination.';

COMMENT ON COLUMN exams.settings IS
'Flexible examination configuration for future features.';
