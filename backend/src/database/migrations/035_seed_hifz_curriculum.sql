-- ============================================================
-- ISM Smart ERP
-- Migration 035
-- Hifz Department Curriculum
--
-- Hifz is an independent academic department/pathway.
-- It is NOT part of the normal sequential class progression.
--
-- Stages:
--   1. Nazera
--   2. Hifz
--   3. Hifz Revision
--
-- Languages:
--   Bangla
--   English
--   Arabic
-- ============================================================


-- ============================================================
-- 1. ACADEMIC DEPARTMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS academic_departments (

    id UUID
        PRIMARY KEY
        DEFAULT gen_random_uuid(),

    institute_id UUID
        NOT NULL
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    department_code VARCHAR(100)
        NOT NULL,

    name_bn VARCHAR(255)
        NOT NULL,

    name_en VARCHAR(255)
        NOT NULL,

    name_ar VARCHAR(255)
        NOT NULL,

    description_bn TEXT,
    description_en TEXT,
    description_ar TEXT,

    department_type VARCHAR(50)
        NOT NULL
        DEFAULT 'academic',

    status VARCHAR(30)
        NOT NULL
        DEFAULT 'active',

    metadata JSONB
        NOT NULL
        DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_academic_department_code
        UNIQUE (
            institute_id,
            department_code
        ),

    CONSTRAINT uq_academic_department_tenant_id
        UNIQUE (
            institute_id,
            id
        ),

    CONSTRAINT academic_department_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        )
);


-- ============================================================
-- 2. DEPARTMENT STAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS academic_department_stages (

    id UUID
        PRIMARY KEY
        DEFAULT gen_random_uuid(),

    institute_id UUID
        NOT NULL
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    department_id UUID
        NOT NULL,

    stage_code VARCHAR(100)
        NOT NULL,

    name_bn VARCHAR(255)
        NOT NULL,

    name_en VARCHAR(255)
        NOT NULL,

    name_ar VARCHAR(255)
        NOT NULL,

    description_bn TEXT,
    description_en TEXT,
    description_ar TEXT,

    sort_order INTEGER
        NOT NULL
        DEFAULT 0,

    status VARCHAR(30)
        NOT NULL
        DEFAULT 'active',

    metadata JSONB
        NOT NULL
        DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_department_stage_department
        FOREIGN KEY (
            institute_id,
            department_id
        )
        REFERENCES academic_departments(
            institute_id,
            id
        )
        ON DELETE CASCADE,

    CONSTRAINT uq_department_stage_code
        UNIQUE (
            institute_id,
            department_id,
            stage_code
        ),

    CONSTRAINT uq_department_stage_tenant_id
        UNIQUE (
            institute_id,
            id
        ),

    CONSTRAINT department_stage_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        )
);


-- ============================================================
-- 3. HIFZ STAGE CURRICULUM
-- ============================================================

CREATE TABLE IF NOT EXISTS department_stage_curriculum (

    id UUID
        PRIMARY KEY
        DEFAULT gen_random_uuid(),

    institute_id UUID
        NOT NULL
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    department_id UUID
        NOT NULL,

    stage_id UUID
        NOT NULL,

    subject_id UUID
        NOT NULL,

    is_required BOOLEAN
        NOT NULL
        DEFAULT TRUE,

    is_optional BOOLEAN
        NOT NULL
        DEFAULT FALSE,

    sort_order INTEGER
        NOT NULL
        DEFAULT 0,

    status VARCHAR(30)
        NOT NULL
        DEFAULT 'active',

    metadata JSONB
        NOT NULL
        DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stage_curriculum_department
        FOREIGN KEY (
            institute_id,
            department_id
        )
        REFERENCES academic_departments(
            institute_id,
            id
        )
        ON DELETE CASCADE,

    CONSTRAINT fk_stage_curriculum_stage
        FOREIGN KEY (
            institute_id,
            stage_id
        )
        REFERENCES academic_department_stages(
            institute_id,
            id
        )
        ON DELETE CASCADE,

    CONSTRAINT fk_stage_curriculum_subject
        FOREIGN KEY (
            institute_id,
            subject_id
        )
        REFERENCES academic_subjects(
            institute_id,
            id
        )
        ON DELETE CASCADE,

    CONSTRAINT uq_department_stage_curriculum
        UNIQUE (
            institute_id,
            stage_id,
            subject_id
        ),

    CONSTRAINT department_curriculum_requirement_check
        CHECK (
            NOT (
                is_required = TRUE
                AND
                is_optional = TRUE
            )
        ),

    CONSTRAINT department_stage_curriculum_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        )
);


-- ============================================================
-- 4. STUDENT DEPARTMENT ENROLLMENTS
--
-- Important:
-- A student can enter the Hifz department separately from
-- the normal class progression.
--
-- Example:
--
-- Ibtidaiyyah-3
--       |
--       +------> Ibtidaiyyah-4
--       |
--       +------> Hifz Department
--                    |
--                    Nazera
--                    |
--                    Hifz
--                    |
--                    Hifz Revision
--
-- After completing Hifz, normal academic progression can
-- continue according to institute policy.
-- ============================================================

CREATE TABLE IF NOT EXISTS student_department_enrollments (

    id UUID
        PRIMARY KEY
        DEFAULT gen_random_uuid(),

    institute_id UUID
        NOT NULL
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    student_id UUID
        NOT NULL,

    department_id UUID
        NOT NULL,

    stage_id UUID
        NOT NULL,

    previous_class_id UUID,

    enrollment_date DATE
        NOT NULL
        DEFAULT CURRENT_DATE,

    completion_date DATE,

    enrollment_status VARCHAR(30)
        NOT NULL
        DEFAULT 'active',

    metadata JSONB
        NOT NULL
        DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_student_department_student
        FOREIGN KEY (
            institute
