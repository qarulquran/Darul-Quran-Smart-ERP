-- ============================================================
-- ISM Smart ERP
-- Migration: 024_create_academic_years_table.sql
--
-- Purpose:
-- Create institute-specific academic year records.
--
-- This table provides a central academic calendar foundation
-- for admissions, classes, fees, exams, attendance,
-- enrollments, and reporting.
-- ============================================================

CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Academic Year Identity
    year_code VARCHAR(50) NOT NULL,

    name VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150),
    name_ar VARCHAR(150),

    -- Academic Period
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    -- Current Academic Year
    is_current BOOLEAN NOT NULL DEFAULT FALSE,

    -- Admission Configuration
    admission_open BOOLEAN NOT NULL DEFAULT FALSE,

    -- Result / Academic Lock
    results_locked BOOLEAN NOT NULL DEFAULT FALSE,

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

    CONSTRAINT fk_academic_years_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT academic_years_date_check
        CHECK (
            end_date >= start_date
        ),

    CONSTRAINT academic_years_status_check
        CHECK (
            status IN (
                'draft',
                'active',
                'completed',
                'archived'
            )
        ),

    -- Academic year code must be unique
    -- inside each institute.
    CONSTRAINT uq_academic_years_institute_code
        UNIQUE (
            institute_id,
            year_code
        )
);

-- ============================================================
-- Only One Current Academic Year Per Institute
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_academic_years_current_institute
    ON academic_years(institute_id)
    WHERE is_current = TRUE;

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_academic_years_institute
    ON academic_years(institute_id);

CREATE INDEX IF NOT EXISTS idx_academic_years_status
    ON academic_years(status);

CREATE INDEX IF NOT EXISTS idx_academic_years_start_date
    ON academic_years(start_date);

CREATE INDEX IF NOT EXISTS idx_academic_years_end_date
    ON academic_years(end_date);

CREATE INDEX IF NOT EXISTS idx_academic_years_institute_status
    ON academic_years(
        institute_id,
        status
    );

CREATE INDEX IF NOT EXISTS idx_academic_years_admission_open
    ON academic_years(
        institute_id,
        admission_open
    );

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE academic_years IS
'Institute-specific academic years in ISM Smart ERP.';

COMMENT ON COLUMN academic_years.institute_id IS
'Institute/tenant that owns the academic year.';

COMMENT ON COLUMN academic_years.year_code IS
'Institute-specific academic year code such as 2026 or 2026-2027.';

COMMENT ON COLUMN academic_years.name IS
'Primary academic year display name.';

COMMENT ON COLUMN academic_years.name_bn IS
'Academic year name in Bangla.';

COMMENT ON COLUMN academic_years.name_ar IS
'Academic year name in Arabic.';

COMMENT ON COLUMN academic_years.start_date IS
'Starting date of the academic year.';

COMMENT ON COLUMN academic_years.end_date IS
'Ending date of the academic year.';

COMMENT ON COLUMN academic_years.is_current IS
'Indicates the current active academic year for the institute.';

COMMENT ON COLUMN academic_years.admission_open IS
'Indicates whether admissions are currently open for this academic year.';

COMMENT ON COLUMN academic_years.results_locked IS
'Prevents normal result editing after results are finalized.';

COMMENT ON COLUMN academic_years.settings IS
'Flexible academic-year configuration for future features.';
