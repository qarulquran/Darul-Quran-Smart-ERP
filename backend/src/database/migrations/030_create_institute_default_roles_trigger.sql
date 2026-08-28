-- ============================================================
-- ISM Smart ERP
-- Migration: 030_create_institute_default_roles_trigger.sql
--
-- Purpose:
-- Automatically create the default institute-specific
-- RBAC roles whenever a new institute is created.
--
-- Depends on:
-- 029_create_default_roles_function.sql
-- ============================================================

-- ============================================================
-- Trigger Function
-- ============================================================

CREATE OR REPLACE FUNCTION
trigger_create_default_institute_roles()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    PERFORM create_default_institute_roles(NEW.id);

    RETURN NEW;

END;
$$;

-- ============================================================
-- Remove Old Trigger If It Exists
-- ============================================================

DROP TRIGGER IF EXISTS
trg_create_default_institute_roles
ON institutes;

-- ============================================================
-- Create Trigger
-- ============================================================

CREATE TRIGGER
trg_create_default_institute_roles
AFTER INSERT
ON institutes
FOR EACH ROW
EXECUTE FUNCTION
trigger_create_default_institute_roles();

-- ============================================================
-- Synchronize Existing Institutes
-- ============================================================

DO $$
DECLARE
    v_institute RECORD;
BEGIN

    FOR v_institute IN
        SELECT id
        FROM institutes
    LOOP

        PERFORM create_default_institute_roles(
            v_institute.id
        );

    END LOOP;

END;
$$;

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON FUNCTION
trigger_create_default_institute_roles()
IS
'Automatically installs the default ISM Smart ERP RBAC roles and permissions after a new institute is created.';

COMMENT ON TRIGGER
trg_create_default_institute_roles
ON institutes
IS
'Creates default Admin, Teacher, Accountant, and Student roles for every newly created institute.';
