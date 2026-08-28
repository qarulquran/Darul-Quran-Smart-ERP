-- ============================================================
-- ISM Smart ERP
-- Migration: 027_fix_database_integrity_constraints.sql
--
-- Purpose:
-- Final integrity and tenant-isolation corrections
-- for the core ERP database schema.
--
-- Fixes:
-- 1. Student -> Class delete behavior
-- 2. Student -> Section delete behavior
-- 3. Subject -> Class delete behavior
-- 4. Subject -> Teacher delete behavior
-- 5. Section -> Class tenant isolation
-- 6. Prevent accidental deletion of referenced academic data
-- ============================================================


-- ============================================================
-- 1. Fix Student -> Class Relationship
-- ============================================================
--
-- Migration 011 used ON DELETE SET NULL on the composite
-- foreign key (class_id, institute_id).
--
-- Because institute_id is NOT NULL, deleting a class could
-- attempt to null both columns and fail.
--
-- RESTRICT is safer for ERP historical data.
-- ============================================================

ALTER TABLE students
    DROP CONSTRAINT IF EXISTS fk_students_class;

ALTER TABLE students
    ADD CONSTRAINT fk_students_class
    FOREIGN KEY (class_id, institute_id)
    REFERENCES classes(id, institute_id)
    ON DELETE RESTRICT;


-- ============================================================
-- 2. Fix Student -> Section Relationship
-- ============================================================

ALTER TABLE students
    DROP CONSTRAINT IF EXISTS fk_students_section;

ALTER TABLE students
    ADD CONSTRAINT fk_students_section
    FOREIGN KEY (section_id, institute_id)
    REFERENCES sections(id, institute_id)
    ON DELETE RESTRICT;


-- ============================================================
-- 3. Fix Subject -> Class Relationship
-- ============================================================
--
-- Migration 014 used ON DELETE SET NULL on the composite
-- relationship. Use RESTRICT so tenant identity and academic
-- history cannot be affected by an accidental delete.
-- ============================================================

ALTER TABLE subjects
    DROP CONSTRAINT IF EXISTS fk_subjects_class;

ALTER TABLE subjects
    ADD CONSTRAINT fk_subjects_class
    FOREIGN KEY (class_id, institute_id)
    REFERENCES classes(id, institute_id)
    ON DELETE RESTRICT;


-- ============================================================
-- 4. Fix Subject -> Teacher Relationship
-- ============================================================

ALTER TABLE subjects
    DROP CONSTRAINT IF EXISTS fk_subjects_teacher;

ALTER TABLE subjects
    ADD CONSTRAINT fk_subjects_teacher
    FOREIGN KEY (teacher_id, institute_id)
    REFERENCES teachers(id, institute_id)
    ON DELETE RESTRICT;


-- ============================================================
-- 5. Strengthen Section -> Class Tenant Isolation
-- ============================================================
--
-- Migration 010 links sections.class_id to classes.id.
-- That relationship alone does not prove that both records
-- belong to the same institute.
--
-- Replace it with a composite tenant-safe relationship.
-- ============================================================

ALTER TABLE sections
    DROP CONSTRAINT IF EXISTS fk_sections_class;

-- The original constraint may have been automatically named
-- by PostgreSQL if migration 010 did not explicitly name it.
ALTER TABLE sections
    DROP CONSTRAINT IF EXISTS sections_class_id_fkey;

ALTER TABLE sections
    ADD CONSTRAINT fk_sections_class
    FOREIGN KEY (class_id, institute_id)
    REFERENCES classes(id, institute_id)
    ON DELETE RESTRICT;


-- ============================================================
-- 6. Additional Tenant-Aware Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_sections_institute_class
    ON sections(
        institute_id,
        class_id
    );

CREATE INDEX IF NOT EXISTS idx_students_institute_class_section
    ON students(
        institute_id,
        class_id,
        section_id
    );

CREATE INDEX IF NOT EXISTS idx_subjects_institute_class_teacher
    ON subjects(
        institute_id,
        class_id,
        teacher_id
    );


-- ============================================================
-- 7. Documentation
-- ============================================================

COMMENT ON CONSTRAINT fk_students_class ON students IS
'Ensures the student class belongs to the same institute. Referenced classes cannot be accidentally deleted.';

COMMENT ON CONSTRAINT fk_students_section ON students IS
'Ensures the student section belongs to the same institute. Referenced sections cannot be accidentally deleted.';

COMMENT ON CONSTRAINT fk_subjects_class ON subjects IS
'Ensures the subject class belongs to the same institute. Referenced classes cannot be accidentally deleted.';

COMMENT ON CONSTRAINT fk_subjects_teacher ON subjects IS
'Ensures the subject teacher belongs to the same institute. Referenced teachers cannot be accidentally deleted.';

COMMENT ON CONSTRAINT fk_sections_class ON sections IS
'Ensures every section belongs to a class from the same institute.';
