-- ============================================================
-- ISM Smart ERP
-- Migration: 033_seed_darul_quran_academic_structure.sql
--
-- Darul Quran Ahmadiya Madrasa
--
-- Seeds:
-- - Kitab Department
-- - Hifz Department
-- - Academic Levels
-- - 16 General Classes / Jamaat
-- - Hifz Stages
--
-- Languages:
-- - Bangla
-- - English
-- - Arabic
-- ============================================================


DO $$
DECLARE

    -- --------------------------------------------------------
    -- Darul Quran Institute
    -- --------------------------------------------------------

    v_institute_id UUID :=
        '7cb955e3-45a7-41f3-81a3-f00cf2ab5973';


    -- --------------------------------------------------------
    -- Departments
    -- --------------------------------------------------------

    v_kitab_department_id UUID;
    v_hifz_department_id UUID;


    -- --------------------------------------------------------
    -- Academic Levels
    -- --------------------------------------------------------

    v_rawdatul_atfal_id UUID;
    v_ibtidaiyyah_id UUID;
    v_mutawassitah_id UUID;
    v_sanabiyyah_ammah_id UUID;
    v_sanabiyyah_ulya_id UUID;
    v_fazilat_id UUID;
    v_takmil_id UUID;

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
    -- 1. KITAB DEPARTMENT
    -- ========================================================

    INSERT INTO academic_departments (
        institute_id,
        department_code,

        name_bn,
        name_en,
        name_ar,

        description_bn,
        description_en,
        description_ar,

        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        'KITAB',

        'কিতাব বিভাগ',
        'Kitab Department',
        'قسم الكتب والدراسات الإسلامية',

        'শিশু শ্রেণি থেকে তাকমীল/দাওরায়ে হাদিস পর্যন্ত সাধারণ কিতাবভিত্তিক শিক্ষাধারা।',

        'The general Kitab-based academic track from the introductory level through Takmil / Dawrah al-Hadith.',

        'المسار التعليمي العام القائم على دراسة الكتب من المرحلة التمهيدية إلى مرحلة التكميل ودورة الحديث.',

        1,
        'active'
    )
    ON CONFLICT (
        institute_id,
        department_code
    )
    DO UPDATE SET
        name_bn = EXCLUDED.name_bn,
        name_en = EXCLUDED.name_en,
        name_ar = EXCLUDED.name_ar,

        description_bn =
            EXCLUDED.description_bn,

        description_en =
            EXCLUDED.description_en,

        description_ar =
            EXCLUDED.description_ar,

        sort_order =
            EXCLUDED.sort_order,

        status =
            EXCLUDED.status,

        updated_at =
            CURRENT_TIMESTAMP

    RETURNING id
    INTO v_kitab_department_id;


    -- ========================================================
    -- 2. HIFZ DEPARTMENT
    -- ========================================================

    INSERT INTO academic_departments (
        institute_id,
        department_code,

        name_bn,
        name_en,
        name_ar,

        description_bn,
        description_en,
        description_ar,

        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        'HIFZ',

        'হিফজ বিভাগ',
        'Hifz Department',
        'قسم تحفيظ القرآن الكريم',

        'কুরআন মাজীদ নাজেরা, হিফজ এবং হিফজ রিভিশনের স্বতন্ত্র বিভাগ।',

        'An independent Quran program for Nazera, Hifz and Hifz Revision.',

        'قسم مستقل لتلاوة القرآن الكريم وحفظه ومراجعة الحفظ.',

        2,
        'active'
    )
    ON CONFLICT (
        institute_id,
        department_code
    )
    DO UPDATE SET
        name_bn = EXCLUDED.name_bn,
        name_en = EXCLUDED.name_en,
        name_ar = EXCLUDED.name_ar,

        description_bn =
            EXCLUDED.description_bn,

        description_en =
            EXCLUDED.description_en,

        description_ar =
            EXCLUDED.description_ar,

        sort_order =
            EXCLUDED.sort_order,

        status =
            EXCLUDED.status,

        updated_at =
            CURRENT_TIMESTAMP

    RETURNING id
    INTO v_hifz_department_id;


    -- ========================================================
    -- 3. ACADEMIC LEVELS
    -- ========================================================


    -- --------------------------------------------------------
    -- Rawdatul Atfal
    -- --------------------------------------------------------

    INSERT INTO academic_levels (
        institute_id,
        academic_department_id,
        level_code,

        name_bn,
        name_en,
        name_ar,

        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        v_kitab_department_id,
        'RAWDATUL_ATFAL',

        'রওজাতুল আতফাল',
        'Rawdatul Atfal',
        'روضة الأطفال',

        1,
        'active'
    )
    ON CONFLICT (
        institute_id,
        level_code
    )
    DO UPDATE SET
        academic_department_id =
            EXCLUDED.academic_department_id,

        name_bn =
            EXCLUDED.name_bn,

        name_en =
            EXCLUDED.name_en,

        name_ar =
            EXCLUDED.name_ar,

        sort_order =
            EXCLUDED.sort_order,

        status =
            EXCLUDED.status,

        updated_at =
            CURRENT_TIMESTAMP

    RETURNING id
    INTO v_rawdatul_atfal_id;


    -- --------------------------------------------------------
    -- Ibtidaiyyah
    -- --------------------------------------------------------

    INSERT INTO academic_levels (
        institute_id,
        academic_department_id,
        level_code,

        name_bn,
        name_en,
        name_ar,

        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        v_kitab_department_id,
        'IBTIDAIYYAH',

        'ইবতিদাইয়্যাহ',
        'Ibtidaiyyah',
        'الابتدائية',

        2,
        'active'
    )
    ON CONFLICT (
        institute_id,
        level_code
    )
    DO UPDATE SET
        academic_department_id =
            EXCLUDED.academic_department_id,

        name_bn =
            EXCLUDED.name_bn,

        name_en =
            EXCLUDED.name_en,

        name_ar =
            EXCLUDED.name_ar,

        sort_order =
            EXCLUDED.sort_order,

        status =
            EXCLUDED.status,

        updated_at =
            CURRENT_TIMESTAMP

    RETURNING id
    INTO v_ibtidaiyyah_id;


    -- --------------------------------------------------------
    -- Mutawassitah
    -- --------------------------------------------------------

    INSERT INTO academic_levels (
        institute_id,
        academic_department_id,
        level_code,

        name_bn,
        name_en,
        name_ar,

        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        v_kitab_department_id,
        'MUTAWASSITAH',

        'মুতাওয়াসসিতাহ',
        'Mutawassitah',
        'المتوسطة',

        3,
        'active'
    )
    ON CONFLICT (
        institute_id,
        level_code
    )
    DO UPDATE SET
        academic_department_id =
            EXCLUDED.academic_department_id,

        name_bn =
            EXCLUDED.name_bn,

        name_en =
            EXCLUDED.name_en,

        name_ar =
            EXCLUDED.name_ar,

        sort_order =
            EXCLUDED.sort_order,

        status =
            EXCLUDED.status,

        updated_at =
            CURRENT_TIMESTAMP

    RETURNING id
    INTO v_mutawassitah_id;


    -- --------------------------------------------------------
    -- Sanabiyyah Ammah
    -- --------------------------------------------------------

    INSERT INTO academic_levels (
        institute_id,
        academic_department_id,
        level_code,

        name_bn,
        name_en,
        name_ar,

        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        v_kitab_department_id,
        'SANABIYYAH_AMMAH',

        'সানাবিয়্যাহ আম্মাহ',
        'Sanabiyyah Ammah',
        'الثانوية العامة',

        4,
        'active'
    )
    ON CONFLICT (
        institute_id,
        level_code
    )
    DO UPDATE SET
        academic_department_id =
            EXCLUDED.academic_department_id,

        name_bn =
            EXCLUDED.name_bn,

        name_en =
            EXCLUDED.name_en,

        name_ar =
            EXCLUDED.name_ar,

        sort_order =
            EXCLUDED.sort_order,

        status =
            EXCLUDED.status,

        updated_at =
            CURRENT_TIMESTAMP

    RETURNING id
    INTO v_sanabiyyah_ammah_id;


    -- --------------------------------------------------------
    -- Sanabiyyah Ulya
    -- --------------------------------------------------------

    INSERT INTO academic_levels (
        institute_id,
        academic_department_id,
        level_code,

        name_bn,
        name_en,
        name_ar,

        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        v_kitab_department_id,
        'SANABIYYAH_ULYA',

        'সানাবিয়্যাহ উলইয়া',
        'Sanabiyyah Ulya',
        'الثانوية العليا',

        5,
        'active'
    )
    ON CONFLICT (
        institute_id,
        level_code
    )
    DO UPDATE SET
        academic_department_id =
            EXCLUDED.academic_department_id,

        name_bn =
            EXCLUDED.name_bn,

        name_en =
            EXCLUDED.name_en,

        name_ar =
            EXCLUDED.name_ar,

        sort_order =
            EXCLUDED.sort_order,

        status =
            EXCLUDED.status,

        updated_at =
            CURRENT_TIMESTAMP

    RETURNING id
    INTO v_sanabiyyah_ulya_id;


    -- --------------------------------------------------------
    -- Fazilat
    -- --------------------------------------------------------

    INSERT INTO academic_levels (
        institute_id,
        academic_department_id,
        level_code,

        name_bn,
        name_en,
        name_ar,

        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        v_kitab_department_id,
        'FAZILAT',

        'ফযীলত',
        'Fazilat',
        'الفضيلة',

        6,
        'active'
    )
    ON CONFLICT (
        institute_id,
        level_code
    )
    DO UPDATE SET
        academic_department_id =
            EXCLUDED.academic_department_id,

        name_bn =
            EXCLUDED.name_bn,

        name_en =
            EXCLUDED.name_en,

        name_ar =
            EXCLUDED.name_ar,

        sort_order =
            EXCLUDED.sort_order,

        status =
            EXCLUDED.status,

        updated_at =
            CURRENT_TIMESTAMP

    RETURNING id
    INTO v_fazilat_id;


    -- --------------------------------------------------------
    -- Takmil
    -- --------------------------------------------------------

    INSERT INTO academic_levels (
        institute_id,
        academic_department_id,
        level_code,

        name_bn,
        name_en,
        name_ar,

        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        v_kitab_department_id,
        'TAKMIL',

        'তাকমীল',
        'Takmil',
        'التكميل',

        7,
        'active'
    )
    ON CONFLICT (
        institute_id,
        level_code
    )
    DO UPDATE SET
        academic_department_id =
            EXCLUDED.academic_department_id,

        name_bn =
            EXCLUDED.name_bn,

        name_en =
            EXCLUDED.name_en,

        name_ar =
            EXCLUDED.name_ar,

        sort_order =
            EXCLUDED.sort_order,

        status =
            EXCLUDED.status,

        updated_at =
            CURRENT_TIMESTAMP

    RETURNING id
    INTO v_takmil_id;


    -- ========================================================
    -- 4. GENERAL CLASSES / JAMAAT
    -- ========================================================
    --
    -- Existing "name" is retained for backward compatibility.
    -- name_bn / name_en / name_ar are multilingual fields.
    -- ========================================================


    -- 01. Rawdatul Atfal / Nursery

    INSERT INTO classes (
        institute_id,
        academic_department_id,
        academic_level_id,

        class_code,

        name,
        name_bn,
        name_en,
        name_ar,

        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        v_kitab_department_id,
        v_rawdatul_atfal_id,

        'RAWDATUL_ATFAL',

        'Rawdatul Atfal',
        'রওজাতুল আতফাল — শিশু শ্রেণি',
        'Rawdatul Atfal — Nursery',
        'روضة الأطفال',

        1,
        'active'
    )
    ON CONFLICT (
        institute_id,
        class_code
    )
    DO UPDATE SET
        academic_department_id =
            EXCLUDED.academic_department_id,

        academic_level_id =
            EXCLUDED.academic_level_id,

        name =
            EXCLUDED.name,

        name_bn =
            EXCLUDED.name_bn,

        name_en =
            EXCLUDED.name_en,

        name_ar =
            EXCLUDED.name_ar,

        sort_order =
            EXCLUDED.sort_order,

        status =
            EXCLUDED.status,

        updated_at =
            CURRENT_TIMESTAMP;


    -- 02. Ibtidaiyyah 1

    INSERT INTO classes (
        institute_id,
        academic_department_id,
        academic_level_id,
        class_code,
        name,
        name_bn,
        name_en,
        name_ar,
        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        v_kitab_department_id,
        v_ibtidaiyyah_id,
        'IBTIDAIYYAH_1',
        'Ibtidaiyyah 1',
        'ইবতিদাইয়্যাহ-১ — প্রথম শ্রেণি',
        'Ibtidaiyyah 1 — Grade One',
        'الابتدائية الأولى',
        2,
        'active'
    )
    ON CONFLICT (
        institute_id,
        class_code
    )
    DO UPDATE SET
        academic_department_id = EXCLUDED.academic_department_id,
        academic_level_id = EXCLUDED.academic_level_id,
        name = EXCLUDED.name,
        name_bn = EXCLUDED.name_bn,
        name_en = EXCLUDED.name_en,
        name_ar = EXCLUDED.name_ar,
        sort_order = EXCLUDED.sort_order,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP;


    -- 03. Ibtidaiyyah 2

    INSERT INTO classes (
        institute_id,
        academic_department_id,
        academic_level_id,
        class_code,
        name,
        name_bn,
        name_en,
        name_ar,
        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        v_kitab_department_id,
        v_ibtidaiyyah_id,
        'IBTIDAIYYAH_2',
        'Ibtidaiyyah 2',
        'ইবতিদাইয়্যাহ-২ — দ্বিতীয় শ্রেণি',
        'Ibtidaiyyah 2 — Grade Two',
        'الابتدائية الثانية',
        3,
        'active'
    )
    ON CONFLICT (
        institute_id,
        class_code
    )
    DO UPDATE SET
        academic_department_id = EXCLUDED.academic_department_id,
        academic_level_id = EXCLUDED.academic_level_id,
        name = EXCLUDED.name,
        name_bn = EXCLUDED.name_bn,
        name_en = EXCLUDED.name_en,
        name_ar = EXCLUDED.name_ar,
        sort_order = EXCLUDED.sort_order,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP;


    -- 04. Ibtidaiyyah 3

    INSERT INTO classes (
        institute_id,
        academic_department_id,
        academic_level_id,
        class_code,
        name,
        name_bn,
        name_en,
        name_ar,
        sort_order,
        status
    )
    VALUES (
        v_institute_id,
        v_kitab_department_id,
        v_ibtidaiyyah_id,
        'IBTIDAIYYAH_3',
        'Ibtidaiyyah 3',
        'ইবতিদাইয়্যাহ-৩ — তৃতীয় শ্রেণি',
        'Ibtidaiyyah 3 — Grade Three',
        'الابتدائية الثالثة',
        4,
        'active'
    )
    ON CONFLICT (
        institute_id,
        class_code
    )
    DO UPDATE SET
        academic_department_id = EXCLUDED.academic_department_id,
        academic_level_id = EXCLUDED.academic_level_id,
        name = EXCLUDED.name,
        name_bn
