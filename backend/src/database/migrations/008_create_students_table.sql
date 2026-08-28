-- ============================================================
-- ISM Smart ERP
-- Migration: 008_create_students_table.sql
--
-- Purpose:
-- Create the students table with strict institute ownership
-- for multi-tenant data isolation.
-- ============================================================

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Student Identity
    student_code VARCHAR(100) NOT NULL,

    full_name VARCHAR(255) NOT NULL,
    full_name_bn VARCHAR(255),
    full_name_ar VARCHAR(255),

    father_name VARCHAR(255),
    father_name_bn VARCHAR(255),
    father_name_ar VARCHAR(255),

    mother_name VARCHAR(255),
    mother_name_bn VARCHAR(255),
    mother_name_ar VARCHAR(255),

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

    -- Guardian Information
    guardian_name VARCHAR(255),
    guardian_relation VARCHAR(100),
    guardian_phone VARCHAR(50),
    guardian_email VARCHAR(255),
    guardian_address TEXT,

    -- Academic / Admission Information
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    previous_institute VARCHAR(255),

    -- Current academic references will be connected
    -- to class/section tables in later migrations.
    class_id UUID,
    section_id UUID,

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

    CONSTRAINT fk_students_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT students_gender_check
        CHECK (
            gender IS NULL
            OR gender IN (
                'male',
                'female',
                'other'
            )
        ),

    CONSTRAINT students_language_check
        CHECK (
            preferred_language IN ('bn', 'en', 'ar')
        ),

    CONSTRAINT students_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'graduated',
                'transferred',
                'suspended',
                'archived'
            )
        ),

    -- Student code must be unique inside the same institute.
    CONSTRAINT uq_students_institute_student_code
        UNIQUE (institute_id, student_code)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_students_institute_id
    ON students(institute_id);

CREATE INDEX IF NOT EXISTS idx_students_status
    ON students(status);

CREATE INDEX IF NOT EXISTS idx_students_institute_status
    ON students(institute_id, status);

CREATE INDEX IF NOT EXISTS idx_students_full_name
    ON students(full_name);

CREATE INDEX IF NOT EXISTS idx_students_phone
    ON students(phone);

CREATE INDEX IF NOT EXISTS idx_students_admission_date
    ON students(admission_date);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE students IS
'Students belonging to individual institutes in ISM Smart ERP.';

COMMENT ON COLUMN students.institute_id IS
'Institute/tenant that owns this student record.';

COMMENT ON COLUMN students.student_code IS
'Institute-specific unique student identifier.';

COMMENT ON COLUMN students.full_name IS
'Primary student name.';

COMMENT ON COLUMN students.full_name_bn IS
'Student name in Bangla.';

COMMENT ON COLUMN students.full_name_ar IS
'Student name in Arabic.';

COMMENT ON COLUMN students.guardian_name IS
'Primary guardian name for the student.';

COMMENT ON COLUMN students.preferred_language IS
'Preferred language for student-facing communication: bn, en, or ar.';

COMMENT ON COLUMN students.metadata IS
'Flexible additional student data that does not require a dedicated column.';
