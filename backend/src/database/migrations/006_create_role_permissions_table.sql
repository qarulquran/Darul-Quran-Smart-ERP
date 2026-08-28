-- ============================================================
-- ISM Smart ERP
-- Migration: 006_create_role_permissions_table.sql
--
-- Purpose:
-- Connect institute-specific roles with global permissions.
--
-- This table forms part of the RBAC system:
--
-- Institute
--    -> Role
--        -> Permissions
-- ============================================================

CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Role and Permission
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,

    -- Audit Information
    granted_by UUID,

    -- System Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_role_permissions_granted_by
        FOREIGN KEY (granted_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    -- ========================================================
    -- Uniqueness
    -- ========================================================

    CONSTRAINT uq_role_permissions
        UNIQUE (role_id, permission_id)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id
    ON role_permissions(role_id);

CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id
    ON role_permissions(permission_id);

CREATE INDEX IF NOT EXISTS idx_role_permissions_granted_by
    ON role_permissions(granted_by);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE role_permissions IS
'Maps institute-specific roles to global ISM Smart ERP permissions.';

COMMENT ON COLUMN role_permissions.role_id IS
'Role receiving the permission.';

COMMENT ON COLUMN role_permissions.permission_id IS
'Permission granted to the role.';

COMMENT ON COLUMN role_permissions.granted_by IS
'Global user who granted the permission, when available.';
