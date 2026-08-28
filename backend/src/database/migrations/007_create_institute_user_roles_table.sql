-- ============================================================
-- ISM Smart ERP
-- Migration: 007_create_institute_user_roles_table.sql
--
-- Purpose:
-- Assign institute-specific roles to institute memberships.
--
-- Relationship:
-- User
--   -> Institute Membership
--       -> Role
--           -> Permissions
-- ============================================================

CREATE TABLE IF NOT EXISTS institute_user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Membership and Role
    institute_user_id UUID NOT NULL,
    role_id UUID NOT NULL,

    -- Audit Information
    assigned_by UUID,

    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'active',

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_institute_user_roles_membership
        FOREIGN KEY (institute_user_id)
        REFERENCES institute_users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_institute_user_roles_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_institute_user_roles_assigned_by
        FOREIGN KEY (assigned_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT institute_user_roles_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'revoked'
            )
        ),

    -- Prevent duplicate role assignment
    CONSTRAINT uq_institute_user_roles
        UNIQUE (institute_user_id, role_id)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_institute_user_roles_membership
    ON institute_user_roles(institute_user_id);

CREATE INDEX IF NOT EXISTS idx_institute_user_roles_role
    ON institute_user_roles(role_id);

CREATE INDEX IF NOT EXISTS idx_institute_user_roles_status
    ON institute_user_roles(status);

CREATE INDEX IF NOT EXISTS idx_institute_user_roles_assigned_by
    ON institute_user_roles(assigned_by);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE institute_user_roles IS
'Assigns institute-specific roles to institute user memberships.';

COMMENT ON COLUMN institute_user_roles.institute_user_id IS
'Membership record receiving the role.';

COMMENT ON COLUMN institute_user_roles.role_id IS
'Institute-specific role assigned to the membership.';

COMMENT ON COLUMN institute_user_roles.assigned_by IS
'Global user who assigned the role, when available.';

COMMENT ON COLUMN institute_user_roles.status IS
'Current assignment status.';
