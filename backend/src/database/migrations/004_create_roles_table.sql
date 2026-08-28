-- ============================================================
-- ISM Smart ERP
-- Migration: 004_create_roles_table.sql
--
-- Purpose:
-- Create institute-specific roles for RBAC.
--
-- Examples:
-- Admin, Principal, Teacher, Accountant, Staff
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Role Information
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100),
    name_ar VARCHAR(100),

    code VARCHAR(100) NOT NULL,

    description TEXT,

    -- System Role Flag
    is_system_role BOOLEAN NOT NULL DEFAULT FALSE,

    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'active',

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_roles_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT roles_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        ),

    -- Each role code must be unique inside an institute.
    CONSTRAINT uq_roles_institute_code
        UNIQUE (institute_id, code)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_roles_institute_id
    ON roles(institute_id);

CREATE INDEX IF NOT EXISTS idx_roles_status
    ON roles(status);

CREATE INDEX IF NOT EXISTS idx_roles_institute_status
    ON roles(institute_id, status);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE roles IS
'Institute-specific roles used by the ISM Smart ERP RBAC system.';

COMMENT ON COLUMN roles.institute_id IS
'Institute/tenant that owns this role.';

COMMENT ON COLUMN roles.name IS
'Primary role name.';

COMMENT ON COLUMN roles.name_bn IS
'Role name in Bangla.';

COMMENT ON COLUMN roles.name_ar IS
'Role name in Arabic.';

COMMENT ON COLUMN roles.code IS
'Stable machine-readable role code, unique within an institute.';

COMMENT ON COLUMN roles.is_system_role IS
'Indicates whether the role is protected as a built-in/system role.';

COMMENT ON COLUMN roles.status IS
'Current role status.';
