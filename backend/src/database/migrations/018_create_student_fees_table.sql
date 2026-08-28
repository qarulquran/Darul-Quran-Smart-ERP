-- ============================================================
-- ISM Smart ERP
-- Migration: 018_create_student_fees_table.sql
--
-- Purpose:
-- Assign institute-specific fees to individual students.
--
-- This table records what a student is required to pay.
-- Actual payments and receipts will be stored separately.
-- ============================================================

-- ============================================================
-- Supporting Composite Unique Constraint
-- ============================================================

-- Required for tenant-safe Fee Type relationship.
ALTER TABLE fee_types
    ADD CONSTRAINT uq_fee_types_id_institute
    UNIQUE (id, institute_id);

-- students already have:
-- UNIQUE (id, institute_id)
-- from migration 015.

-- institute_users already have:
-- UNIQUE (id, institute_id)
-- from migration 015.

-- ============================================================
-- Student Fees Table
-- ============================================================

CREATE TABLE IF NOT EXISTS student_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Student
    student_id UUID NOT NULL,

    -- Fee Type
    fee_type_id UUID NOT NULL,

    -- Academic Information
    academic_year VARCHAR(20) NOT NULL,

    -- Optional Billing Period
    --
    -- Examples:
    -- 2026-01
    -- January
    -- Term-1
    -- Annual
    billing_period VARCHAR(100),

    -- Financial Information
    amount NUMERIC(12, 2) NOT NULL,

    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,

    payable_amount NUMERIC(12, 2)
        GENERATED ALWAYS AS (
            amount - discount_amount
        ) STORED,

    -- Due Information
    due_date DATE,

    -- Fee Status
    status VARCHAR(30) NOT NULL DEFAULT 'unpaid',

    -- Optional Notes
    remarks TEXT,

    -- Institute member who assigned the fee
    assigned_by UUID,

    -- Additional Flexible Information
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- System Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ========================================================
    -- Foreign Keys
    -- ========================================================

    CONSTRAINT fk_student_fees_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_student_fees_student
        FOREIGN KEY (student_id, institute_id)
        REFERENCES students(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_fees_fee_type
        FOREIGN KEY (fee_type_id, institute_id)
        REFERENCES fee_types(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_student_fees_assigned_by
        FOREIGN KEY (assigned_by, institute_id)
        REFERENCES institute_users(id, institute_id)
        ON DELETE RESTRICT,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT student_fees_amount_check
        CHECK (
            amount >= 0
        ),

    CONSTRAINT student_fees_discount_check
        CHECK (
            discount_amount >= 0
            AND discount_amount <= amount
        ),

    CONSTRAINT student_fees_status_check
        CHECK (
            status IN (
                'unpaid',
                'partial',
                'paid',
                'waived',
                'cancelled'
            )
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_student_fees_institute
    ON student_fees(institute_id);

CREATE INDEX IF NOT EXISTS idx_student_fees_student
    ON student_fees(student_id);

CREATE INDEX IF NOT EXISTS idx_student_fees_fee_type
    ON student_fees(fee_type_id);

CREATE INDEX IF NOT EXISTS idx_student_fees_academic_year
    ON student_fees(academic_year);

CREATE INDEX IF NOT EXISTS idx_student_fees_due_date
    ON student_fees(due_date);

CREATE INDEX IF NOT EXISTS idx_student_fees_status
    ON student_fees(status);

CREATE INDEX IF NOT EXISTS idx_student_fees_assigned_by
    ON student_fees(assigned_by);

CREATE INDEX IF NOT EXISTS idx_student_fees_institute_student
    ON student_fees(
        institute_id,
        student_id
    );

CREATE INDEX IF NOT EXISTS idx_student_fees_institute_year
    ON student_fees(
        institute_id,
        academic_year
    );

CREATE INDEX IF NOT EXISTS idx_student_fees_institute_status
    ON student_fees(
        institute_id,
        status
    );

CREATE INDEX IF NOT EXISTS idx_student_fees_institute_due_date
    ON student_fees(
        institute_id,
        due_date
    );

CREATE INDEX IF NOT EXISTS idx_student_fees_student_year
    ON student_fees(
        institute_id,
        student_id,
        academic_year
    );

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE student_fees IS
'Fees assigned to individual students in ISM Smart ERP.';

COMMENT ON COLUMN student_fees.institute_id IS
'Institute/tenant that owns the student fee record.';

COMMENT ON COLUMN student_fees.student_id IS
'Student to whom the fee has been assigned.';

COMMENT ON COLUMN student_fees.fee_type_id IS
'Institute-specific fee type assigned to the student.';

COMMENT ON COLUMN student_fees.academic_year IS
'Academic year for which the fee applies.';

COMMENT ON COLUMN student_fees.billing_period IS
'Optional billing period such as month, term, or annual period.';

COMMENT ON COLUMN student_fees.amount IS
'Original fee amount before discount.';

COMMENT ON COLUMN student_fees.discount_amount IS
'Discount or waiver amount applied to the fee.';

COMMENT ON COLUMN student_fees.payable_amount IS
'Automatically calculated amount after discount.';

COMMENT ON COLUMN student_fees.due_date IS
'Date by which the fee should be paid.';

COMMENT ON COLUMN student_fees.status IS
'Current fee status: unpaid, partial, paid, waived, or cancelled.';

COMMENT ON COLUMN student_fees.assigned_by IS
'Institute membership that assigned the fee.';

COMMENT ON COLUMN student_fees.metadata IS
'Flexible additional fee assignment information.';
