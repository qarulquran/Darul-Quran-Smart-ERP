-- ============================================================
-- ISM Smart ERP
-- Migration: 010_create_sections_table.sql
--
-- Purpose:
-- Create institute-specific sections under academic classes.
--
-- Example:
-- Class: Hifz
-- Sections: A, B, Morning, Evening
-- ============================================================

CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Parent Class
    class_id UUID NOT NULL,

    -- Section Identity
    section_code VARCHAR(100) NOT NULL,

    -- Multilingual Section Names
    name VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150),
    name_ar VARCHAR(150),

    -- Optional Description
    description TEXT,

    -- Capacity
    capacity INTEGER,

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

    CONSTRAINT fk_sections_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_sections_class
        FOREIGN KEY (class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT sections_capacity_check
        CHECK (
            capacity IS NULL
            OR capacity >= 0
        ),

    CONSTRAINT sections_sort_order_check
        CHECK (
            sort_order >= 0
        ),

    CONSTRAINT sections_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        ),

    -- Section code must be unique within
    -- the same institute and class.
    CONSTRAINT uq_sections_institute_class_code
        UNIQUE (
            institute_id,
            class_id,
            section_code
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_sections_institute_id
    ON sections(institute_id);

CREATE INDEX IF NOT EXISTS idx_sections_class_id
    ON sections(class_id);

CREATE INDEX IF NOT EXISTS idx_sections_institute_class
    ON sections(institute_id, class_id);

CREATE INDEX IF NOT EXISTS idx_sections_institute_status
    ON sections(institute_id, status);

CREATE INDEX IF NOT EXISTS idx_sections_sort_order
    ON sections(institute_id, class_id, sort_order);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE sections IS
'Academic sections belonging to classes and institutes in ISM Smart ERP.';

COMMENT ON COLUMN sections.institute_id IS
'Institute/tenant that owns the section.';

COMMENT ON COLUMN sections.class_id IS
'Academic class to which this section belongs.';

COMMENT ON COLUMN sections.section_code IS
'Institute and class-specific section code.';

COMMENT ON COLUMN sections.name IS
'Primary section name.';

COMMENT ON COLUMN sections.name_bn IS
'Section name in Bangla.';

COMMENT ON COLUMN sections.name_ar IS
'Section name in Arabic.';

COMMENT ON COLUMN sections.capacity IS
'Optional maximum student capacity of the section.';

COMMENT ON COLUMN sections.settings IS
'Additional configurable section settings.';
