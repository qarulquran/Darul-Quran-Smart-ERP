-- ============================================================
-- ISM Smart ERP
-- Migration: 011_add_student_academic_foreign_keys.sql
--
-- Purpose:
-- Connect students to classes and sections safely.
--
-- This migration runs after:
-- 008_create_students_table.sql
-- 009_create_classes_table.sql
-- 010_create_sections_table.sql
-- ============================================================

-- ============================================================
-- Supporting Unique Constraints
-- ============================================================

-- Needed so PostgreSQL can enforce that a class belongs
-- to the same institute as the student.
ALTER TABLE classes
    ADD CONSTRAINT uq_classes_id_institute
    UNIQUE (id, institute_id);

-- Needed so PostgreSQL can enforce that a section belongs
-- to the same institute as the student.
ALTER TABLE sections
    ADD CONSTRAINT uq_sections_id_institute
    UNIQUE (id, institute_id);

-- ============================================================
-- Student -> Class Relationship
-- ============================================================

ALTER TABLE students
    ADD CONSTRAINT fk_students_class
    FOREIGN KEY (class_id, institute_id)
    REFERENCES classes(id, institute_id)
    ON DELETE SET NULL;

-- ============================================================
-- Student -> Section Relationship
-- ============================================================

ALTER TABLE students
    ADD CONSTRAINT fk_students_section
    FOREIGN KEY (section_id, institute_id)
    REFERENCES sections(id, institute_id)
    ON DELETE SET NULL;

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_students_class_id
    ON students(class_id);

CREATE INDEX IF NOT EXISTS idx_students_section_id
    ON students(section_id);

CREATE INDEX IF NOT EXISTS idx_students_institute_class
    ON students(institute_id, class_id);

CREATE INDEX IF NOT EXISTS idx_students_institute_section
    ON students(institute_id, section_id);

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON CONSTRAINT fk_students_class ON students IS
'Ensures the selected class belongs to the same institute as the student.';

COMMENT ON CONSTRAINT fk_students_section ON students IS
'Ensures the selected section belongs to the same institute as the student.';
