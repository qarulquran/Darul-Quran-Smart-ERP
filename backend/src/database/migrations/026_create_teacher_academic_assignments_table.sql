-- ============================================================
-- ISM Smart ERP
-- Migration: 026_create_teacher_academic_assignments_table.sql
--
-- Purpose:
-- Store teacher academic assignments by academic year.
--
-- Supports:
-- - Teacher -> Class assignment
-- - Teacher -> Section assignment
-- - Teacher -> Subject assignment
-- - Class teacher assignment
-- - Academic-year history
-- - Tenant-safe relationships
-- ============================================================

CREATE TABLE IF NOT EXISTS teacher_academic_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Academic Year
    academic_year_id UUID NOT NULL,

    -- Teacher
    teacher_id UUID NOT NULL,

    -- Academic Placement
    class_id UUID NOT NULL,
    section_id UUID,

    -- Optional Subject
    subject_id UUID,

    -- Assignment Type
    assignment_type VARCHAR(30) NOT NULL DEFAULT 'subject_teacher',

    -- Effective Period
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,

    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'active',

    -- Institute member who created the assignment
    assigned_by UUID,

    -- Optional Notes
    remarks TEXT,

    -- Additional Flexible Information
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_teacher_assignments_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_teacher_assignments_academic_year
        FOREIGN KEY (academic_year_id, institute_id)
        REFERENCES academic_years(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_teacher_assignments_teacher
        FOREIGN KEY (teacher_id, institute_id)
        REFERENCES teachers(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_teacher_assignments_class
        FOREIGN KEY (class_id, institute_id)
        REFERENCES classes(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_teacher_assignments_section
        FOREIGN KEY (section_id, institute_id)
        REFERENCES sections(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_teacher_assignments_subject
        FOREIGN KEY (subject_id, institute_id)
        REFERENCES subjects(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_teacher_assignments_assigned_by
        FOREIGN KEY (assigned_by, institute_id)
        REFERENCES institute_users(id, institute_id)
        ON DELETE RESTRICT,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT teacher_assignments_type_check
        CHECK (
            assignment_type IN (
                'subject_teacher',
                'class_teacher',
                'assistant_teacher',
                'supervisor'
            )
        ),

    CONSTRAINT teacher_assignments_status_check
        CHECK (
            status IN (
                'active',
                'inactive',
                'completed',
                'cancelled',
                'archived'
            )
        ),

    CONSTRAINT teacher_assignments_date_check
        CHECK (
            end_date IS NULL
            OR end_date >= start_date
        ),

    CONSTRAINT teacher_assignments_subject_requirement_check
        CHECK (
            assignment_type <> 'subject_teacher'
            OR subject_id IS NOT NULL
        ),

    -- Prevent exact duplicate assignments.
    CONSTRAINT uq_teacher_academic_assignment
        UNIQUE (
            institute_id,
            academic_year_id,
            teacher_id,
            class_id,
            section_id,
            subject_id,
            assignment_type
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_institute
    ON teacher_academic_assignments(institute_id);

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_academic_year
    ON teacher_academic_assignments(academic_year_id);

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_teacher
    ON teacher_academic_assignments(teacher_id);

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_class
    ON teacher_academic_assignments(class_id);

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_section
    ON teacher_academic_assignments(section_id);

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_subject
    ON teacher_academic_assignments(subject_id);

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_status
    ON teacher_academic_assignments(status);

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_institute_year
    ON teacher_academic_assignments(
        institute_id,
        academic_year_id
    );

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_teacher_year
    ON teacher_academic_assignments(
        institute_id,
        academic_year_id,
        teacher_id
    );

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_class_year
    ON teacher_academic_assignments(
        institute_id,
        academic_year_id,
        class_id
    );

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_subject_year
    ON teacher_academic_assignments(
        institute_id,
        academic_year_id,
        subject_id
    );

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE teacher_academic_assignments IS
'Academic-year-based teacher, class, section, and subject assignments in ISM Smart ERP.';

COMMENT ON COLUMN teacher_academic_assignments.institute_id IS
'Institute/tenant that owns the teacher assignment.';

COMMENT ON COLUMN teacher_academic_assignments.academic_year_id IS
'Academic year for which the assignment applies.';

COMMENT ON COLUMN teacher_academic_assignments.teacher_id IS
'Teacher receiving the academic assignment.';

COMMENT ON COLUMN teacher_academic_assignments.class_id IS
'Class associated with the teacher assignment.';

COMMENT ON COLUMN teacher_academic_assignments.section_id IS
'Optional section associated with the teacher assignment.';

COMMENT ON COLUMN teacher_academic_assignments.subject_id IS
'Subject taught by the teacher when the assignment type requires a subject.';

COMMENT ON COLUMN teacher_academic_assignments.assignment_type IS
'Assignment type: subject_teacher, class_teacher, assistant_teacher, or supervisor.';

COMMENT ON COLUMN teacher_academic_assignments.assigned_by IS
'Institute membership that created the teacher assignment.';

COMMENT ON COLUMN teacher_academic_assignments.metadata IS
'Flexible additional teacher assignment information.';
