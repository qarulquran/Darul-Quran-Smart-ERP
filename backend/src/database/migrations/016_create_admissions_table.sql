-- ============================================================
-- ISM Smart ERP
-- Migration: 016_create_admissions_table.sql
--
-- Purpose:
-- Store tenant-safe student admission history.
--
-- A student may have multiple admission/re-admission records
-- across academic years while preserving historical data.
-- ============================================================

CREATE TABLE IF NOT EXISTS admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Student
    student_id UUID NOT NULL,

    -- Admission Identity
    admission_number VARCHAR(100) NOT NULL,

    -- Admission Information
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    academic_year VARCHAR(20) NOT NULL,

    -- Academic Placement
    class_id UUID,
    section_id UUID,

    -- Previous Education
    previous_institute VARCHAR(255),
    previous_class VARCHAR(150),

    -- Financial Information
    admission_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,

    -- Documents submitted during admission.
    -- Example:
    -- [
    --   {"type": "birth_certificate", "file_url": "..."},
    --   {"type": "photo", "file_url": "..."}
    -- ]
    documents JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Admission Status
    status VARCHAR(30) NOT NULL DEFAULT 'active',

    -- Optional Notes
    remarks TEXT,

    -- Institute member who created the admission record
    created_by UUID,

    -- Additional Flexible Information
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_admissions_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_admissions_student
        FOREIGN KEY (student_id, institute_id)
        REFERENCES students(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_admissions_class
        FOREIGN KEY (class_id, institute_id)
        REFERENCES classes(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_admissions_section
        FOREIGN KEY (section_id, institute_id)
        REFERENCES sections(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_admissions_created_by
        FOREIGN KEY (created_by, institute_id)
        REFERENCES institute_users(id, institute_id)
        ON DELETE RESTRICT,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT admissions_fee_check
        CHECK (
            admission_fee >= 0
        ),

    CONSTRAINT admissions_status_check
        CHECK (
            status IN (
                'pending',
                'active',
                'cancelled',
                'rejected',
                'completed',
                'archived'
            )
        ),

    CONSTRAINT admissions_documents_array_check
        CHECK (
            jsonb_typeof(documents) = 'array'
        ),

    -- Admission number must be unique inside an institute.
    CONSTRAINT uq_admissions_institute_number
        UNIQUE (
            institute_id,
            admission_number
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_admissions_institute
    ON admissions(institute_id);

CREATE INDEX IF NOT EXISTS idx_admissions_student
    ON admissions(student_id);

CREATE INDEX IF NOT EXISTS idx_admissions_class
    ON admissions(class_id);

CREATE INDEX IF NOT EXISTS idx_admissions_section
    ON admissions(section_id);

CREATE INDEX IF NOT EXISTS idx_admissions_academic_year
    ON admissions(academic_year);

CREATE INDEX IF NOT EXISTS idx_admissions_admission_date
    ON admissions(admission_date);

CREATE INDEX IF NOT EXISTS idx_admissions_created_by
    ON admissions(created_by);

CREATE INDEX IF NOT EXISTS idx_admissions_institute_year
    ON admissions(
        institute_id,
        academic_year
    );

CREATE INDEX IF NOT EXISTS idx_admissions_institute_student
    ON admissions(
        institute_id,
        student_id
    );

CREATE INDEX IF NOT EXISTS idx_admissions_institute_status
    ON admissions(
        institute_id,
        status
    );

CREATE INDEX IF NOT EXISTS idx_admissions_institute_class_year
    ON admissions(
        institute_id,
        class_id,
        academic_year
    );

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE admissions IS
'Student admission and re-admission history for institutes in ISM Smart ERP.';

COMMENT ON COLUMN admissions.institute_id IS
'Institute/tenant that owns the admission record.';

COMMENT ON COLUMN admissions.student_id IS
'Student associated with the admission record.';

COMMENT ON COLUMN admissions.admission_number IS
'Institute-specific unique admission number.';

COMMENT ON COLUMN admissions.academic_year IS
'Academic year for which the student was admitted.';

COMMENT ON COLUMN admissions.class_id IS
'Class assigned at the time of admission.';

COMMENT ON COLUMN admissions.section_id IS
'Section assigned at the time of admission.';

COMMENT ON COLUMN admissions.admission_fee IS
'Admission fee amount recorded during admission.';

COMMENT ON COLUMN admissions.documents IS
'JSON array containing submitted admission document information.';

COMMENT ON COLUMN admissions.created_by IS
'Institute membership that created the admission record.';

COMMENT ON COLUMN admissions.metadata IS
'Flexible additional admission information.';
