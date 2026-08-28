-- ============================================================
-- ISM Smart ERP
-- Migration: 014_add_subject_academic_foreign_keys.sql
--
-- Purpose:
-- Add tenant-safe relationships from subjects
-- to classes and teachers.
--
-- This prevents a subject belonging to one institute
-- from being linked to a class or teacher belonging
-- to another institute.
-- ============================================================

-- ============================================================
-- Supporting Unique Constraint for Teachers
-- ============================================================

-- Required for the composite foreign key:
-- (teacher_id, institute_id)
ALTER TABLE teachers
    ADD CONSTRAINT uq_teachers_id_institute
    UNIQUE (id, institute_id);

-- classes already received the required
-- UNIQUE (id, institute_id) constraint in migration 011.

-- ============================================================
-- Subject -> Class Relationship
-- ============================================================

ALTER TABLE subjects
    ADD CONSTRAINT fk_subjects_class
    FOREIGN KEY (class_id, institute_id)
    REFERENCES classes(id, institute_id)
    ON DELETE SET NULL;

-- ============================================================
-- Subject -> Teacher Relationship
-- ============================================================

ALTER TABLE subjects
    ADD CONSTRAINT fk_subjects_teacher
    FOREIGN KEY (teacher_id, institute_id)
    REFERENCES teachers(id, institute_id)
    ON DELETE SET NULL;

-- ============================================================
-- Tenant-Aware Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_subjects_institute_class
    ON subjects(institute_id, class_id);

CREATE INDEX IF NOT EXISTS idx_subjects_institute_teacher
    ON subjects(institute_id, teacher_id);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON CONSTRAINT fk_subjects_class ON subjects IS
'Ensures that the selected class belongs to the same institute as the subject.';

COMMENT ON CONSTRAINT fk_subjects_teacher ON subjects IS
'Ensures that the selected teacher belongs to the same institute as the subject.';
