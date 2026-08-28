-- ============================================================
-- ISM Smart ERP
-- Migration: 017_create_fee_types_table.sql
--
-- Purpose:
-- Create institute-specific fee types/categories.
--
-- Examples:
-- Admission Fee
-- Monthly Tuition Fee
-- Examination Fee
-- Transport Fee
-- Hostel Fee
-- Library Fee
-- ============================================================

CREATE TABLE IF NOT EXISTS fee_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Fee Identity
    fee_code VARCHAR(100) NOT NULL,

    -- Multilingual Fee Names
    name VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150),
    name_ar VARCHAR(150),

    -- Optional Description
    description TEXT,

    -- Fee Configuration
    default_amount NUMERIC(12, 2),

    -- How often this fee normally applies
    frequency VARCHAR(30) NOT NULL DEFAULT 'one_time',

    -- Whether the fee is mandatory
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,

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

    CONSTRAINT fk_fee_types_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT fee_types_default_amount_check
        CHECK (
            default_amount IS NULL
            OR default_amount >= 0
        ),

    CONSTRAINT fee_types_frequency_check
        CHECK (
            frequency IN (
                'one_time',
                'monthly',
                'quarterly',
                'half_yearly',
                'yearly',
                'custom'
            )
        ),

    CONSTRAINT fee_types_sort_order_check
        CHECK (
            sort_order >= 0
        ),

    CONSTRAINT fee_types_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        ),

    -- Fee code must be unique inside an institute.
    CONSTRAINT uq_fee_types_institute_code
        UNIQUE (
            institute_id,
            fee_code
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_fee_types_institute
    ON fee_types(institute_id);

CREATE INDEX IF NOT EXISTS idx_fee_types_status
    ON fee_types(status);

CREATE INDEX IF NOT EXISTS idx_fee_types_frequency
    ON fee_types(frequency);

CREATE INDEX IF NOT EXISTS idx_fee_types_institute_status
    ON fee_types(
        institute_id,
        status
    );

CREATE INDEX IF NOT EXISTS idx_fee_types_institute_frequency
    ON fee_types(
        institute_id,
        frequency
    );

CREATE INDEX IF NOT EXISTS idx_fee_types_institute_sort_order
    ON fee_types(
        institute_id,
        sort_order
    );

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE fee_types IS
'Institute-specific fee types and fee categories in ISM Smart ERP.';

COMMENT ON COLUMN fee_types.institute_id IS
'Institute/tenant that owns the fee type.';

COMMENT ON COLUMN fee_types.fee_code IS
'Institute-specific unique code for the fee type.';

COMMENT ON COLUMN fee_types.name IS
'Primary fee type name.';

COMMENT ON COLUMN fee_types.name_bn IS
'Fee type name in Bangla.';

COMMENT ON COLUMN fee_types.name_ar IS
'Fee type name in Arabic.';

COMMENT ON COLUMN fee_types.default_amount IS
'Default amount for this fee type. Actual assigned amount may differ per student or class.';

COMMENT ON COLUMN fee_types.frequency IS
'Normal collection frequency: one_time, monthly, quarterly, half_yearly, yearly, or custom.';

COMMENT ON COLUMN fee_types.is_mandatory IS
'Indicates whether this fee is normally mandatory.';

COMMENT ON COLUMN fee_types.settings IS
'Flexible fee configuration for future features.';
