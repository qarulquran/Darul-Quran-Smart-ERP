-- ============================================================
-- ISM Smart ERP
-- Migration: 012_create_teachers_table.sql
--
-- Purpose:
-- Create institute-specific teacher records.
--
-- Teachers belong to a single institute, while an optional
-- global user account may be linked for login access.
-- ============================================================

CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Optional Global User Account
    user_id UUID,

    -- Teacher Identity
    teacher_code VARCHAR(100) NOT NULL,

    full_name VARCHAR(255) NOT NULL,
    full_name_bn VARCHAR(255),
    full_name_ar VARCHAR(255),

    -- Personal Information
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),

    -- Contact Information
    phone VARCHAR(50),
    email VARCHAR(255),

    -- Address
    present_address TEXT,
    permanent_address TEXT,

    -- Professional Information
    qualification TEXT,
    specialization VARCHAR(255),
    designation VARCHAR(150),

    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Employment Information
    employment_type VARCHAR(50) NOT NULL DEFAULT 'full_time',

    basic_salary NUMERIC(12, 2),

    -- Profile
    photo_url TEXT,

    -- Preferred Language
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'bn',

    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'active',

    -- Additional Flexible Information
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_teachers_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_teachers_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT teachers_gender_check
        CHECK (
            gender IS NULL
            OR gender IN (
                'male',
                'female',
                'other'
            )
        ),

    CONSTRAINT teachers_employment_type_check
        CHECK (
            employment_type IN (
                'full_time',
                'part_time',
                'contract',
                'temporary',
                'volunteer'
            )
        ),

    CONSTRAINT teachers_language_check
        CHECK (
            preferred_language IN (
                'bn',
                'en',
                'ar'
            )
        ),

    CONSTRAINT teachers_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'on_leave',
                'resigned',
                'terminated',
                'retired',
                'archived'
            )
        ),

    CONSTRAINT teachers_basic_salary_check
        CHECK (
            basic_salary IS NULL
            OR basic_salary >= 0
        ),

    -- Teacher code must be unique inside the same institute.
    CONSTRAINT uq_teachers_institute_teacher_code
        UNIQUE (
            institute_id,
            teacher_code
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_teachers_institute_id
    ON teachers(institute_id);

CREATE INDEX IF NOT EXISTS idx_teachers_user_id
    ON teachers(user_id);

CREATE INDEX IF NOT EXISTS idx_teachers_status
    ON teachers(status);

CREATE INDEX IF NOT EXISTS idx_teachers_institute_status
    ON teachers(institute_id, status);

CREATE INDEX IF NOT EXISTS idx_teachers_full_name
    ON teachers(full_name);

CREATE INDEX IF NOT EXISTS idx_teachers_phone
    ON teachers(phone);

CREATE INDEX IF NOT EXISTS idx_teachers_email
    ON teachers(email);

CREATE INDEX IF NOT EXISTS idx_teachers_joining_date
    ON teachers(joining_date);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE teachers IS
'Teachers belonging to individual institutes in ISM Smart ERP.';

COMMENT ON COLUMN teachers.institute_id IS
'Institute/tenant that owns this teacher record.';

COMMENT ON COLUMN teachers.user_id IS
'Optional global user account linked to the teacher for ERP login.';

COMMENT ON COLUMN teachers.teacher_code IS
'Institute-specific unique teacher identifier.';

COMMENT ON COLUMN teachers.full_name IS
'Primary teacher name.';

COMMENT ON COLUMN teachers.full_name_bn IS
'Teacher name in Bangla.';

COMMENT ON COLUMN teachers.full_name_ar IS
'Teacher name in Arabic.';

COMMENT ON COLUMN teachers.qualification IS
'Academic or professional qualifications of the teacher.';

COMMENT ON COLUMN teachers.specialization IS
'Primary teaching or subject specialization.';

COMMENT ON COLUMN teachers.basic_salary IS
'Base salary amount. Payroll details may be extended in a dedicated payroll module.';

COMMENT ON COLUMN teachers.preferred_language IS
'Preferred communication/interface language: bn, en, or ar.';

COMMENT ON COLUMN teachers.metadata IS
'Flexible additional teacher information.';
