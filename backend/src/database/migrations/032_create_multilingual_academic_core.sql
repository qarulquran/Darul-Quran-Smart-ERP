
-- ============================================================
-- ISM Smart ERP
-- Migration: 032_create_multilingual_academic_core.sql
--
-- Purpose:
-- Build the multilingual academic foundation for:
-- - Academic departments
-- - Academic levels
-- - Independent department stages (e.g. Hifz)
-- - Multilingual classes
--
-- Core languages:
-- - Bangla
-- - English
-- - Arabic
-- ============================================================


-- ============================================================
-- 1. Academic Departments
-- ============================================================
--
-- Examples:
-- KITAB = General / Kitab Department
-- HIFZ  = Hifz Department
--
-- Future:
-- QIRAAT
-- IFTA
-- etc.
-- ============================================================

CREATE TABLE IF NOT EXISTS academic_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    institute_id UUID NOT NULL,

    department_code VARCHAR(100) NOT NULL,

    name_bn VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,

    description_bn TEXT,
    description_en TEXT,
    description_ar TEXT,

    sort_order INTEGER NOT NULL DEFAULT 0,

    status VARCHAR(30) NOT NULL DEFAULT 'active',

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_academic_departments_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT academic_departments_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        ),

    CONSTRAINT academic_departments_sort_order_check
        CHECK (sort_order >= 0),

    CONSTRAINT uq_academic_departments_code
        UNIQUE (
            institute_id,
            department_code
        ),

    CONSTRAINT uq_academic_departments_institute_id_id
        UNIQUE (
            institute_id,
            id
        )
);


-- ============================================================
-- 2. Academic Levels
-- ============================================================
--
-- Examples:
-- Rawdatul Atfal
-- Ibtidaiyyah
-- Mutawassitah
-- Sanabiyyah Ammah
-- Sanabiyyah Ulya
-- Fazilat
-- Takmil
-- ============================================================

CREATE TABLE IF NOT EXISTS academic_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    institute_id UUID NOT NULL,

    academic_department_id UUID,

    level_code VARCHAR(100) NOT NULL,

    name_bn VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,

    description_bn TEXT,
    description_en TEXT,
    description_ar TEXT,

    sort_order INTEGER NOT NULL DEFAULT 0,

    status VARCHAR(30) NOT NULL DEFAULT 'active',

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_academic_levels_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_academic_levels_department
        FOREIGN KEY (
            institute_id,
            academic_department_id
        )
        REFERENCES academic_departments(
            institute_id,
            id
        )
        ON DELETE RESTRICT,

    CONSTRAINT academic_levels_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        ),

    CONSTRAINT academic_levels_sort_order_check
        CHECK (sort_order >= 0),

    CONSTRAINT uq_academic_levels_code
        UNIQUE (
            institute_id,
            level_code
        ),

    CONSTRAINT uq_academic_levels_institute_id_id
        UNIQUE (
            institute_id,
            id
        )
);


-- ============================================================
-- 3. Independent Academic Department Stages
-- ============================================================
--
-- Hifz is NOT treated as a normal general class.
--
-- HIFZ Department:
-- NAZERA
-- HIFZ
-- HIFZ_REVISION
-- ============================================================

CREATE TABLE IF NOT EXISTS academic_department_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    institute_id UUID NOT NULL,

    academic_department_id UUID NOT NULL,

    stage_code VARCHAR(100) NOT NULL,

    name_bn VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,

    description_bn TEXT,
    description_en TEXT,
    description_ar TEXT,

    sort_order INTEGER NOT NULL DEFAULT 0,

    status VARCHAR(30) NOT NULL DEFAULT 'active',

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_academic_department_stages_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_academic_department_stages_department
        FOREIGN KEY (
            institute_id,
            academic_department_id
        )
        REFERENCES academic_departments(
            institute_id,
            id
        )
        ON DELETE CASCADE,

    CONSTRAINT academic_department_stages_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        ),

    CONSTRAINT academic_department_stages_sort_order_check
        CHECK (sort_order >= 0),

    CONSTRAINT uq_academic_department_stages_code
        UNIQUE (
            institute_id,
            academic_department_id,
            stage_code
        ),

    CONSTRAINT uq_academic_department_stages_institute_id_id
        UNIQUE (
            institute_id,
            id
        )
);


-- ============================================================
-- 4. Extend Existing Classes Table
-- ============================================================

ALTER TABLE classes
ADD COLUMN IF NOT EXISTS academic_department_id UUID;

ALTER TABLE classes
ADD COLUMN IF NOT EXISTS academic_level_id UUID;

ALTER TABLE classes
ADD COLUMN IF NOT EXISTS name_en VARCHAR(150);


-- Existing "name" value becomes the initial English value.
UPDATE classes
SET name_en = name
WHERE name_en IS NULL;


-- ============================================================
-- 5. Tenant-Safe Class Relationships
-- ============================================================

ALTER TABLE classes
ADD CONSTRAINT fk_classes_academic_department
FOREIGN KEY (
    institute_id,
    academic_department_id
)
REFERENCES academic_departments(
    institute_id,
    id
)
ON DELETE RESTRICT;


ALTER TABLE classes
ADD CONSTRAINT fk_classes_academic_level
FOREIGN KEY (
    institute_id,
    academic_level_id
)
REFERENCES academic_levels(
    institute_id,
    id
)
ON DELETE RESTRICT;


-- ============================================================
-- 6. Extend Sections For Three Languages
-- ============================================================

ALTER TABLE sections
ADD COLUMN IF NOT EXISTS name_en VARCHAR(150);


UPDATE sections
SET name_en = name
WHERE name_en IS NULL;


-- ============================================================
-- 7. Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_academic_departments_institute
    ON academic_departments(institute_id);

CREATE INDEX IF NOT EXISTS idx_academic_departments_status
    ON academic_departments(
        institute_id,
        status
    );


CREATE INDEX IF NOT EXISTS idx_academic_levels_institute
    ON academic_levels(institute_id);

CREATE INDEX IF NOT EXISTS idx_academic_levels_department
    ON academic_levels(
        institute_id,
        academic_department_id
    );


CREATE INDEX IF NOT EXISTS idx_academic_department_stages_institute
    ON academic_department_stages(institute_id);

CREATE INDEX IF NOT EXISTS idx_academic_department_stages_department
    ON academic_department_stages(
        institute_id,
        academic_department_id
    );


CREATE INDEX IF NOT EXISTS idx_classes_academic_department
    ON classes(
        institute_id,
        academic_department_id
    );

CREATE INDEX IF NOT EXISTS idx_classes_academic_level
    ON classes(
        institute_id,
        academic_level_id
    );


-- ============================================================
-- 8. Documentation
-- ============================================================

COMMENT ON TABLE academic_departments IS
'Institute-specific academic departments such as Kitab and Hifz.';

COMMENT ON TABLE academic_levels IS
'Multilingual academic levels within an institute academic department.';

COMMENT ON TABLE academic_department_stages IS
'Independent stages inside academic departments, such as Nazera, Hifz, and Hifz Revision.';

COMMENT ON COLUMN academic_departments.name_bn IS
'Department name in Bangla.';

COMMENT ON COLUMN academic_departments.name_en IS
'Department name in English.';

COMMENT ON COLUMN academic_departments.name_ar IS
'Department name in Arabic.';

COMMENT ON COLUMN academic_levels.name_bn IS
'Academic level name in Bangla.';

COMMENT ON COLUMN academic_levels.name_en IS
'Academic level name in English.';

COMMENT ON COLUMN academic_levels.name_ar IS
'Academic level name in Arabic.';

COMMENT ON COLUMN academic_department_stages.name_bn IS
'Department stage name in Bangla.';

COMMENT ON COLUMN academic_department_stages.name_en IS
'Department stage name in English.';

COMMENT ON COLUMN academic_department_stages.name_ar IS
'Department stage name in Arabic.';

COMMENT ON COLUMN classes.name_en IS
'Class/Jamaat name in English. Existing name column remains for backward compatibility.';

COMMENT ON COLUMN sections.name_en IS
'Section name in English. Existing name column remains for backward compatibility.';
