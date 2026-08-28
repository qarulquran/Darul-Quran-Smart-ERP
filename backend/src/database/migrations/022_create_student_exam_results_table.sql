-- ============================================================
-- ISM Smart ERP
-- Migration: 022_create_student_exam_results_table.sql
--
-- Purpose:
-- Store subject-wise examination results for students.
--
-- Supports:
-- - Student marks
-- - Written / practical marks
-- - Grade and grade point
-- - Pass / fail / absent / withheld status
-- - Tenant-safe relationships
-- - Result entry audit information
-- ============================================================

-- ============================================================
-- Supporting Composite Unique Constraint
-- ============================================================

-- Required so that an exam subject can be linked together
-- with its exam and institute safely.
ALTER TABLE exam_subjects
    ADD CONSTRAINT uq_exam_subjects_id_exam_institute
    UNIQUE (
        id,
        exam_id,
        institute_id
    );

-- students already have:
-- UNIQUE (id, institute_id)
--
-- exams already have:
-- UNIQUE (id, institute_id)
--
-- institute_users already have:
-- UNIQUE (id, institute_id)

-- ============================================================
-- Student Exam Results Table
-- ============================================================

CREATE TABLE IF NOT EXISTS student_exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Student
    student_id UUID NOT NULL,

    -- Examination
    exam_id UUID NOT NULL,

    -- Exam Subject Configuration
    exam_subject_id UUID NOT NULL,

    -- Marks
    marks_obtained NUMERIC(8, 2),

    written_marks_obtained NUMERIC(8, 2),

    practical_marks_obtained NUMERIC(8, 2),

    -- Grade Information
    grade VARCHAR(20),

    grade_point NUMERIC(5, 2),

    -- Result Status
    result_status VARCHAR(30) NOT NULL DEFAULT 'pending',

    -- Optional Remarks
    remarks TEXT,

    -- Institute member who entered/updated the result
    entered_by UUID,

    -- Publication Information
    published_at TIMESTAMPTZ,

    -- Additional Flexible Information
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_student_exam_results_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_student_exam_results_student
        FOREIGN KEY (student_id, institute_id)
        REFERENCES students(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_exam_results_exam
        FOREIGN KEY (exam_id, institute_id)
        REFERENCES exams(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_exam_results_exam_subject
        FOREIGN KEY (
            exam_subject_id,
            exam_id,
            institute_id
        )
        REFERENCES exam_subjects(
            id,
            exam_id,
            institute_id
        )
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_exam_results_entered_by
        FOREIGN KEY (entered_by, institute_id)
        REFERENCES institute_users(id, institute_id)
        ON DELETE RESTRICT,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT student_exam_results_marks_check
        CHECK (
            marks_obtained IS NULL
            OR marks_obtained >= 0
        ),

    CONSTRAINT student_exam_results_written_marks_check
        CHECK (
            written_marks_obtained IS NULL
            OR written_marks_obtained >= 0
        ),

    CONSTRAINT student_exam_results_practical_marks_check
        CHECK (
            practical_marks_obtained IS NULL
            OR practical_marks_obtained >= 0
        ),

    CONSTRAINT student_exam_results_grade_point_check
        CHECK (
            grade_point IS NULL
            OR grade_point >= 0
        ),

    CONSTRAINT student_exam_results_status_check
        CHECK (
            result_status IN (
                'pending',
                'pass',
                'fail',
                'absent',
                'withheld',
                'cancelled'
            )
        ),

    -- A student can have only one result for
    -- each subject configuration in an examination.
    CONSTRAINT uq_student_exam_results_student_subject
        UNIQUE (
            institute_id,
            student_id,
            exam_subject_id
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_student_exam_results_institute
    ON student_exam_results(institute_id);

CREATE INDEX IF NOT EXISTS idx_student_exam_results_student
    ON student_exam_results(student_id);

CREATE INDEX IF NOT EXISTS idx_student_exam_results_exam
    ON student_exam_results(exam_id);

CREATE INDEX IF NOT EXISTS idx_student_exam_results_exam_subject
    ON student_exam_results(exam_subject_id);

CREATE INDEX IF NOT EXISTS idx_student_exam_results_status
    ON student_exam_results(result_status);

CREATE INDEX IF NOT EXISTS idx_student_exam_results_entered_by
    ON student_exam_results(entered_by);

CREATE INDEX IF NOT EXISTS idx_student_exam_results_institute_student
    ON student_exam_results(
        institute_id,
        student_id
    );

CREATE INDEX IF NOT EXISTS idx_student_exam_results_institute_exam
    ON student_exam_results(
        institute_id,
        exam_id
    );

CREATE INDEX IF NOT EXISTS idx_student_exam_results_student_exam
    ON student_exam_results(
        institute_id,
        student_id,
        exam_id
    );

CREATE INDEX IF NOT EXISTS idx_student_exam_results_exam_status
    ON student_exam_results(
        institute_id,
        exam_id,
        result_status
    );

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE student_exam_results IS
'Subject-wise examination results for students in ISM Smart ERP.';

COMMENT ON COLUMN student_exam_results.institute_id IS
'Institute/tenant that owns the student examination result.';

COMMENT ON COLUMN student_exam_results.student_id IS
'Student whose examination result is recorded.';

COMMENT ON COLUMN student_exam_results.exam_id IS
'Examination associated with this result.';

COMMENT ON COLUMN student_exam_results.exam_subject_id IS
'Exam subject configuration associated with this result.';

COMMENT ON COLUMN student_exam_results.marks_obtained IS
'Total marks obtained by the student for the subject.';

COMMENT ON COLUMN student_exam_results.written_marks_obtained IS
'Marks obtained in the written component when applicable.';

COMMENT ON COLUMN student_exam_results.practical_marks_obtained IS
'Marks obtained in the practical component when applicable.';

COMMENT ON COLUMN student_exam_results.grade IS
'Grade such as A+, A, B, C, D, or F according to institute grading rules.';

COMMENT ON COLUMN student_exam_results.grade_point IS
'Numeric grade point calculated according to institute grading rules.';

COMMENT ON COLUMN student_exam_results.result_status IS
'Result status: pending, pass, fail, absent, withheld, or cancelled.';

COMMENT ON COLUMN student_exam_results.entered_by IS
'Institute membership that entered or updated the result.';

COMMENT ON COLUMN student_exam_results.published_at IS
'Date and time when this result was published.';

COMMENT ON COLUMN student_exam_results.metadata IS
'Flexible additional result information.';
