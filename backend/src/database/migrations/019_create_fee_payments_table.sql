-- ============================================================
-- ISM Smart ERP
-- Migration: 019_create_fee_payments_table.sql
--
-- Purpose:
-- Store payments received against student fee assignments.
--
-- Supports:
-- - Full payments
-- - Partial payments
-- - Multiple payments against one fee
-- - Receipts
-- - Cash / bank / mobile banking / online payments
-- - Tenant-safe relationships
-- ============================================================

-- ============================================================
-- Supporting Composite Unique Constraint
-- ============================================================

-- Required for tenant-safe Student Fee relationship.
ALTER TABLE student_fees
    ADD CONSTRAINT uq_student_fees_id_institute
    UNIQUE (id, institute_id);

-- ============================================================
-- Fee Payments Table
-- ============================================================

CREATE TABLE IF NOT EXISTS fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tenant / Institute
    institute_id UUID NOT NULL,

    -- Student Fee Assignment
    student_fee_id UUID NOT NULL,

    -- Student
    student_id UUID NOT NULL,

    -- Payment Identity
    receipt_number VARCHAR(100) NOT NULL,

    -- Financial Information
    amount NUMERIC(12, 2) NOT NULL,

    payment_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Payment Method
    payment_method VARCHAR(30) NOT NULL DEFAULT 'cash',

    -- Optional Transaction / Reference Information
    transaction_reference VARCHAR(255),

    bank_name VARCHAR(150),
    account_reference VARCHAR(150),

    -- Payment Status
    status VARCHAR(30) NOT NULL DEFAULT 'completed',

    -- Institute member who received/recorded payment
    received_by UUID,

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

    CONSTRAINT fk_fee_payments_institute
        FOREIGN KEY (institute_id)
        REFERENCES institutes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_fee_payments_student_fee
        FOREIGN KEY (student_fee_id, institute_id)
        REFERENCES student_fees(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_fee_payments_student
        FOREIGN KEY (student_id, institute_id)
        REFERENCES students(id, institute_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_fee_payments_received_by
        FOREIGN KEY (received_by, institute_id)
        REFERENCES institute_users(id, institute_id)
        ON DELETE RESTRICT,

    -- ========================================================
    -- Validation
    -- ========================================================

    CONSTRAINT fee_payments_amount_check
        CHECK (
            amount > 0
        ),

    CONSTRAINT fee_payments_method_check
        CHECK (
            payment_method IN (
                'cash',
                'bank_transfer',
                'card',
                'mobile_banking',
                'online',
                'cheque',
                'other'
            )
        ),

    CONSTRAINT fee_payments_status_check
        CHECK (
            status IN (
                'pending',
                'completed',
                'failed',
                'cancelled',
                'refunded'
            )
        ),

    -- Receipt numbers are unique within each institute.
    CONSTRAINT uq_fee_payments_institute_receipt
        UNIQUE (
            institute_id,
            receipt_number
        )
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_fee_payments_institute
    ON fee_payments(institute_id);

CREATE INDEX IF NOT EXISTS idx_fee_payments_student_fee
    ON fee_payments(student_fee_id);

CREATE INDEX IF NOT EXISTS idx_fee_payments_student
    ON fee_payments(student_id);

CREATE INDEX IF NOT EXISTS idx_fee_payments_payment_date
    ON fee_payments(payment_date);

CREATE INDEX IF NOT EXISTS idx_fee_payments_status
    ON fee_payments(status);

CREATE INDEX IF NOT EXISTS idx_fee_payments_method
    ON fee_payments(payment_method);

CREATE INDEX IF NOT EXISTS idx_fee_payments_received_by
    ON fee_payments(received_by);

CREATE INDEX IF NOT EXISTS idx_fee_payments_institute_student
    ON fee_payments(
        institute_id,
        student_id
    );

CREATE INDEX IF NOT EXISTS idx_fee_payments_institute_date
    ON fee_payments(
        institute_id,
        payment_date
    );

CREATE INDEX IF NOT EXISTS idx_fee_payments_institute_status
    ON fee_payments(
        institute_id,
        status
    );

CREATE INDEX IF NOT EXISTS idx_fee_payments_institute_student_fee
    ON fee_payments(
        institute_id,
        student_fee_id
    );

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON TABLE fee_payments IS
'Payments received against student fee assignments in ISM Smart ERP.';

COMMENT ON COLUMN fee_payments.institute_id IS
'Institute/tenant that owns the payment record.';

COMMENT ON COLUMN fee_payments.student_fee_id IS
'Student fee assignment against which this payment was received.';

COMMENT ON COLUMN fee_payments.student_id IS
'Student for whom the payment was received.';

COMMENT ON COLUMN fee_payments.receipt_number IS
'Institute-specific unique receipt number.';

COMMENT ON COLUMN fee_payments.amount IS
'Amount received in this individual payment transaction.';

COMMENT ON COLUMN fee_payments.payment_date IS
'Date and time when the payment was received.';

COMMENT ON COLUMN fee_payments.payment_method IS
'Method used for payment: cash, bank transfer, card, mobile banking, online, cheque, or other.';

COMMENT ON COLUMN fee_payments.transaction_reference IS
'External transaction/reference identifier when applicable.';

COMMENT ON COLUMN fee_payments.status IS
'Payment transaction status.';

COMMENT ON COLUMN fee_payments.received_by IS
'Institute membership that received or recorded the payment.';

COMMENT ON COLUMN fee_payments.metadata IS
'Flexible additional payment information.';
