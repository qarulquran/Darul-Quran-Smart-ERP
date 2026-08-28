
-- ============================================================
-- ISM Smart ERP
-- Migration: 029_create_default_roles_function.sql
--
-- Purpose:
-- Create a reusable PostgreSQL function that installs
-- the default RBAC roles and permissions for an institute.
--
-- Default Roles:
-- 1. Admin
-- 2. Teacher
-- 3. Accountant
-- 4. Student
--
-- Usage:
-- SELECT create_default_institute_roles('<institute-uuid>');
-- ============================================================

CREATE OR REPLACE FUNCTION create_default_institute_roles(
    p_institute_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_admin_role_id UUID;
    v_teacher_role_id UUID;
    v_accountant_role_id UUID;
    v_student_role_id UUID;
BEGIN

    -- ========================================================
    -- Validate Institute
    -- ========================================================

    IF NOT EXISTS (
        SELECT 1
        FROM institutes
        WHERE id = p_institute_id
    ) THEN
        RAISE EXCEPTION
            'Institute not found: %',
            p_institute_id;
    END IF;

    -- ========================================================
    -- ADMIN ROLE
    -- ========================================================

    INSERT INTO roles (
        institute_id,
        name,
        name_bn,
        name_ar,
        code,
        description,
        is_system_role,
        status
    )
    VALUES (
        p_institute_id,
        'Admin',
        'অ্যাডমিন',
        'مدير النظام',
        'admin',
        'Full institute administration role',
        TRUE,
        'active'
    )
    ON CONFLICT (institute_id, code)
    DO UPDATE SET
        name = EXCLUDED.name,
        name_bn = EXCLUDED.name_bn,
        name_ar = EXCLUDED.name_ar,
        description = EXCLUDED.description,
        is_system_role = TRUE,
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
    RETURNING id
    INTO v_admin_role_id;

    -- Admin receives every permission in the catalog.

    INSERT INTO role_permissions (
        role_id,
        permission_id,
        granted_by
    )
    SELECT
        v_admin_role_id,
        p.id,
        NULL
    FROM permissions p
    ON CONFLICT (role_id, permission_id)
    DO NOTHING;

    -- ========================================================
    -- TEACHER ROLE
    -- ========================================================

    INSERT INTO roles (
        institute_id,
        name,
        name_bn,
        name_ar,
        code,
        description,
        is_system_role,
        status
    )
    VALUES (
        p_institute_id,
        'Teacher',
        'শিক্ষক',
        'معلم',
        'teacher',
        'Default academic teacher role',
        TRUE,
        'active'
    )
    ON CONFLICT (institute_id, code)
    DO UPDATE SET
        name = EXCLUDED.name,
        name_bn = EXCLUDED.name_bn,
        name_ar = EXCLUDED.name_ar,
        description = EXCLUDED.description,
        is_system_role = TRUE,
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
    RETURNING id
    INTO v_teacher_role_id;

    INSERT INTO role_permissions (
        role_id,
        permission_id,
        granted_by
    )
    SELECT
        v_teacher_role_id,
        p.id,
        NULL
    FROM permissions p
    WHERE p.code IN (
        'dashboard.view',

        'students.view',

        'academic_years.view',

        'classes.view',
        'sections.view',
        'subjects.view',

        'enrollments.view',

        'teacher_assignments.view',

        'attendance.view',
        'attendance.record',
        'attendance.update',

        'exams.view',

        'results.view',
        'results.create',
        'results.update',

        'certificates.view',

        'institute.view'
    )
    ON CONFLICT (role_id, permission_id)
    DO NOTHING;

    -- ========================================================
    -- ACCOUNTANT ROLE
    -- ========================================================

    INSERT INTO roles (
        institute_id,
        name,
        name_bn,
        name_ar,
        code,
        description,
        is_system_role,
        status
    )
    VALUES (
        p_institute_id,
        'Accountant',
        'হিসাবরক্ষক',
        'محاسب',
        'accountant',
        'Default institute accounting role',
        TRUE,
        'active'
    )
    ON CONFLICT (institute_id, code)
    DO UPDATE SET
        name = EXCLUDED.name,
        name_bn = EXCLUDED.name_bn,
        name_ar = EXCLUDED.name_ar,
        description = EXCLUDED.description,
        is_system_role = TRUE,
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
    RETURNING id
    INTO v_accountant_role_id;

    INSERT INTO role_permissions (
        role_id,
        permission_id,
        granted_by
    )
    SELECT
        v_accountant_role_id,
        p.id,
        NULL
    FROM permissions p
    WHERE p.code IN (
        'dashboard.view',

        'students.view',

        'academic_years.view',
        'classes.view',
        'sections.view',

        'fee_types.view',

        'fees.view',
        'fees.assign',
        'fees.update',
        'fees.collect',

        'payments.view',
        'payments.create',
        'payments.cancel',
        'payments.refund',

        'reports.view',
        'reports.export',

        'institute.view'
    )
    ON CONFLICT (role_id, permission_id)
    DO NOTHING;

    -- ========================================================
    -- STUDENT ROLE
    -- ========================================================

    INSERT INTO roles (
        institute_id,
        name,
        name_bn,
        name_ar,
        code,
        description,
        is_system_role,
        status
    )
    VALUES (
        p_institute_id,
        'Student',
        'শিক্ষার্থী',
        'طالب',
        'student',
        'Default student portal role',
        TRUE,
        'active'
    )
    ON CONFLICT (institute_id, code)
    DO UPDATE SET
        name = EXCLUDED.name,
        name_bn = EXCLUDED.name_bn,
        name_ar = EXCLUDED.name_ar,
        description = EXCLUDED.description,
        is_system_role = TRUE,
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
    RETURNING id
    INTO v_student_role_id;

    INSERT INTO role_permissions (
        role_id,
        permission_id,
        granted_by
    )
    SELECT
        v_student_role_id,
        p.id,
        NULL
    FROM permissions p
    WHERE p.code IN (
        'dashboard.view',

        'academic_years.view',

        'classes.view',
        'sections.view',
        'subjects.view',

        'attendance.view',

        'fees.view',
        'payments.view',

        'exams.view',
        'results.view',

        'certificates.view',

        'institute.view'
    )
    ON CONFLICT (role_id, permission_id)
    DO NOTHING;

END;
$$;

-- ============================================================
-- Documentation
-- ============================================================

COMMENT ON FUNCTION create_default_institute_roles(UUID) IS
'Creates or synchronizes the default Admin, Teacher, Accountant, and Student RBAC roles and their core permissions for one ISM Smart ERP institute.';
