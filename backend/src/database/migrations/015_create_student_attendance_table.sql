-- ============================================================
-- ISM Smart ERP
-- Migration: 015_create_student_attendance_table.sql
--
-- Purpose:
-- Create tenant-safe daily student attendance records.
--
-- Each attendance record belongs to one institute and
-- records the student, class/section, date, status,
-- and the institute member who recorded it.
-- ============================================================

-- ============================================================
-- Supporting Composite Unique Constraints
-- ============================================================

-- Required for tenant-safe Student -> Institute relationship.
ALTER TABLE students
    ADD CONSTRAINT uq_students_id_institute
    UNIQUE (id, institute_id);

-- Required so recorded_by can be verified as a member
-- of the same institute.
ALTER TABLE institute_users
    ADD CONSTRAINT uq_institute_users_id_institute
    UNIQUE (id, institute_id);

-- classes and sections already have:
-- UNIQUE (id, institute_id)
-- from migration 011.

-- ============================================================
-- Student Attendance Table
-- ============================================================

CREATE TABLE IF NOT EXISTS student_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Student
    student_id UUID NOT NULL,

    -- Academic Context
    class_id UUID,
    section_id UUID,
    academic_year VARCHAR(20),

    -- Attendance Information
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,

    status VARCHAR(30) NOT NULL DEFAULT 'present',

    check_in_time TIME,
    remarks TEXT,

    -- Institute member who recorded the attendance
    recorded_by UUID,

    -- Additional Flexible Information
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_student_attendance_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_student_attendance_student
        FOREIGN KEY (student_id, institute_id)
        REFERENCES students(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_attendance_class
        FOREIGN KEY (class_id, institute_id)
        REFERENCES classes(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_attendance_section
        FOREIGN KEY (section_id, institute_id)
        REFERENCES sections(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_attendance_recorded_by
        FOREIGN KEY (recorded_by, institute_id)
        REFERENCES institute_users(id, institute_id)
        ON DELETE RESTRICT,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT student_attendance_status_check
        CHECK (
            status IN (
                'present',
                'absent',
                'late',
                'leave',
                'excused'
            )
        ),

    -- One daily attendance record per student.
    CONSTRAINT uq_student_attendance_daily
        UNIQUE (
            institute_id,
            student_id,
            attendance_date
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_student_attendance_institute
    ON student_attendance(institute_id);

CREATE INDEX IF NOT EXISTS idx_student_attendance_student
    ON student_attendance(student_id);

CREATE INDEX IF NOT EXISTS idx_student_attendance_date
    ON student_attendance(attendance_date);

CREATE INDEX IF NOT EXISTS idx_student_attendance_status
    ON student_attendance(status);

CREATE INDEX IF NOT EXISTS idx_student_attendance_institute_date
    ON student_attendance(institute_id, attendance_date);

CREATE INDEX IF NOT EXISTS idx_student_attendance_institute_class_date
    ON student_attendance(
        institute_id,
        class_id,
        attendance_date
    );

CREATE INDEX IF NOT EXISTS idx_student_attendance_institute_section_date
    ON student_attendance(
        institute_id,
        section_id,
        attendance_date
    );

CREATE INDEX IF NOT EXISTS idx_student_attendance_recorded_by
    ON student_attendance(recorded_by);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE student_attendance IS
'Daily student attendance records for institutes in ISM Smart ERP.';

COMMENT ON COLUMN student_attendance.institute_id IS
'Institute/tenant that owns the attendance record.';

COMMENT ON COLUMN student_attendance.student_id IS
'Student whose attendance is being recorded.';

COMMENT ON COLUMN student_attendance.class_id IS
'Class of the student at the time attendance was recorded.';

COMMENT ON COLUMN student_attendance.section_id IS
'Section of the student at the time attendance was recorded.';

COMMENT ON COLUMN student_attendance.attendance_date IS
'Date for which attendance was recorded.';

COMMENT ON COLUMN student_attendance.status IS
'Attendance status: present, absent, late, leave, or excused.';

COMMENT ON COLUMN student_attendance.recorded_by IS
'Institute membership that recorded the attendance.';

COMMENT ON COLUMN student_attendance.metadata IS
'Flexible additional attendance information.';
