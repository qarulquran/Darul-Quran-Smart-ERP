-- ============================================================
-- ISM Smart ERP
-- Migration: 031_enforce_tenant_safe_role_assignments.sql
--
-- Purpose:
-- Enforce tenant-safe role assignments at database level.
--
-- A role assigned to an institute membership MUST belong
-- to the same institute as that membership.
-- ============================================================

-- ============================================================
-- Step 1: Add institute_id to role assignments
-- ============================================================

ALTER TABLE institute_user_roles
ADD COLUMN institute_id UUID;

-- ============================================================
-- Step 2: Backfill institute_id from membership
-- ============================================================

UPDATE institute_user_roles iur
SET institute_id = iu.institute_id
FROM institute_users iu
WHERE iu.id = iur.institute_user_id
  AND iur.institute_id IS NULL;

-- ============================================================
-- Step 3: Detect existing cross-tenant assignments
-- ============================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1

        FROM institute_user_roles iur

        INNER JOIN institute_users iu
            ON iu.id = iur.institute_user_id

        INNER JOIN roles r
            ON r.id = iur.role_id

        WHERE iu.institute_id <> r.institute_id
    ) THEN
        RAISE EXCEPTION
            'Cross-tenant role assignment detected in institute_user_roles. Migration stopped.';
    END IF;
END
$$;

-- ============================================================
-- Step 4: Make institute_id required
-- ============================================================

ALTER TABLE institute_user_roles
ALTER COLUMN institute_id SET NOT NULL;

-- ============================================================
-- Step 5: Create composite unique keys required
-- for tenant-safe composite foreign keys
-- ============================================================

ALTER TABLE institute_users
ADD CONSTRAINT uq_institute_users_institute_id_id
UNIQUE (institute_id, id);

ALTER TABLE roles
ADD CONSTRAINT uq_roles_institute_id_id
UNIQUE (institute_id, id);

-- ============================================================
-- Step 6: Institute foreign key
-- ============================================================

ALTER TABLE institute_user_roles
ADD CONSTRAINT fk_institute_user_roles_institute
FOREIGN KEY (institute_id)
REFERENCES institutes(id)
ON DELETE CASCADE;

-- ============================================================
-- Step 7: Tenant-safe membership foreign key
-- ============================================================

ALTER TABLE institute_user_roles
ADD CONSTRAINT fk_institute_user_roles_tenant_membership
FOREIGN KEY (
    institute_id,
    institute_user_id
)
REFERENCES institute_users (
    institute_id,
    id
)
ON DELETE CASCADE;

-- ============================================================
-- Step 8: Tenant-safe role foreign key
-- ============================================================

ALTER TABLE institute_user_roles
ADD CONSTRAINT fk_institute_user_roles_tenant_role
FOREIGN KEY (
    institute_id,
    role_id
)
REFERENCES roles (
    institute_id,
    id
)
ON DELETE CASCADE;

-- ============================================================
-- Step 9: Tenant-aware indexes
-- ============================================================

CREATE INDEX idx_institute_user_roles_institute_id
ON institute_user_roles(institute_id);

CREATE INDEX idx_institute_user_roles_institute_membership
ON institute_user_roles(
    institute_id,
    institute_user_id
);

CREATE INDEX idx_institute_user_roles_institute_role
ON institute_user_roles(
    institute_id,
    role_id
);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON COLUMN institute_user_roles.institute_id IS
'Institute/tenant that owns this role assignment. Membership and role must belong to this same institute.';

COMMENT ON CONSTRAINT fk_institute_user_roles_tenant_membership
ON institute_user_roles IS
'Prevents assigning a membership from another institute.';

COMMENT ON CONSTRAINT fk_institute_user_roles_tenant_role
ON institute_user_roles IS
'Prevents assigning a role from another institute.';
