-- ============================================================
-- ISM Smart ERP
-- Migration: 023_create_certificates_table.sql
--
-- Purpose:
-- Manage student certificates issued by institutes.
--
-- Supports:
-- - Transfer Certificate
-- - Character Certificate
-- - Completion Certificate
-- - Testimonial
-- - Academic Certificate
-- - Custom Certificate
-- - Public verification code
-- - Tenant-safe relationships
-- ============================================================

CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Student
    student_id UUID NOT NULL,

    -- Certificate Identity
    certificate_number VARCHAR(100) NOT NULL,

    certificate_type VARCHAR(50) NOT NULL,

    -- Multilingual Certificate Title
    title VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255),
    title_ar VARCHAR(255),

    -- Certificate Information
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,

    academic_year VARCHAR(20),

    -- Public Verification
    verification_code VARCHAR(150) NOT NULL,

    -- Optional Generated File
    file_url TEXT,

    -- Certificate Status
    status VARCHAR(30) NOT NULL DEFAULT 'issued',

    -- Institute member who issued the certificate
    issued_by UUID,

    -- Optional Cancellation / Revocation Information
    revoked_at TIMESTAMPTZ,
    revoked_by UUID,
    revocation_reason TEXT,

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

    CONSTRAINT fk_certificates_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_certificates_student
        FOREIGN KEY (student_id, institute_id)
        REFERENCES students(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_certificates_issued_by
        FOREIGN KEY (issued_by, institute_id)
        REFERENCES institute_users(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_certificates_revoked_by
        FOREIGN KEY (revoked_by, institute_id)
        REFERENCES institute_users(id, institute_id)
        ON DELETE RESTRICT,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT certificates_type_check
        CHECK (
            certificate_type IN (
                'transfer',
                'character',
                'completion',
                'testimonial',
                'academic',
                'custom'
            )
        ),

    CONSTRAINT certificates_status_check
        CHECK (
            status IN (
                'draft',
                'issued',
                'revoked',
                'cancelled',
                'archived'
            )
        ),

    CONSTRAINT certificates_revocation_check
        CHECK (
            status <> 'revoked'
            OR revoked_at IS NOT NULL
        ),

    -- Certificate number must be unique
    -- inside an institute.
    CONSTRAINT uq_certificates_institute_number
        UNIQUE (
            institute_id,
            certificate_number
        ),

    -- Verification code must be globally unique.
    CONSTRAINT uq_certificates_verification_code
        UNIQUE (
            verification_code
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_certificates_institute
    ON certificates(institute_id);

CREATE INDEX IF NOT EXISTS idx_certificates_student
    ON certificates(student_id);

CREATE INDEX IF NOT EXISTS idx_certificates_type
    ON certificates(certificate_type);

CREATE INDEX IF NOT EXISTS idx_certificates_issue_date
    ON certificates(issue_date);

CREATE INDEX IF NOT EXISTS idx_certificates_status
    ON certificates(status);

CREATE INDEX IF NOT EXISTS idx_certificates_issued_by
    ON certificates(issued_by);

CREATE INDEX IF NOT EXISTS idx_certificates_institute_student
    ON certificates(
        institute_id,
        student_id
    );

CREATE INDEX IF NOT EXISTS idx_certificates_institute_status
    ON certificates(
        institute_id,
        status
    );

CREATE INDEX IF NOT EXISTS idx_certificates_institute_type
    ON certificates(
        institute_id,
        certificate_type
    );

CREATE INDEX IF NOT EXISTS idx_certificates_institute_year
    ON certificates(
        institute_id,
        academic_year
    );

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE certificates IS
'Student certificates issued by institutes in ISM Smart ERP.';

COMMENT ON COLUMN certificates.institute_id IS
'Institute/tenant that owns and issued the certificate.';

COMMENT ON COLUMN certificates.student_id IS
'Student for whom the certificate was issued.';

COMMENT ON COLUMN certificates.certificate_number IS
'Institute-specific unique certificate number.';

COMMENT ON COLUMN certificates.certificate_type IS
'Type of certificate such as transfer, character, completion, testimonial, academic, or custom.';

COMMENT ON COLUMN certificates.title IS
'Primary certificate title.';

COMMENT ON COLUMN certificates.title_bn IS
'Certificate title in Bangla.';

COMMENT ON COLUMN certificates.title_ar IS
'Certificate title in Arabic.';

COMMENT ON COLUMN certificates.verification_code IS
'Globally unique code used to verify certificate authenticity.';

COMMENT ON COLUMN certificates.file_url IS
'Optional location of the generated certificate PDF or document.';

COMMENT ON COLUMN certificates.issued_by IS
'Institute membership that issued the certificate.';

COMMENT ON COLUMN certificates.revoked_by IS
'Institute membership that revoked the certificate when applicable.';

COMMENT ON COLUMN certificates.revocation_reason IS
'Reason for revoking the certificate.';

COMMENT ON COLUMN certificates.metadata IS
'Flexible additional certificate information.';
