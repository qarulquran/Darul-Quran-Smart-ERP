-- ============================================================
-- ISM Smart ERP
-- Migration: 021_create_exam_subjects_table.sql
--
-- Purpose:
-- Configure subjects inside each examination.
--
-- Supports:
-- - Subject-wise full marks
-- - Pass marks
-- - Written / practical marks
-- - Class-specific exam subjects
-- - Tenant-safe relationships
-- ============================================================

-- ============================================================
-- Supporting Composite Unique Constraints
-- ============================================================

ALTER TABLE exams
    ADD CONSTRAINT uq_exams_id_institute
    UNIQUE (id, institute_id);

ALTER TABLE subjects
    ADD CONSTRAINT uq_subjects_id_institute
    UNIQUE (id, institute_id);

-- classes already have:
-- UNIQUE (id, institute_id)
-- from migration 011.

-- ============================================================
-- Exam Subjects Table
-- ============================================================

CREATE TABLE IF NOT EXISTS exam_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Exam
    exam_id UUID NOT NULL,

    -- Subject
    subject_id UUID NOT NULL,

    -- Optional Class Scope
    class_id UUID,

    -- Marks Configuration
    full_marks NUMERIC(8, 2) NOT NULL,

    pass_marks NUMERIC(8, 2) NOT NULL,

    written_marks NUMERIC(8, 2),

    practical_marks NUMERIC(8, 2),

    -- Display Order
    sort_order INTEGER NOT NULL DEFAULT 0,

    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'active',

    -- Additional Configuration
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_exam_subjects_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_exam_subjects_exam
        FOREIGN KEY (exam_id, institute_id)
        REFERENCES exams(id, institute_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_exam_subjects_subject
        FOREIGN KEY (subject_id, institute_id)
        REFERENCES subjects(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_exam_subjects_class
        FOREIGN KEY (class_id, institute_id)
        REFERENCES classes(id, institute_id)
        ON DELETE RESTRICT,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT exam_subjects_full_marks_check
        CHECK (
            full_marks > 0
        ),

    CONSTRAINT exam_subjects_pass_marks_check
        CHECK (
            pass_marks >= 0
            AND pass_marks <= full_marks
        ),

    CONSTRAINT exam_subjects_written_marks_check
        CHECK (
            written_marks IS NULL
            OR written_marks >= 0
        ),

    CONSTRAINT exam_subjects_practical_marks_check
        CHECK (
            practical_marks IS NULL
            OR practical_marks >= 0
        ),

    CONSTRAINT exam_subjects_component_marks_check
        CHECK (
            written_marks IS NULL
            OR practical_marks IS NULL
            OR written_marks + practical_marks <= full_marks
        ),

    CONSTRAINT exam_subjects_sort_order_check
        CHECK (
            sort_order >= 0
        ),

    CONSTRAINT exam_subjects_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'archived'
            )
        ),

    -- A subject should appear only once in an exam.
    CONSTRAINT uq_exam_subjects_exam_subject
        UNIQUE (
            institute_id,
            exam_id,
            subject_id
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_exam_subjects_institute
    ON exam_subjects(institute_id);

CREATE INDEX IF NOT EXISTS idx_exam_subjects_exam
    ON exam_subjects(exam_id);

CREATE INDEX IF NOT EXISTS idx_exam_subjects_subject
    ON exam_subjects(subject_id);

CREATE INDEX IF NOT EXISTS idx_exam_subjects_class
    ON exam_subjects(class_id);

CREATE INDEX IF NOT EXISTS idx_exam_subjects_status
    ON exam_subjects(status);

CREATE INDEX IF NOT EXISTS idx_exam_subjects_institute_exam
    ON exam_subjects(
        institute_id,
        exam_id
    );

CREATE INDEX IF NOT EXISTS idx_exam_subjects_institute_subject
    ON exam_subjects(
        institute_id,
        subject_id
    );

CREATE INDEX IF NOT EXISTS idx_exam_subjects_exam_sort
    ON exam_subjects(
        exam_id,
        sort_order
    );

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE exam_subjects IS
'Subject and marks configuration for examinations in ISM Smart ERP.';

COMMENT ON COLUMN exam_subjects.institute_id IS
'Institute/tenant that owns the exam subject configuration.';

COMMENT ON COLUMN exam_subjects.exam_id IS
'Examination to which the subject belongs.';

COMMENT ON COLUMN exam_subjects.subject_id IS
'Subject included in the examination.';

COMMENT ON COLUMN exam_subjects.class_id IS
'Optional class associated with this exam subject configuration.';

COMMENT ON COLUMN exam_subjects.full_marks IS
'Maximum marks available for the subject.';

COMMENT ON COLUMN exam_subjects.pass_marks IS
'Minimum marks required to pass the subject.';

COMMENT ON COLUMN exam_subjects.written_marks IS
'Optional written component maximum marks.';

COMMENT ON COLUMN exam_subjects.practical_marks IS
'Optional practical component maximum marks.';

COMMENT ON COLUMN exam_subjects.settings IS
'Flexible exam-subject configuration for future grading features.';
