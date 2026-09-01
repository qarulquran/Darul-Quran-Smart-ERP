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
-- ============================================================

DO $$
DECLARE

    v_institute_id UUID :=
        '7cb955e3-45a7-41f3-81a3-f00cf2ab5973';

    v_academic_year VARCHAR(20) :=
        '2026-2027';

    v_kitab_department_id UUID;
    v_hifz_department_id UUID;

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
        description_bn = EXCLUDED.description_bn,
        description_en = EXCLUDED.description_en,
        description_ar = EXCLUDED.description_ar,
        sort_order = EXCLUDED.sort_order,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
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
        'কুরআন মাজীদ নাযেরা, হিফজ এবং হিফজ রিভিশনের স্বতন্ত্র বিভাগ।',
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
        description_bn = EXCLUDED.description_bn,
        description_en = EXCLUDED.description_en,
        description_ar = EXCLUDED.description_ar,
        sort_order = EXCLUDED.sort_order,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id
    INTO v_hifz_department_id;


    -- ========================================================
    -- 3. ACADEMIC LEVELS
    -- ========================================================

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
    VALUES

        (
            v_institute_id,
            v_kitab_department_id,
            'RAWDATUL_ATFAL',
            'রওজাতুল আতফাল',
            'Rawdatul Atfal',
            'روضة الأطفال',
            1,
            'active'
        ),

        (
            v_institute_id,
            v_kitab_department_id,
            'IBTIDAIYYAH',
            'ইবতিদাইয়্যাহ',
            'Ibtidaiyyah',
            'الابتدائية',
            2,
            'active'
        ),

        (
            v_institute_id,
            v_kitab_department_id,
            'MUTAWASSITAH',
            'মুতাওয়াসসিতাহ',
            'Mutawassitah',
            'المتوسطة',
            3,
            'active'
        ),

        (
            v_institute_id,
            v_kitab_department_id,
            'SANABIYYAH_AMMAH',
            'সানাবিয়্যাহ আম্মাহ',
            'Sanabiyyah Ammah',
            'الثانوية العامة',
            4,
            'active'
        ),

        (
            v_institute_id,
            v_kitab_department_id,
            'SANABIYYAH_ULYA',
            'সানাবিয়্যাহ উলইয়া',
            'Sanabiyyah Ulya',
            'الثانوية العليا',
            5,
            'active'
        ),

        (
            v_institute_id,
            v_kitab_department_id,
            'FAZILAT',
            'ফযীলত',
            'Fazilat',
            'الفضيلة',
            6,
            'active'
        ),

        (
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
            CURRENT_TIMESTAMP;


    -- ========================================================
    -- 4. GENERAL CLASSES / JAMAAT
    -- ========================================================

    INSERT INTO classes (
        institute_id,
        academic_department_id,
        academic_level_id,
        class_code,
        name,
        name_bn,
        name_en,
        name_ar,
        academic_year,
        sort_order,
        status
    )

    SELECT
        v_institute_id,
        v_kitab_department_id,
        al.id,
        c.class_code,
        c.name,
        c.name_bn,
        c.name_en,
        c.name_ar,
        v_academic_year,
        c.sort_order,
        'active'

    FROM (
        VALUES

        (
            'RAWDATUL_ATFAL',
            'RAWDATUL_ATFAL',
            'Rawdatul Atfal',
            'রওজাতুল আতফাল — শিশু শ্রেণি',
            'Rawdatul Atfal — Nursery',
            'روضة الأطفال',
            1
        ),

        (
            'IBTIDAIYYAH_1',
            'IBTIDAIYYAH',
            'Ibtidaiyyah 1',
            'ইবতিদাইয়্যাহ-১ — প্রথম শ্রেণি',
            'Ibtidaiyyah 1 — Grade One',
            'الابتدائية الأولى',
            2
        ),

        (
            'IBTIDAIYYAH_2',
            'IBTIDAIYYAH',
            'Ibtidaiyyah 2',
            'ইবতিদাইয়্যাহ-২ — দ্বিতীয় শ্রেণি',
            'Ibtidaiyyah 2 — Grade Two',
            'الابتدائية الثانية',
            3
        ),

        (
            'IBTIDAIYYAH_3',
            'IBTIDAIYYAH',
            'Ibtidaiyyah 3',
            'ইবতিদাইয়্যাহ-৩ — তৃতীয় শ্রেণি',
            'Ibtidaiyyah 3 — Grade Three',
            'الابتدائية الثالثة',
            4
        ),

        (
            'IBTIDAIYYAH_4',
            'IBTIDAIYYAH',
            'Ibtidaiyyah 4',
            'ইবতিদাইয়্যাহ-৪ — চতুর্থ শ্রেণি',
            'Ibtidaiyyah 4 — Grade Four',
            'الابتدائية الرابعة',
            5
        ),

        (
            'IBTIDAIYYAH_5',
            'IBTIDAIYYAH',
            'Ibtidaiyyah 5',
            'ইবতিদাইয়্যাহ-৫ — পঞ্চম শ্রেণি',
            'Ibtidaiyyah 5 — Grade Five',
            'الابتدائية الخامسة',
            6
        ),

        (
            'MUTAWASSITAH_1',
            'MUTAWASSITAH',
            'Mutawassitah 1',
            'মুতাওয়াসসিতাহ-১',
            'Mutawassitah 1',
            'المتوسطة الأولى',
            7
        ),

        (
            'MUTAWASSITAH_2',
            'MUTAWASSITAH',
            'Mutawassitah 2',
            'মুতাওয়াসসিতাহ-২',
            'Mutawassitah 2',
            'المتوسطة الثانية',
            8
        ),

        (
            'MUTAWASSITAH_3',
            'MUTAWASSITAH',
            'Mutawassitah 3',
            'মুতাওয়াসসিতাহ-৩',
            'Mutawassitah 3',
            'المتوسطة الثالثة',
            9
        ),

        (
            'SANABIYYAH_AMMAH_1',
            'SANABIYYAH_AMMAH',
            'Sanabiyyah Ammah 1',
            'সানাবিয়্যাহ আম্মাহ-১',
            'Sanabiyyah Ammah 1',
            'الثانوية العامة الأولى',
            10
        ),

        (
            'SANABIYYAH_AMMAH_2',
            'SANABIYYAH_AMMAH',
            'Sanabiyyah Ammah 2',
            'সানাবিয়্যাহ আম্মাহ-২ — কাফিয়া',
            'Sanabiyyah Ammah 2 — Kafiya',
            'الثانوية العامة الثانية',
            11
        ),

        (
            'SANABIYYAH_ULYA_1',
            'SANABIYYAH_ULYA',
            'Sanabiyyah Ulya 1',
            'সানাবিয়্যাহ উলইয়া-১',
            'Sanabiyyah Ulya 1',
            'الثانوية العليا الأولى',
            12
        ),

        (
            'SANABIYYAH_ULYA_2',
            'SANABIYYAH_ULYA',
            'Sanabiyyah Ulya 2',
            'সানাবিয়্যাহ উলইয়া-২ — শরহে উইকায়া',
            'Sanabiyyah Ulya 2 — Sharh Wiqayah',
            'الثانوية العليا الثانية',
            13
        ),

        (
            'FAZILAT_1',
            'FAZILAT',
            'Fazilat 1',
            'ফযীলত-১',
            'Fazilat 1',
            'الفضيلة الأولى',
            14
        ),

        (
            'FAZILAT_2',
            'FAZILAT',
            'Fazilat 2',
            'ফযীলত-২ — মিশকাত',
            'Fazilat 2 — Mishkat',
            'الفضيلة الثانية',
            15
        ),

        (
            'TAKMIL',
            'TAKMIL',
            'Takmil / Dawrah al-Hadith',
            'তাকমীল / দাওরায়ে হাদিস',
            'Takmil / Dawrah al-Hadith',
            'التكميل ودورة الحديث',
            16
        )

    ) AS c(
        class_code,
        level_code,
        name,
        name_bn,
        name_en,
        name_ar,
        sort_order
    )

    INNER JOIN academic_levels al
        ON al.institute_id =
            v_institute_id

       AND al.level_code =
            c.level_code

    ON CONFLICT (
        institute_id,
        academic_year,
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


    -- ========================================================
    -- 5. HIFZ DEPARTMENT STAGES
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
        name_bn =
            EXCLUDED.name_bn,

        name_en =
            EXCLUDED.name_en,

        name_ar =
            EXCLUDED.name_ar,

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
            CURRENT_TIMESTAMP;


END $$;


-- ============================================================
-- END OF MIGRATION 033
-- ============================================================
