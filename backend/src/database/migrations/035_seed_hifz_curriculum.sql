-- ============================================================
-- ISM Smart ERP
-- Migration: 035_seed_hifz_curriculum.sql
--
-- Darul Quran Ahmadiya Madrasa
--
-- Purpose:
-- - Hifz department curriculum
-- - Nazera / Hifz / Hifz Revision stages
-- - Student Hifz department enrollment support
--
-- Depends on:
-- - 032_create_multilingual_academic_core.sql
-- - 033_seed_darul_quran_academic_structure.sql
-- - 034_create_subjects_and_curriculum.sql
-- ============================================================


-- ============================================================
-- 1. HIFZ STAGE CURRICULUM TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS department_stage_curriculum (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    institute_id UUID NOT NULL,

    academic_department_id UUID NOT NULL,

    stage_id UUID NOT NULL,

    subject_id UUID NOT NULL,

    is_required BOOLEAN NOT NULL DEFAULT TRUE,

    is_optional BOOLEAN NOT NULL DEFAULT FALSE,

    sort_order INTEGER NOT NULL DEFAULT 0,

    status VARCHAR(30) NOT NULL DEFAULT 'active',

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stage_curriculum_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_stage_curriculum_department
        FOREIGN KEY (
            institute_id,
            academic_department_id
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

    CONSTRAINT department_stage_curriculum_requirement_check
        CHECK (
            NOT (
                is_required = TRUE
                AND
                is_optional = TRUE
            )
        ),

    CONSTRAINT department_stage_curriculum_sort_order_check
        CHECK (
            sort_order >= 0
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
-- 2. STUDENT DEPARTMENT ENROLLMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS student_department_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    institute_id UUID NOT NULL,

    student_id UUID NOT NULL,

    academic_department_id UUID NOT NULL,

    stage_id UUID NOT NULL,

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

    CONSTRAINT fk_student_department_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_student_department_student
        FOREIGN KEY (
            student_id,
            institute_id
        )
        REFERENCES students(
            id,
            institute_id
        )
        ON DELETE CASCADE,

    CONSTRAINT fk_student_department_department
        FOREIGN KEY (
            institute_id,
            academic_department_id
        )
        REFERENCES academic_departments(
            institute_id,
            id
        )
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_department_stage
        FOREIGN KEY (
            institute_id,
            stage_id
        )
        REFERENCES academic_department_stages(
            institute_id,
            id
        )
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_department_previous_class
        FOREIGN KEY (
            previous_class_id,
            institute_id
        )
        REFERENCES classes(
            id,
            institute_id
        )
        ON DELETE RESTRICT,

    CONSTRAINT student_department_status_check
        CHECK (
            enrollment_status IN (
                'active',
                'completed',
                'paused',
                'cancelled'
            )
        ),

    CONSTRAINT student_department_dates_check
        CHECK (
            completion_date IS NULL
            OR completion_date >= enrollment_date
        )
);


-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS
idx_stage_curriculum_institute_department
ON department_stage_curriculum(
    institute_id,
    academic_department_id
);


CREATE INDEX IF NOT EXISTS
idx_stage_curriculum_stage
ON department_stage_curriculum(
    institute_id,
    stage_id
);


CREATE INDEX IF NOT EXISTS
idx_student_department_enrollment_student
ON student_department_enrollments(
    institute_id,
    student_id
);


CREATE INDEX IF NOT EXISTS
idx_student_department_enrollment_stage
ON student_department_enrollments(
    institute_id,
    stage_id
);


CREATE INDEX IF NOT EXISTS
idx_student_department_enrollment_status
ON student_department_enrollments(
    institute_id,
    enrollment_status
);


-- ============================================================
-- 4. SEED HIFZ CURRICULUM
-- ============================================================

DO $$
DECLARE

    v_institute_id UUID :=
        '7cb955e3-45a7-41f3-81a3-f00cf2ab5973';

    v_hifz_department_id UUID;

    v_nazera_stage_id UUID;
    v_hifz_stage_id UUID;
    v_revision_stage_id UUID;

    v_quran_nazera_subject_id UUID;
    v_hifz_subject_id UUID;
    v_tajwid_subject_id UUID;
    v_revision_subject_id UUID;

BEGIN

    -- ========================================================
    -- Verify Institute
    -- ========================================================

    IF NOT EXISTS (
        SELECT 1
        FROM institutes
        WHERE id = v_institute_id
    ) THEN
        RAISE EXCEPTION
            'Darul Quran institute not found: %',
            v_institute_id;
    END IF;


    -- ========================================================
    -- Find Hifz Department
    -- ========================================================

    SELECT id
    INTO v_hifz_department_id
    FROM academic_departments
    WHERE institute_id = v_institute_id
      AND department_code = 'HIFZ'
    LIMIT 1;


    IF v_hifz_department_id IS NULL THEN
        RAISE EXCEPTION
            'HIFZ department not found for institute: %',
            v_institute_id;
    END IF;


    -- ========================================================
    -- Ensure Hifz Stages Exist
    -- ========================================================

    INSERT INTO academic_department_stages (
        institute_id,
        academic_department_id,
        stage_code,
        name_bn,
        name_en,
        name_ar,
        description_bn,
        description_en,
        description_ar,
        sort_order,
        status
    )
    VALUES
    (
        v_institute_id,
        v_hifz_department_id,
        'NAZERA',
        'নাযেরা',
        'Nazera',
        'النظرة',
        'কুরআন মাজীদ সহীহভাবে দেখে তিলাওয়াত শিক্ষা।',
        'Quran reading with correct recitation.',
        'تعليم تلاوة القرآن الكريم نظراً بصورة صحيحة.',
        1,
        'active'
    ),
    (
        v_institute_id,
        v_hifz_department_id,
        'HIFZ',
        'হিফজ',
        'Hifz',
        'حفظ القرآن',
        'সম্পূর্ণ কুরআন মাজীদ মুখস্থ করার ধাপ।',
        'Memorization of the complete Quran.',
        'مرحلة حفظ القرآن الكريم كاملاً.',
        2,
        'active'
    ),
    (
        v_institute_id,
        v_hifz_department_id,
        'HIFZ_REVISION',
        'হিফজ রিভিশন',
        'Hifz Revision',
        'مراجعة الحفظ',
        'সম্পন্ন হিফজ নিয়মিত পুনরাবৃত্তি ও মজবুত করার ধাপ।',
        'Revision and strengthening of completed Quran memorization.',
        'مرحلة مراجعة وتثبيت حفظ القرآن الكريم.',
        3,
        'active'
    )
    ON CONFLICT (
        institute_id,
        academic_department_id,
        stage_code
    )
    DO UPDATE SET
        name_bn = EXCLUDED.name_bn,
        name_en = EXCLUDED.name_en,
        name_ar = EXCLUDED.name_ar,
        description_bn = EXCLUDED.description_bn,
        description_en = EXCLUDED.description_en,
        description_ar = EXCLUDED.description_ar,
        sort_order = EXCLUDED.sort_order,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP;


    -- ========================================================
    -- Get Stage IDs
    -- ========================================================

    SELECT id
    INTO v_nazera_stage_id
    FROM academic_department_stages
    WHERE institute_id = v_institute_id
      AND academic_department_id = v_hifz_department_id
      AND stage_code = 'NAZERA'
    LIMIT 1;


    SELECT id
    INTO v_hifz_stage_id
    FROM academic_department_stages
    WHERE institute_id = v_institute_id
      AND academic_department_id = v_hifz_department_id
      AND stage_code = 'HIFZ'
    LIMIT 1;


    SELECT id
    INTO v_revision_stage_id
    FROM academic_department_stages
    WHERE institute_id = v_institute_id
      AND academic_department_id = v_hifz_department_id
      AND stage_code = 'HIFZ_REVISION'
    LIMIT 1;


    -- ========================================================
    -- Hifz Subjects
    -- ========================================================

    INSERT INTO academic_subjects (
        institute_id,
        subject_code,
        subject_type,
        name_bn,
        name_en,
        name_ar,
        status
    )
    VALUES (
        v_institute_id,
        'HIFZ_QURAN_NAZERA',
        'quran',
        'কুরআন মাজীদ নাযেরা',
        'Quran Nazera',
        'تلاوة القرآن الكريم نظراً',
        'active'
    )
    ON CONFLICT (
        institute_id,
        subject_code
    )
    DO UPDATE SET
        subject_type = EXCLUDED.subject_type,
        name_bn = EXCLUDED.name_bn,
        name_en = EXCLUDED.name_en,
        name_ar = EXCLUDED.name_ar,
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
    RETURNING id
    INTO v_quran_nazera_subject_id;


    INSERT INTO academic_subjects (
        institute_id,
        subject_code,
        subject_type,
        name_bn,
        name_en,
        name_ar,
        status
    )
    VALUES (
        v_institute_id,
        'HIFZ_QURAN_MEMORIZATION',
        'memorization',
        'কুরআন মাজীদ হিফজ',
        'Quran Memorization',
        'حفظ القرآن الكريم',
        'active'
    )
    ON CONFLICT (
        institute_id,
        subject_code
    )
    DO UPDATE SET
        subject_type = EXCLUDED.subject_type,
        name_bn = EXCLUDED.name_bn,
        name_en = EXCLUDED.name_en,
        name_ar = EXCLUDED.name_ar,
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
    RETURNING id
    INTO v_hifz_subject_id;


    INSERT INTO academic_subjects (
        institute_id,
        subject_code,
        subject_type,
        name_bn,
        name_en,
        name_ar,
        status
    )
    VALUES (
        v_institute_id,
        'HIFZ_TAJWID',
        'quran',
        'তাজবিদ ও সহীহ তিলাওয়াত',
        'Tajwid and Correct Recitation',
        'التجويد والتلاوة الصحيحة',
        'active'
    )
    ON CONFLICT (
        institute_id,
        subject_code
    )
    DO UPDATE SET
        subject_type = EXCLUDED.subject_type,
        name_bn = EXCLUDED.name_bn,
        name_en = EXCLUDED.name_en,
        name_ar = EXCLUDED.name_ar,
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
    RETURNING id
    INTO v_tajwid_subject_id;


    INSERT INTO academic_subjects (
        institute_id,
        subject_code,
        subject_type,
        name_bn,
        name_en,
        name_ar,
        status
    )
    VALUES (
        v_institute_id,
        'HIFZ_REVISION_PROGRAM',
        'memorization',
        'হিফজ পুনরাবৃত্তি ও মজবুতকরণ',
        'Hifz Revision and Consolidation',
        'مراجعة الحفظ وتثبيته',
        'active'
    )
    ON CONFLICT (
        institute_id,
        subject_code
    )
    DO UPDATE SET
        subject_type = EXCLUDED.subject_type,
        name_bn = EXCLUDED.name_bn,
        name_en = EXCLUDED.name_en,
        name_ar = EXCLUDED.name_ar,
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
    RETURNING id
    INTO v_revision_subject_id;


    -- ========================================================
    -- NAZERA STAGE CURRICULUM
    -- ========================================================

    INSERT INTO department_stage_curriculum (
        institute_id,
        academic_department_id,
        stage_id,
        subject_id,
        is_required,
        is_optional,
        sort_order,
        status
    )
    VALUES
    (
        v_institute_id,
        v_hifz_department_id,
        v_nazera_stage_id,
        v_quran_nazera_subject_id,
        TRUE,
        FALSE,
        1,
        'active'
    ),
    (
        v_institute_id,
        v_hifz_department_id,
        v_nazera_stage_id,
        v_tajwid_subject_id,
        TRUE,
        FALSE,
        2,
        'active'
    )
    ON CONFLICT (
        institute_id,
        stage_id,
        subject_id
    )
    DO UPDATE SET
        academic_department_id =
            EXCLUDED.academic_department_id,

        is_required =
            EXCLUDED.is_required,

        is_optional =
            EXCLUDED.is_optional,

        sort_order =
            EXCLUDED.sort_order,

        status =
            EXCLUDED.status,

        updated_at =
            CURRENT_TIMESTAMP;


    -- ========================================================
    -- HIFZ STAGE CURRICULUM
    -- ========================================================

    INSERT INTO department_stage_curriculum (
        institute_id,
        academic_department_id,
        stage_id,
        subject_id,
        is_required,
        is_optional,
        sort_order,
        status
    )
    VALUES
    (
        v_institute_id,
        v_hifz_department_id,
        v_hifz_stage_id,
        v_hifz_subject_id,
        TRUE,
        FALSE,
        1,
        'active'
    ),
    (
        v_institute_id,
        v_hifz_department_id,
        v_hifz_stage_id,
        v_tajwid_subject_id,
        TRUE,
        FALSE,
               2,
        'active'
    )
    ON CONFLICT (
        institute_id,
        stage_id,
        subject_id
    )
    DO UPDATE SET
        academic_department_id =
            EXCLUDED.academic_department_id,
        is_required =
            EXCLUDED.is_required,
        is_optional =
            EXCLUDED.is_optional,
        sort_order =
            EXCLUDED.sort_order,
        status =
            EXCLUDED.status,
        updated_at =
            CURRENT_TIMESTAMP;


    -- ========================================================
    -- HIFZ REVISION STAGE CURRICULUM
    -- ========================================================

    INSERT INTO department_stage_curriculum (
        institute_id,
        academic_department_id,
        stage_id,
        subject_id,
        is_required,
        is_optional,
        sort_order,
        status
    )
    VALUES
    (
        v_institute_id,
        v_hifz_department_id,
        v_revision_stage_id,
        v_revision_subject_id,
        TRUE,
        FALSE,
        1,
        'active'
    ),
    (
        v_institute_id,
        v_hifz_department_id,
        v_revision_stage_id,
        v_tajwid_subject_id,
        TRUE,
        FALSE,
        2,
        'active'
    )
    ON CONFLICT (
        institute_id,
        stage_id,
        subject_id
    )
    DO UPDATE SET
        academic_department_id =
            EXCLUDED.academic_department_id,
        is_required =
            EXCLUDED.is_required,
        is_optional =
            EXCLUDED.is_optional,
        sort_order =
            EXCLUDED.sort_order,
        status =
            EXCLUDED.status,
        updated_at =
            CURRENT_TIMESTAMP;


END $$;


-- ============================================================
-- 5. DOCUMENTATION
-- ============================================================

COMMENT ON TABLE department_stage_curriculum IS
'Curriculum assigned to independent academic department stages such as Nazera, Hifz and Hifz Revision.';

COMMENT ON TABLE student_department_enrollments IS
'Student enrollment in independent academic departments such as Hifz, separate from normal class progression.';

COMMENT ON COLUMN student_department_enrollments.previous_class_id IS
'The normal academic class the student attended before entering the independent department pathway.';


-- ============================================================
-- END OF MIGRATION 035
-- ============================================================
