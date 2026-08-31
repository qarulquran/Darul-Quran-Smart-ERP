-- ============================================================
-- ISM Smart ERP
-- Migration 034
-- Multilingual Subject / Kitab Master + Class Curriculum
--
-- Languages:
--   Bangla
--   English
--   Arabic
--
-- Institute:
--   Darul Quran Ahmadiya Madrasa
-- ============================================================


-- ============================================================
-- 1. SUBJECT / KITAB MASTER
-- ============================================================

CREATE TABLE IF NOT EXISTS academic_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    institute_id UUID NOT NULL
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    subject_code VARCHAR(120) NOT NULL,

    subject_type VARCHAR(30)
        NOT NULL
        DEFAULT 'subject',

    name_bn VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,

    description_bn TEXT,
    description_en TEXT,
    description_ar TEXT,

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

    CONSTRAINT academic_subject_type_check
        CHECK (
            subject_type IN (
                'subject',
                'book',
                'quran',
                'memorization',
                'language',
                'general'
            )
        ),

    CONSTRAINT academic_subject_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        ),

    CONSTRAINT uq_academic_subject_code
        UNIQUE (
            institute_id,
            subject_code
        ),

    CONSTRAINT uq_academic_subject_tenant_id
        UNIQUE (
            institute_id,
            id
        )
);


-- ============================================================
-- 2. CLASS CURRICULUM MAPPING
-- ============================================================

CREATE TABLE IF NOT EXISTS class_curriculum (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    institute_id UUID NOT NULL
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    class_id UUID NOT NULL,

    subject_id UUID NOT NULL,

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

    CONSTRAINT fk_class_curriculum_class
        FOREIGN KEY (
            institute_id,
            class_id
        )
        REFERENCES classes(
            institute_id,
            id
        )
        ON DELETE CASCADE,

    CONSTRAINT fk_class_curriculum_subject
        FOREIGN KEY (
            institute_id,
            subject_id
        )
        REFERENCES academic_subjects(
            institute_id,
            id
        )
        ON DELETE CASCADE,

    CONSTRAINT class_curriculum_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        ),

    CONSTRAINT class_curriculum_requirement_check
        CHECK (
            NOT (
                is_required = TRUE
                AND
                is_optional = TRUE
            )
        ),

    CONSTRAINT uq_class_curriculum
        UNIQUE (
            institute_id,
            class_id,
            subject_id
        )
);


-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS
idx_academic_subjects_institute
ON academic_subjects(institute_id);


CREATE INDEX IF NOT EXISTS
idx_academic_subjects_type
ON academic_subjects(
    institute_id,
    subject_type
);


CREATE INDEX IF NOT EXISTS
idx_class_curriculum_class
ON class_curriculum(
    institute_id,
    class_id
);


CREATE INDEX IF NOT EXISTS
idx_class_curriculum_subject
ON class_curriculum(
    institute_id,
    subject_id
);


-- ============================================================
-- 4. SEED HELPER
-- ============================================================

CREATE OR REPLACE FUNCTION seed_ism_subject(
    p_institute_id UUID,
    p_code VARCHAR,
    p_type VARCHAR,
    p_name_bn VARCHAR,
    p_name_en VARCHAR,
    p_name_ar VARCHAR
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_id UUID;
BEGIN

    INSERT INTO academic_subjects (
        institute_id,
        subject_code,
        subject_type,
        name_bn,
        name_en,
        name_ar
    )
    VALUES (
        p_institute_id,
        p_code,
        p_type,
        p_name_bn,
        p_name_en,
        p_name_ar
    )

    ON CONFLICT (
        institute_id,
        subject_code
    )

    DO UPDATE SET
        subject_type =
            EXCLUDED.subject_type,

        name_bn =
            EXCLUDED.name_bn,

        name_en =
            EXCLUDED.name_en,

        name_ar =
            EXCLUDED.name_ar,

        status =
            'active',

        updated_at =
            CURRENT_TIMESTAMP

    RETURNING id
    INTO v_id;

    RETURN v_id;

END;
$$;


-- ============================================================
-- 5. CURRICULUM HELPER
-- ============================================================

CREATE OR REPLACE FUNCTION seed_ism_curriculum(
    p_institute_id UUID,
    p_class_code VARCHAR,
    p_subject_id UUID,
    p_sort_order INTEGER,
    p_optional BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_class_id UUID;
BEGIN

    SELECT id
    INTO v_class_id

    FROM classes

    WHERE institute_id =
        p_institute_id

      AND class_code =
        p_class_code

    LIMIT 1;


    IF v_class_id IS NULL THEN

        RAISE EXCEPTION
            'Class not found: %',
            p_class_code;

    END IF;


    INSERT INTO class_curriculum (
        institute_id,
        class_id,
        subject_id,
        is_required,
        is_optional,
        sort_order
    )
    VALUES (
        p_institute_id,
        v_class_id,
        p_subject_id,
        NOT p_optional,
        p_optional,
        p_sort_order
    )

    ON CONFLICT (
        institute_id,
        class_id,
        subject_id
    )

    DO UPDATE SET
        is_required =
            EXCLUDED.is_required,

        is_optional =
            EXCLUDED.is_optional,

        sort_order =
            EXCLUDED.sort_order,

        status =
            'active',

        updated_at =
            CURRENT_TIMESTAMP;

END;
$$;


-- ============================================================
-- 6. DARUL QURAN CURRICULUM
-- ============================================================

DO $$
DECLARE

    v_institute UUID :=
        '7cb955e3-45a7-41f3-81a3-f00cf2ab5973';

    v_subject UUID;

BEGIN


-- ============================================================
-- 01. RAWDATUL ATFAL
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'NURANI_ARABIC',
    'language',
    'নূরানী আরবি',
    'Nurani Arabic',
    'العربية النورانية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'RAWDATUL_ATFAL',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_NESAB',
    'book',
    'নূরানী নেসাব',
    'Nurani Nisab',
    'النصاب النوراني'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'RAWDATUL_ATFAL',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_BANGLA',
    'language',
    'নূরানী বাংলা',
    'Nurani Bangla',
    'البنغالية النورانية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'RAWDATUL_ATFAL',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_MATH',
    'general',
    'নূরানী গণিত',
    'Nurani Mathematics',
    'الرياضيات النورانية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'RAWDATUL_ATFAL',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_ENGLISH_NURSERY',
    'language',
    'নূরানী ইংরেজি — নার্সারি',
    'Nurani English — Nursery',
    'الإنجليزية النورانية — الروضة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'RAWDATUL_ATFAL',
    v_subject,
    5
);


-- ============================================================
-- 02. IBTIDAIYYAH 1
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'NURANI_QAIDA',
    'book',
    'নূরানী কায়দা',
    'Nurani Qaida',
    'القاعدة النورانية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_1',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_NESAB_1',
    'book',
    'নূরানী নেসাব — ১ম শ্রেণি',
    'Nurani Nisab — Grade One',
    'النصاب النوراني — الصف الأول'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_1',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_BANGLA_1',
    'language',
    'নূরানী বাংলা — ১ম শ্রেণি',
    'Nurani Bangla — Grade One',
    'البنغالية النورانية — الصف الأول'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_1',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_MATH_1',
    'general',
    'নূরানী গণিত — ১ম শ্রেণি',
    'Nurani Mathematics — Grade One',
    'الرياضيات النورانية — الصف الأول'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_1',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_ENGLISH_1',
    'language',
    'নূরানী ইংরেজি — প্রথম খণ্ড',
    'Nurani English — Part One',
    'الإنجليزية النورانية — الجزء الأول'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_1',
    v_subject,
    5
);


-- ============================================================
-- 03. IBTIDAIYYAH 2
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'QURAN_NAZERA',
    'quran',
    'কুরআন মাজীদ নাযেরা',
    'Quran Nazera',
    'تلاوة القرآن الكريم نظراً'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_2',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'SHORT_SURAH_MEMORIZATION',
    'memorization',
    'নির্ধারিত ছোট সূরা মুখস্থ',
    'Selected Short Surah Memorization',
    'حفظ السور القصيرة المقررة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_2',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_NESAB_2',
    'book',
    'নূরানী নেসাব — ২য় খণ্ড',
    'Nurani Nisab — Part Two',
    'النصاب النوراني — الجزء الثاني'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_2',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_BANGLA_2',
    'language',
    'নূরানী বাংলা — ২য় শ্রেণি',
    'Nurani Bangla — Grade Two',
    'البنغالية النورانية — الصف الثاني'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_2',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_MATH_2',
    'general',
    'নূরানী গণিত — ২য় শ্রেণি',
    'Nurani Mathematics — Grade Two',
    'الرياضيات النورانية — الصف الثاني'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_2',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_ENGLISH_2',
    'language',
    'নূরানী ইংরেজি — দ্বিতীয় খণ্ড',
    'Nurani English — Part Two',
    'الإنجليزية النورانية — الجزء الثاني'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_2',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'GEOGRAPHY_SOCIAL_2',
    'general',
    'নূরানী ভূগোল ও সমাজ — ২য় শ্রেণি',
    'Geography and Social Studies — Grade Two',
    'الجغرافيا والدراسات الاجتماعية — الصف الثاني'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_2',
    v_subject,
    7
);


-- ============================================================
-- 04. IBTIDAIYYAH 3
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'SURAH_MULK_MEMORIZATION',
    'memorization',
    'সূরা মুলক মুখস্থ',
    'Surah Al-Mulk Memorization',
    'حفظ سورة الملك'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_3',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'SURAH_WAQIAH_MEMORIZATION',
    'memorization',
    'সূরা ওয়াকিয়াহ মুখস্থ',
    'Surah Al-Waqiah Memorization',
    'حفظ سورة الواقعة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_3',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'SURAH_YASIN_MEMORIZATION',
    'memorization',
    'সূরা ইয়াসীন মুখস্থ',
    'Surah Ya-Sin Memorization',
    'حفظ سورة يس'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_3',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_NESAB_3',
    'book',
    'নূরানী নেসাব — ৩য় খণ্ড',
    'Nurani Nisab — Part Three',
    'النصاب النوراني — الجزء الثالث'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_3',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_BANGLA_3',
    'language',
    'নূরানী বাংলা — ৩য় শ্রেণি',
    'Nurani Bangla — Grade Three',
    'البنغالية النورانية — الصف الثالث'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_3',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_MATH_3',
    'general',
    'নূরানী গণিত — ৩য় শ্রেণি',
    'Nurani Mathematics — Grade Three',
    'الرياضيات النورانية — الصف الثالث'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_3',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'NURANI_ENGLISH_3',
    'language',
    'নূরানী ইংরেজি — তৃতীয় খণ্ড',
    'Nurani English — Part Three',
    'الإنجليزية النورانية — الجزء الثالث'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_3',
    v_subject,
    7
);


v_subject := seed_ism_subject(
    v_institute,
    'GEOGRAPHY_SOCIAL',
    'general',
    'ভূগোল ও সমাজ',
    'Geography and Social Studies',
    'الجغرافيا والدراسات الاجتماعية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_3',
    v_subject,
    8
);


v_subject := seed_ism_subject(
    v_institute,
    'HISTORY',
    'general',
    'ইতিহাস',
    'History',
    'التاريخ'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_3',
    v_subject,
    9
);


v_subject := seed_ism_subject(
    v_institute,
    'GENERAL_KNOWLEDGE',
    'general',
    'সাধারণ জ্ঞান',
    'General Knowledge',
    'المعلومات العامة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_3',
    v_subject,
    10
);


v_subject := seed_ism_subject(
    v_institute,
    'LANGUAGE_STUDIES',
    'language',
    'ভাষা শিক্ষা',
    'Language Studies',
    'دراسة اللغة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_3',
    v_subject,
    11
);


-- Quran Nazera is also part of Ibtidaiyyah 3

SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'QURAN_NAZERA';

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_3',
    v_subject,
    12
);


-- ============================================================
-- 05. IBTIDAIYYAH 4
-- ============================================================

SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'QURAN_NAZERA';

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_4',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'TALIMUL_ISLAM_1_3',
    'book',
    'তালীমুল ইসলাম — ১ম থেকে ৩য় খণ্ড',
    'Talimul Islam — Parts 1–3',
    'تعليم الإسلام — الأجزاء ١–٣'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_4',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'ISLAMI_TAHZIB',
    'subject',
    'ইসলামী তাহযীব',
    'Islamic Etiquette and Culture',
    'الآداب والثقافة الإسلامية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_4',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'BANGLA_READING',
    'language',
    'বাংলা পাঠ',
    'Bangla Reading',
    'القراءة البنغالية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_4',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'BANGLA_GRAMMAR_COMPOSITION',
    'language',
    'বাংলা ব্যাকরণ ও রচনা',
    'Bangla Grammar and Composition',
    'قواعد اللغة البنغالية والإنشاء'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_4',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'PRIMARY_MATH_4',
    'general',
    'প্রাথমিক গণিত — ৪র্থ শ্রেণি',
    'Primary Mathematics — Grade Four',
    'الرياضيات الابتدائية — الصف الرابع'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_4',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'ENGLISH_GRAMMAR',
    'language',
    'ইংরেজি ও গ্রামার',
    'English and Grammar',
    'اللغة الإنجليزية وقواعدها'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_4',
    v_subject,
    7
);


v_subject := seed_ism_subject(
    v_institute,
    'GEOGRAPHY_SOCIAL_INTRO',
    'general',
    'ভূগোল ও সমাজ পরিচিতি',
    'Introduction to Geography and Society',
    'مقدمة في الجغرافيا والمجتمع'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_4',
    v_subject,
    8
);


v_subject := seed_ism_subject(
    v_institute,
    'HISTORY_READING',
    'general',
    'ইতিহাস পাঠ',
    'History Studies',
    'دراسة التاريخ'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_4',
    v_subject,
    9
);


v_subject := seed_ism_subject(
    v_institute,
    'PRIMARY_URDU',
    'language',
    'প্রাথমিক উর্দু পাঠ',
    'Primary Urdu',
    'اللغة الأردية الابتدائية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_4',
    v_subject,
    10
);


-- ============================================================
-- 06. IBTIDAIYYAH 5
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'QURAN_NAZERA_TAJWID',
    'quran',
    'কুরআন মাজীদ নাযেরা ও তাজবিদ',
    'Quran Nazera and Tajwid',
    'تلاوة القرآن الكريم والتجويد'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'TALIMUL_ISLAM_4',
    'book',
    'তালীমুল ইসলাম — ৪র্থ খণ্ড',
    'Talimul Islam — Part Four',
    'تعليم الإسلام — الجزء الرابع'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    2
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'ISLAMI_TAHZIB';

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'PRIMARY_ARABIC_LANGUAGE',
    'language',
    'আরবি ভাষার প্রাথমিক পাঠ',
    'Primary Arabic Language',
    'مبادئ اللغة العربية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'IDEAL_BANGLA_READING',
    'language',
    'আদর্শ বাংলা পাঠ',
    'Ideal Bangla Reading',
    'القراءة البنغالية النموذجية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'IDEAL_BANGLA_GRAMMAR',
    'language',
    'আদর্শ বাংলা ব্যাকরণ ও রচনা',
    'Ideal Bangla Grammar and Composition',
    'قواعد اللغة البنغالية والإنشاء النموذجي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'PRIMARY_MATH_5',
    'general',
    'প্রাথমিক গণিত — ৫ম শ্রেণি',
    'Primary Mathematics — Grade Five',
    'الرياضيات الابتدائية — الصف الخامس'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    7
);


v_subject := seed_ism_subject(
    v_institute,
    'MY_ENGLISH_BOOK',
    'book',
    'মাই ইংলিশ বুক',
    'My English Book',
    'كتاب اللغة الإنجليزية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    8
);


v_subject := seed_ism_subject(
    v_institute,
    'IDEAL_PRIMARY_ENGLISH_GRAMMAR',
    'book',
    'আইডিয়াল প্রাইমারি ইংলিশ গ্রামার',
    'Ideal Primary English Grammar',
    'قواعد اللغة الإنجليزية الابتدائية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    9
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'HISTORY_READING';

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    10
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'GEOGRAPHY_SOCIAL_INTRO';

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    11
);


v_subject := seed_ism_subject(
    v_institute,
    'AGRICULTURE',
    'general',
    'কৃষি শিক্ষা',
    'Agricultural Studies',
    'التربية الزراعية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    12,
    TRUE
);


v_subject := seed_ism_subject(
    v_institute,
    'COMPUTER_STUDIES',
    'general',
    'কম্পিউটার শিক্ষা',
    'Computer Studies',
    'دراسات الحاسوب'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'IBTIDAIYYAH_5',
    v_subject,
    13,
    TRUE
);


-- ============================================================
-- 07. MUTAWASSITAH 1
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'QURAN_STUDIES',
    'quran',
    'কুরআন মাজীদ ও কুরআন শিক্ষা',
    'Quran and Quranic Studies',
    'القرآن الكريم وعلومه'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_1',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'MIZAN',
    'book',
    'মীযান',
    'Mizan',
    'ميزان'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_1',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'SARF_PRIMARY',
    'book',
    'সরফের প্রাথমিক কিতাব',
    'Elementary Sarf',
    'مبادئ الصرف'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_1',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'ILMUS_SARF',
    'subject',
    'ইলমুস সরফ',
    'Ilm al-Sarf',
    'علم الصرف'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_1',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'ARABIC_LANGUAGE_LITERATURE',
    'language',
    'আরবি ভাষা ও সাহিত্য',
    'Arabic Language and Literature',
    'اللغة العربية وآدابها'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_1',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'ISLAMIC_HISTORY',
    'general',
    'ইসলামের ইতিহাস',
    'Islamic History',
    'التاريخ الإسلامي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_1',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'BANGLA_LITERATURE_GRAMMAR',
    'language',
    'বাংলা সাহিত্য ও ব্যাকরণ',
    'Bangla Literature and Grammar',
    'الأدب البنغالي وقواعد اللغة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_1',
    v_subject,
    7
);


v_subject := seed_ism_subject(
    v_institute,
    'LOWER_SECONDARY_MATH_6',
    'general',
    'নিম্ন মাধ্যমিক গণিত — ৬ষ্ঠ শ্রেণি',
    'Lower Secondary Mathematics — Grade Six',
    'رياضيات المرحلة المتوسطة — الصف السادس'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_1',
    v_subject,
    8
);


v_subject := seed_ism_subject(
    v_institute,
    'MY_ENGLISH_BOOK_6',
    'book',
    'মাই ইংলিশ বুক — পার্ট সিক্স',
    'My English Book — Part Six',
    'كتاب اللغة الإنجليزية — الجزء السادس'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_1',
    v_subject,
    9
);


v_subject := seed_ism_subject(
    v_institute,
    'IDEAL_JUNIOR_ENGLISH_GRAMMAR',
    'book',
    'আইডিয়াল জুনিয়র ইংলিশ গ্রামার',
    'Ideal Junior English Grammar',
    'قواعد اللغة الإنجليزية للمرحلة المتوسطة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_1',
    v_subject,
    10
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'AGRICULTURE';

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_1',
    v_subject,
    11,
    TRUE
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'COMPUTER_STUDIES';

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_1',
    v_subject,
    12,
    TRUE
);


-- ============================================================
-- 08. MUTAWASSITAH 2
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'SHARH_MIAT_AMIL',
    'book',
    'শরহে মিয়াতে আমিল',
    'Sharh Miat Amil',
    'شرح مائة عامل'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_2',
    v_subject,
    1
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'ILMUS_SARF';

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_2',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'MA_LA_BUDDA_MINHU',
    'book',
    'মা-লা-বুদ্দা মিনহু',
    'Ma La Budda Minhu',
    'ما لا بد منه'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_2',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'AL_FIQH_AL_MUYASSAR',
    'book',
    'আল-ফিকহুল মুইয়াসসার',
    'Al-Fiqh al-Muyassar',
    'الفقه الميسر'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_2',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'SIRAT_KHATAM_ANBIYA',
    'book',
    'সীরাতে খাতামুল আম্বিয়া',
    'Sirat Khatam al-Anbiya',
    'سيرة خاتم الأنبياء'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_2',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'RAWDATUL_ADAB',
    'book',
    'রওজাতুল আদব',
    'Rawdat al-Adab',
    'روضة الأدب'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_2',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'BANGLA_LITERATURE',
    'language',
    'বাংলা সাহিত্য',
    'Bangla Literature',
    'الأدب البنغالي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_2',
    v_subject,
    7
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'BANGLA_GRAMMAR_COMPOSITION';

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_2',
    v_subject,
    8
);


v_subject := seed_ism_subject(
    v_institute,
    'ENGLISH',
    'language',
    'ইংরেজি',
    'English',
    'اللغة الإنجليزية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_2',
    v_subject,
    9
);


v_subject := seed_ism_subject(
    v_institute,
    'MATHEMATICS',
    'general',
    'গণিত',
    'Mathematics',
    'الرياضيات'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_2',
    v_subject,
    10
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'AGRICULTURE';

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_2',
    v_subject,
    11,
    TRUE
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'COMPUTER_STUDIES';

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_2',
    v_subject,
    12,
    TRUE
);


-- ============================================================
-- 09. MUTAWASSITAH 3
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'HIDAYATUN_NAHW',
    'book',
    'হেদায়াতুন নাহু',
    'Hidayat al-Nahw',
    'هداية النحو'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_3',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'ILMUS_SIGHAH',
    'book',
    'ইলমুস সীগাহ',
    'Ilm al-Sighah',
    'علم الصيغة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_3',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'ADVANCED_SARF',
    'subject',
    'সরফের উচ্চতর অনুশীলন',
    'Advanced Sarf Practice',
    'التدريبات المتقدمة في الصرف'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_3',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'NURUL_IDAH',
    'book',
    'নূরুল ইযাহ',
    'Nur al-Idah',
    'نور الإيضاح'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_3',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'TARIKH_MILLAT',
    'book',
    'তারীখে মিল্লাত',
    'Tarikh-e-Millat',
    'تاريخ الملة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_3',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'TAISIR_MANTIQ',
    'book',
    'তাইসীরুল মানতিক / আল-মানতিক',
    'Taysir al-Mantiq / Al-Mantiq',
    'تيسير المنطق / المنطق'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_3',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'NAWAWI_SELECTED_HADITH',
    'book',
    'ইমাম নববী রহ.-এর নির্বাচিত হাদিস',
    'Selected Hadith of Imam al-Nawawi',
    'أحاديث مختارة للإمام النووي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_3',
    v_subject,
    7
);


v_subject := seed_ism_subject(
    v_institute,
    'QASASUN_NABIYYIN',
    'book',
    'কাসাসুন নাবিয়্যীন',
    'Qasas al-Nabiyyin',
    'قصص النبيين'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_3',
    v_subject,
    8
);


v_subject := seed_ism_subject(
    v_institute,
    'ARABIC_LITERATURE',
    'language',
    'আরবি সাহিত্য',
    'Arabic Literature',
    'الأدب العربي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_3',
    v_subject,
    9
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'BANGLA_LITERATURE_GRAMMAR';

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_3',
    v_subject,
    10
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'ENGLISH';

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_3',
    v_subject,
    11
);


v_subject := seed_ism_subject(
    v_institute,
    'LOWER_SECONDARY_MATH',
    'general',
    'নিম্ন মাধ্যমিক গণিত',
    'Lower Secondary Mathematics',
    'رياضيات المرحلة المتوسطة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'MUTAWASSITAH_3',
    v_subject,
    12
);


-- ============================================================
-- 10. SANABIYYAH AMMAH 1
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'TARJAMATUL_QURAN',
    'quran',
    'তরজমাতুল কুরআন',
    'Translation of the Quran',
    'ترجمة القرآن الكريم'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_1',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'MUKHTASAR_QUDURI',
    'book',
    'মুখতাসারুল কুদুরী',
    'Mukhtasar al-Quduri',
    'مختصر القدوري'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_1',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'KAFIYA_IBN_HAJIB',
    'book',
    'কাফিয়া ইবনুল হাজিব',
    'Al-Kafiyah of Ibn al-Hajib',
    'كافية ابن الحاجب'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_1',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'USUL_AL_SHASHI',
    'book',
    'উসূলুশ শাশী',
    'Usul al-Shashi',
    'أصول الشاشي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_1',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'ARABIC_FIQH_USUL',
    'subject',
    'আরবি ফিকহ ও উসূল',
    'Arabic Fiqh and Usul',
    'الفقه وأصوله'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_1',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'NAFAHATUL_ADAB',
    'book',
    'নাফহাতুল আদব',
    'Nafahat al-Adab',
    'نفحة الأدب'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_1',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'MUALLIMUL_INSHA_1',
    'book',
    'মুআল্লিমুল ইনশা — ১',
    'Muallim al-Insha — Part One',
    'معلم الإنشاء — الجزء الأول'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_1',
    v_subject,
    7
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'TARIKH_MILLAT';

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_1',
    v_subject,
    8
);


v_subject := seed_ism_subject(
    v_institute,
    'TALIMUL_MUTALLIM',
    'book',
    'তালীমুল মুতাআল্লিম',
    'Talim al-Mutaallim',
    'تعليم المتعلم'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_1',
    v_subject,
    9
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'BANGLA_LITERATURE';

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_1',
    v_subject,
    10
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'ENGLISH';

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_1',
    v_subject,
    11
);


-- ============================================================
-- 11. SANABIYYAH AMMAH 2 / KAFIYA
-- ============================================================

SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'KAFIYA_IBN_HAJIB';

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_2',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'KANZ_DAQAQIQ',
    'book',
    'কানযুদ দাকায়িক',
    'Kanz al-Daqaiq',
    'كنز الدقائق'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_2',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'NURUL_ANWAR',
    'book',
    'নূরুল আনওয়ার',
    'Nur al-Anwar',
    'نور الأنوار'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_2',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'DURUSUL_BALAGHAH',
    'book',
    'দুরূসুল বালাগাহ',
    'Durus al-Balaghah',
    'دروس البلاغة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_2',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'SHARH_JAMI',
    'book',
    'শরহে জামী',
    'Sharh Jami',
    'شرح جامي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_2',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'SHARH_TAHDHIB',
    'book',
    'শরহুত তাহযীব',
    'Sharh al-Tahdhib',
    'شرح التهذيب'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_2',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'ALFIYYATUL_HADITH',
    'book',
    'আলফিয়্যাতুল হাদিস',
    'Alfiyyat al-Hadith',
    'ألفية الحديث'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_2',
    v_subject,
    7
);


v_subject := seed_ism_subject(
    v_institute,
    'MUALLIMUL_INSHA_2',
    'book',
    'মুআল্লিমুল ইনশা — ২',
    'Muallim al-Insha — Part Two',
    'معلم الإنشاء — الجزء الثاني'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_2',
    v_subject,
    8
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'TARJAMATUL_QURAN';

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_2',
    v_subject,
    9
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'ARABIC_LITERATURE';

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_AMMAH_2',
    v_subject,
    10
);


-- ============================================================
-- 12. SANABIYYAH ULYA 1
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'HIDAYATUL_HIKMAH',
    'book',
    'হিদায়াতুল হিকমাহ',
    'Hidayat al-Hikmah',
    'هداية الحكمة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_1',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'MIBDHI',
    'book',
    'মীবযী / আল-মীবযী',
    'Al-Mibdhi',
    'الميبذي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_1',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'ISLAM_MODERN_ECONOMY_TRADE',
    'book',
    'ইসলাম আওর জাদীদ মাঈশাত ও তিজারাত',
    'Islam, Modern Economy and Trade',
    'الإسلام والاقتصاد والتجارة الحديثة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_1',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'MUALLAQAT_SAB',
    'book',
    'আল-মুআল্লাকাতুস সাবআ',
    'Al-Muallaqat al-Sab',
    'المعلقات السبع'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_1',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'DIWAN_HAMASAH',
    'book',
    'দিওয়ানুল হামাসাহ',
    'Diwan al-Hamasah',
    'ديوان الحماسة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_1',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'DIWAN_MUTANABBI',
    'book',
    'দিওয়ানুল মুতানাব্বী',
    'Diwan al-Mutanabbi',
    'ديوان المتنبي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_1',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'TARIQ_ILAL_INSHA',
    'book',
    'আত-তারীক ইলাল ইনশা',
    'Al-Tariq ila al-Insha',
    'الطريق إلى الإنشاء'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_1',
    v_subject,
    7
);


v_subject := seed_ism_subject(
    v_institute,
    'POLITICAL_SCIENCE',
    'general',
    'রাষ্ট্রবিজ্ঞান',
    'Political Science',
    'العلوم السياسية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_1',
    v_subject,
    8
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'ISLAMIC_HISTORY';

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_1',
    v_subject,
    9
);


-- ============================================================
-- 13. SANABIYYAH ULYA 2 / SHARH WIQAYAH
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'AL_HIDAYA_1',
    'book',
    'আল-হিদায়া — ১ম খণ্ড',
    'Al-Hidayah — Volume One',
    'الهداية — الجزء الأول'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_2',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'AL_HIDAYA_2',
    'book',
    'আল-হিদায়া — ২য় খণ্ড',
    'Al-Hidayah — Volume Two',
    'الهداية — الجزء الثاني'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_2',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'MUKHTASAR_MAANI',
    'book',
    'মুখতাসারুল মাআনী',
    'Mukhtasar al-Maani',
    'مختصر المعاني'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_2',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'ILMUL_BAYAN',
    'subject',
    'ইলমুল বায়ান',
    'Ilm al-Bayan',
    'علم البيان'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_2',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'ILMUL_BADI',
    'subject',
    'ইলমুল বাদী',
    'Ilm al-Badi',
    'علم البديع'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_2',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'AL_HUSAMI',
    'book',
    'আল-হুসামী',
    'Al-Husami',
    'الحسامي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_2',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'SULLAMUL_ULUM',
    'book',
    'সুল্লামুল উলূম',
    'Sullam al-Ulum',
    'سلم العلوم'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_2',
    v_subject,
    7
);


v_subject := seed_ism_subject(
    v_institute,
    'ARUDUL_MIFTAH',
    'book',
    'আরূযুল মিফতাহ',
    'Arud al-Miftah',
    'عروض المفتاح'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_2',
    v_subject,
    8
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'DIWAN_MUTANABBI';

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_2',
    v_subject,
    9
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'POLITICAL_SCIENCE';

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_2',
    v_subject,
    10
);


v_subject := seed_ism_subject(
    v_institute,
    'SOCIOLOGY',
    'general',
    'সমাজবিজ্ঞান',
    'Sociology',
    'علم الاجتماع'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'SANABIYYAH_ULYA_2',
    v_subject,
    11
);


-- ============================================================
-- 14. FAZILAT 1
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'TAFSIR_JALALAYN_1',
    'book',
    'তাফসীরে জালালাইন — ১ম খণ্ড',
    'Tafsir al-Jalalayn — Volume One',
    'تفسير الجلالين — الجزء الأول'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_1',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'TAFSIR_JALALAYN_2',
    'book',
    'তাফসীরে জালালাইন — ২য় খণ্ড',
    'Tafsir al-Jalalayn — Volume Two',
    'تفسير الجلالين — الجزء الثاني'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_1',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'AL_FAWZ_AL_KABIR',
    'book',
    'আল-ফাওযুল কাবীর',
    'Al-Fawz al-Kabir',
    'الفوز الكبير'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_1',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'AQIDAT_TAHAWI',
    'book',
    'আকীদাতুত তাহাবী',
    'Al-Aqidah al-Tahawiyyah',
    'العقيدة الطحاوية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_1',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'RIYADUS_SALIHIN',
    'book',
    'রিয়াদুস সালিহীন',
    'Riyad al-Salihin',
    'رياض الصالحين'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_1',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'MUSALLAM_AL_THUBUT',
    'book',
    'মুসল্লামুস সুবূত',
    'Musallam al-Thubut',
    'مسلم الثبوت'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_1',
    v_subject,
    6
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'MUALLAQAT_SAB';

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_1',
    v_subject,
    7
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'DIWAN_HAMASAH';

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_1',
    v_subject,
    8
);


v_subject := seed_ism_subject(
    v_institute,
    'ISLAMIC_ECONOMICS_BUSINESS',
    'general',
    'ইসলামী অর্থনীতি ও ব্যবসা-বাণিজ্য',
    'Islamic Economics and Business',
    'الاقتصاد الإسلامي والتجارة'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_1',
    v_subject,
    9
);


SELECT id INTO v_subject
FROM academic_subjects
WHERE institute_id = v_institute
AND subject_code = 'HIDAYATUL_HIKMAH';

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_1',
    v_subject,
    10
);


-- ============================================================
-- 15. FAZILAT 2 / MISHKAT
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'MISHKAT_1',
    'book',
    'মিশকাতুল মাসাবীহ — ১ম খণ্ড',
    'Mishkat al-Masabih — Volume One',
    'مشكاة المصابيح — الجزء الأول'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_2',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'MUQADDIMAT_AL_SHAYKH',
    'book',
    'মুকাদ্দিমাতুশ শায়খ',
    'Muqaddimat al-Shaykh',
    'مقدمة الشيخ'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_2',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'MISHKAT_2',
    'book',
    'মিশকাতুল মাসাবীহ — ২য় খণ্ড',
    'Mishkat al-Masabih — Volume Two',
    'مشكاة المصابيح — الجزء الثاني'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_2',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'TAFSIR_BAYDAWI',
    'book',
    'তাফসীরুল বায়যাবী',
    'Tafsir al-Baydawi',
    'تفسير البيضاوي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_2',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'AL_HIDAYA_3',
    'book',
    'আল-হিদায়া — ৩য় খণ্ড',
    'Al-Hidayah — Volume Three',
    'الهداية — الجزء الثالث'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_2',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'AL_HIDAYA_4',
    'book',
    'আল-হিদায়া — ৪র্থ খণ্ড',
    'Al-Hidayah — Volume Four',
    'الهداية — الجزء الرابع'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_2',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'SHARH_AQAID_NASAFI',
    'book',
    'শরহুল আকায়িদ আন-নাসাফিয়্যাহ',
    'Sharh al-Aqaid al-Nasafiyyah',
    'شرح العقائد النسفية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_2',
    v_subject,
    7
);


v_subject := seed_ism_subject(
    v_institute,
    'NUZHATUN_NAZAR',
    'book',
    'নুযহাতুন নাযার ফি তাওযীহি নুখবাতিল ফিকার',
    'Nuzhat al-Nazar fi Tawdih Nukhbat al-Fikar',
    'نزهة النظر في توضيح نخبة الفكر'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'FAZILAT_2',
    v_subject,
    8
);


-- ============================================================
-- 16. TAKMIL / DAWRAH AL-HADITH
-- ============================================================

v_subject := seed_ism_subject(
    v_institute,
    'SAHIH_BUKHARI',
    'book',
    'সহীহুল বুখারী',
    'Sahih al-Bukhari',
    'صحيح البخاري'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'TAKMIL',
    v_subject,
    1
);


v_subject := seed_ism_subject(
    v_institute,
    'SAHIH_MUSLIM',
    'book',
    'সহীহ মুসলিম',
    'Sahih Muslim',
    'صحيح مسلم'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'TAKMIL',
    v_subject,
    2
);


v_subject := seed_ism_subject(
    v_institute,
    'JAMI_TIRMIDHI',
    'book',
    'জামি আত-তিরমিযী',
    'Jami al-Tirmidhi',
    'سنن الترمذي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'TAKMIL',
    v_subject,
    3
);


v_subject := seed_ism_subject(
    v_institute,
    'SHAMAIL_TIRMIDHI',
    'book',
    'আশ-শামায়িলুত তিরমিযিয়্যাহ',
    'Al-Shamail al-Tirmidhiyyah',
    'الشمائل الترمذية'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'TAKMIL',
    v_subject,
    4
);


v_subject := seed_ism_subject(
    v_institute,
    'SUNAN_ABU_DAWUD',
    'book',
    'সুনানে আবু দাউদ',
    'Sunan Abi Dawud',
    'سنن أبي داود'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'TAKMIL',
    v_subject,
    5
);


v_subject := seed_ism_subject(
    v_institute,
    'SUNAN_NASAI',
    'book',
    'সুনানে নাসায়ী',
    'Sunan al-Nasai',
    'سنن النسائي'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'TAKMIL',
    v_subject,
    6
);


v_subject := seed_ism_subject(
    v_institute,
    'SUNAN_IBN_MAJAH',
    'book',
    'সুনানে ইবনে মাজাহ',
    'Sunan Ibn Majah',
    'سنن ابن ماجه'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'TAKMIL',
    v_subject,
    7
);


v_subject := seed_ism_subject(
    v_institute,
    'SHARH_MAANI_ATHAR',
    'book',
    'শরহু মাআনিল আসার',
    'Sharh Ma''ani al-Athar',
    'شرح معاني الآثار'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'TAKMIL',
    v_subject,
    8
);


v_subject := seed_ism_subject(
    v_institute,
    'MUWATTA_MALIK',
    'book',
    'মুআত্তা ইমাম মালিক',
    'Muwatta Imam Malik',
    'الموطأ للإمام مالك'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'TAKMIL',
    v_subject,
    9
);


v_subject := seed_ism_subject(
    v_institute,
    'MUWATTA_MUHAMMAD',
    'book',
    'মুআত্তা ইমাম মুহাম্মদ',
    'Muwatta Imam Muhammad',
    'الموطأ للإمام محمد'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'TAKMIL',
    v_subject,
    10
);


v_subject := seed_ism_subject(
    v_institute,
    'QURAN_TAJWID',
    'quran',
    'কুরআন মাজীদ ও তাজবিদ',
    'Quran and Tajwid',
    'القرآن الكريم والتجويد'
);

PERFORM seed_ism_curriculum(
    v_institute,
    'TAKMIL',
    v_subject,
    11
);


END $$;


-- ============================================================
-- 7. REMOVE TEMPORARY MIGRATION HELPERS
-- ============================================================

DROP FUNCTION IF EXISTS seed_ism_curriculum(
    UUID,
    VARCHAR,
    UUID,
    INTEGER,
    BOOLEAN
);


DROP FUNCTION IF EXISTS seed_ism_subject(
    UUID,
    VARCHAR,
    VARCHAR,
    VARCHAR,
    VARCHAR,
    VARCHAR
);


-- ============================================================
-- END OF MIGRATION 034
-- ============================================================
