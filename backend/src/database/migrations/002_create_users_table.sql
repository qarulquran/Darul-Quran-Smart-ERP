-- ============================================================
-- ISM Smart ERP
-- Migration: 002_create_users_table.sql
--
-- Purpose:
-- Create the global users table.
--
-- A user may belong to one or more institutes.
-- Institute membership and permissions will be handled
-- separately through institute_users and role tables.
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identity
    full_name VARCHAR(255) NOT NULL,
    full_name_bn VARCHAR(255),
    full_name_ar VARCHAR(255),

    -- Login / Contact
    email VARCHAR(255),
    phone VARCHAR(50),

    -- Authentication
    password_hash TEXT NOT NULL,

    -- Preferred Language
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'bn',

    -- Profile
    photo_url TEXT,

    -- Account Status
    status VARCHAR(30) NOT NULL DEFAULT 'active',

    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,

    -- Security / Session Information
    last_login_at TIMESTAMPTZ,
    password_changed_at TIMESTAMPTZ,

    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT users_preferred_language_check
        CHECK (
            preferred_language IN ('bn', 'en', 'ar')
        ),

    CONSTRAINT users_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'suspended',
                'locked',
                'archived'
            )
        ),

    CONSTRAINT users_failed_login_attempts_check
        CHECK (
            failed_login_attempts >= 0
        ),

    CONSTRAINT users_email_or_phone_check
        CHECK (
            email IS NOT NULL
            OR phone IS NOT NULL
        )
);

-- ============================================================
-- Unique Indexes
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email_lower
    ON users (LOWER(email))
    WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_phone
    ON users (phone)
    WHERE phone IS NOT NULL;

-- ============================================================
-- Supporting Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_status
    ON users(status);

CREATE INDEX IF NOT EXISTS idx_users_created_at
    ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_users_last_login_at
    ON users(last_login_at);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE users IS
'Global user accounts for ISM Smart ERP. A user can belong to multiple institutes.';

COMMENT ON COLUMN users.full_name IS
'Primary display name of the user.';

COMMENT ON COLUMN users.full_name_bn IS
'User name in Bangla.';

COMMENT ON COLUMN users.full_name_ar IS
'User name in Arabic.';

COMMENT ON COLUMN users.email IS
'Login/contact email address. Stored with case-insensitive uniqueness through an index.';

COMMENT ON COLUMN users.phone IS
'Login/contact phone number.';

COMMENT ON COLUMN users.password_hash IS
'Secure password hash. Plain-text passwords must never be stored.';

COMMENT ON COLUMN users.preferred_language IS
'Preferred interface language: bn, en, or ar.';

COMMENT ON COLUMN users.status IS
'Current global account status.';
