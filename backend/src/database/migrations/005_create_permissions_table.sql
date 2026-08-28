-- ============================================================
-- ISM Smart ERP
-- Migration: 005_create_permissions_table.sql
--
-- Purpose:
-- Create the master permissions table for RBAC.
--
-- Permissions are global system capabilities.
-- Roles will receive permissions through role_permissions.
--
-- Examples:
-- students.view
-- students.create
-- students.update
-- students.delete
-- fees.collect
-- reports.view
-- ============================================================

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Permission Identity
    code VARCHAR(150) NOT NULL UNIQUE,

    -- Display Names
    name VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150),
    name_ar VARCHAR(150),

    -- Group / Module
    module VARCHAR(100) NOT NULL,

    -- Description
    description TEXT,

    -- System Management
    is_system_permission BOOLEAN NOT NULL DEFAULT TRUE,

    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'active',

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT permissions_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_permissions_module
    ON permissions(module);

CREATE INDEX IF NOT EXISTS idx_permissions_status
    ON permissions(status);

CREATE INDEX IF NOT EXISTS idx_permissions_module_status
    ON permissions(module, status);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE permissions IS
'Global master permissions used by the ISM Smart ERP RBAC system.';

COMMENT ON COLUMN permissions.code IS
'Unique machine-readable permission code such as students.view.';

COMMENT ON COLUMN permissions.name IS
'Primary permission display name.';

COMMENT ON COLUMN permissions.name_bn IS
'Permission name in Bangla.';

COMMENT ON COLUMN permissions.name_ar IS
'Permission name in Arabic.';

COMMENT ON COLUMN permissions.module IS
'ERP module that owns the permission, such as students, fees, attendance, or exams.';

COMMENT ON COLUMN permissions.is_system_permission IS
'Indicates whether the permission is defined and managed by the ERP system.';

COMMENT ON COLUMN permissions.status IS
'Current permission status.';
