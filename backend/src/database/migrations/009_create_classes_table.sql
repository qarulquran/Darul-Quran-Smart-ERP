-- ============================================================
-- ISM Smart ERP
-- Migration: 009_create_classes_table.sql
--
-- Purpose:
-- Create institute-specific academic classes.
--
-- Each class belongs to exactly one institute.
-- ============================================================

CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Class Identity
    class_code VARCHAR(100) NOT NULL,

    -- Multilingual Class Names
    name VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150),
    name_ar VARCHAR(150),

    -- Optional Description
    description TEXT,

    -- Academic Information
    academic_year VARCHAR(20) NOT NULL,

    -- Display / Sorting
    sort_order INTEGER NOT NULL DEFAULT 0,

    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'active',

    -- Additional Settings
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_classes_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT classes_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        ),

    CONSTRAINT classes_sort_order_check
        CHECK (
            sort_order >= 0
        ),

    -- Same class code cannot be duplicated
    -- within the same institute and academic year.
    CONSTRAINT uq_classes_institute_year_code
        UNIQUE (
            institute_id,
            academic_year,
            class_code
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_classes_institute_id
    ON classes(institute_id);

CREATE INDEX IF NOT EXISTS idx_classes_academic_year
    ON classes(academic_year);

CREATE INDEX IF NOT EXISTS idx_classes_institute_year
    ON classes(institute_id, academic_year);

CREATE INDEX IF NOT EXISTS idx_classes_institute_status
    ON classes(institute_id, status);

CREATE INDEX IF NOT EXISTS idx_classes_sort_order
    ON classes(institute_id, sort_order);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE classes IS
'Academic classes belonging to individual institutes in ISM Smart ERP.';

COMMENT ON COLUMN classes.institute_id IS
'Institute/tenant that owns the class.';

COMMENT ON COLUMN classes.class_code IS
'Institute-specific machine-readable class code.';

COMMENT ON COLUMN classes.name IS
'Primary class name.';

COMMENT ON COLUMN classes.name_bn IS
'Class name in Bangla.';

COMMENT ON COLUMN classes.name_ar IS
'Class name in Arabic.';

COMMENT ON COLUMN classes.academic_year IS
'Academic year in which this class record is used.';

COMMENT ON COLUMN classes.sort_order IS
'Controls the display order of classes.';

COMMENT ON COLUMN classes.settings IS
'Additional institute-specific class configuration.';
