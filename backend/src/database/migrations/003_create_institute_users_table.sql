-- ============================================================
-- ISM Smart ERP
-- Migration: 003_create_institute_users_table.sql
--
-- Purpose:
-- Link global users with institutes.
--
-- A single user can belong to multiple institutes,
-- and each institute can have many users.
-- ============================================================

CREATE TABLE IF NOT EXISTS institute_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship
    institute_id UUID NOT NULL,
    user_id UUID NOT NULL,

    -- Membership Information
    membership_status VARCHAR(30) NOT NULL DEFAULT 'active',

    -- Optional institute-specific identity
    designation VARCHAR(150),

    -- Institute-specific preferred language
    preferred_language VARCHAR(10),

    -- Access / Lifecycle
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    invited_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    suspended_at TIMESTAMPTZ,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_institute_users_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_institute_users_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT institute_users_membership_status_check
        CHECK (
            membership_status IN (
                'invited',
                'active',
                'inactive',
                'suspended',
                'removed'
            )
        ),

    CONSTRAINT institute_users_preferred_language_check
        CHECK (
            preferred_language IS NULL
            OR preferred_language IN ('bn', 'en', 'ar')
        ),

    -- A user can have only one membership record
    -- for the same institute.
    CONSTRAINT uq_institute_users_membership
        UNIQUE (institute_id, user_id)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_institute_users_institute_id
    ON institute_users(institute_id);

CREATE INDEX IF NOT EXISTS idx_institute_users_user_id
    ON institute_users(user_id);

CREATE INDEX IF NOT EXISTS idx_institute_users_status
    ON institute_users(membership_status);

CREATE INDEX IF NOT EXISTS idx_institute_users_institute_status
    ON institute_users(institute_id, membership_status);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE institute_users IS
'Membership table connecting global users to institutes in ISM Smart ERP.';

COMMENT ON COLUMN institute_users.institute_id IS
'Institute/tenant the user belongs to.';

COMMENT ON COLUMN institute_users.user_id IS
'Global user account associated with the institute.';

COMMENT ON COLUMN institute_users.membership_status IS
'Current status of the user within this institute.';

COMMENT ON COLUMN institute_users.designation IS
'Institute-specific designation such as Principal, Teacher, Accountant, or Staff.';

COMMENT ON COLUMN institute_users.preferred_language IS
'Optional institute-specific interface language: bn, en, or ar.';
