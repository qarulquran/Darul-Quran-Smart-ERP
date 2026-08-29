-- ============================================================
-- ISM Smart ERP
-- Migration: 028_seed_core_permissions.sql
--
-- Purpose:
-- Seed the global permission catalog used by
-- Role-Based Access Control (RBAC).
--
-- Permission format:
-- module.action
-- ============================================================

INSERT INTO permissions (
    code,
    name,
    module,
    description
)
VALUES

-- Dashboard
(
    'dashboard.view',
    'View Dashboard',
    'dashboard',
    'View institute dashboard and summary information'
),

-- Students
(
    'students.view',
    'View Students',
    'students',
    'View student records'
),
(
    'students.create',
    'Create Students',
    'students',
    'Create new student records'
),
(
    'students.update',
    'Update Students',
    'students',
    'Update existing student records'
),
(
    'students.delete',
    'Delete Students',
    'students',
    'Delete student records'
),

-- Admissions
(
    'admissions.view',
    'View Admissions',
    'admissions',
    'View admission records'
),
(
    'admissions.create',
    'Create Admissions',
    'admissions',
    'Create student admission records'
),
(
    'admissions.update',
    'Update Admissions',
    'admissions',
    'Update admission records'
),
(
    'admissions.delete',
    'Delete Admissions',
    'admissions',
    'Delete admission records'
),

-- Teachers
(
    'teachers.view',
    'View Teachers',
    'teachers',
    'View teacher records'
),
(
    'teachers.create',
    'Create Teachers',
    'teachers',
    'Create teacher records'
),
(
    'teachers.update',
    'Update Teachers',
    'teachers',
    'Update teacher records'
),
(
    'teachers.delete',
    'Delete Teachers',
    'teachers',
    'Delete teacher records'
),

-- Academic Years
(
    'academic_years.view',
    'View Academic Years',
    'academic_years',
    'View academic year records'
),
(
    'academic_years.create',
    'Create Academic Years',
    'academic_years',
    'Create academic year records'
),
(
    'academic_years.update',
    'Update Academic Years',
    'academic_years',
    'Update academic year records'
),
(
    'academic_years.manage',
    'Manage Academic Years',
    'academic_years',
    'Manage current academic year and academic year status'
),

-- Classes
(
    'classes.view',
    'View Classes',
    'classes',
    'View class records'
),
(
    'classes.create',
    'Create Classes',
    'classes',
    'Create class records'
),
(
    'classes.update',
    'Update Classes',
    'classes',
    'Update class records'
),
(
    'classes.delete',
    'Delete Classes',
    'classes',
    'Delete class records'
),

-- Sections
(
    'sections.view',
    'View Sections',
    'sections',
    'View section records'
),
(
    'sections.create',
    'Create Sections',
    'sections',
    'Create section records'
),
(
    'sections.update',
    'Update Sections',
    'sections',
    'Update section records'
),
(
    'sections.delete',
    'Delete Sections',
    'sections',
    'Delete section records'
),

-- Subjects
(
    'subjects.view',
    'View Subjects',
    'subjects',
    'View subject records'
),
(
    'subjects.create',
    'Create Subjects',
    'subjects',
    'Create subject records'
),
(
    'subjects.update',
    'Update Subjects',
    'subjects',
    'Update subject records'
),
(
    'subjects.delete',
    'Delete Subjects',
    'subjects',
    'Delete subject records'
),

-- Student Enrollments
(
    'enrollments.view',
    'View Enrollments',
    'enrollments',
    'View student academic enrollment records'
),
(
    'enrollments.create',
    'Create Enrollments',
    'enrollments',
    'Enroll students into academic years and classes'
),
(
    'enrollments.update',
    'Update Enrollments',
    'enrollments',
    'Update student enrollment records'
),
(
    'enrollments.promote',
    'Promote Students',
    'enrollments',
    'Promote or repeat students between academic years'
),

-- Teacher Assignments
(
    'teacher_assignments.view',
    'View Teacher Assignments',
    'teacher_assignments',
    'View teacher academic assignments'
),
(
    'teacher_assignments.create',
    'Create Teacher Assignments',
    'teacher_assignments',
    'Assign teachers to classes, sections, and subjects'
),
(
    'teacher_assignments.update',
    'Update Teacher Assignments',
    'teacher_assignments',
    'Update teacher academic assignments'
),
(
    'teacher_assignments.delete',
    'Delete Teacher Assignments',
    'teacher_assignments',
    'Remove teacher academic assignments'
),

-- Attendance
(
    'attendance.view',
    'View Attendance',
    'attendance',
    'View student attendance records'
),
(
    'attendance.record',
    'Record Attendance',
    'attendance',
    'Record student attendance'
),
(
    'attendance.update',
    'Update Attendance',
    'attendance',
    'Update student attendance records'
),
(
    'attendance.delete',
    'Delete Attendance',
    'attendance',
    'Delete student attendance records'
),

-- Fee Types
(
    'fee_types.view',
    'View Fee Types',
    'fee_types',
    'View fee type configuration'
),
(
    'fee_types.create',
    'Create Fee Types',
    'fee_types',
    'Create fee types'
),
(
    'fee_types.update',
    'Update Fee Types',
    'fee_types',
    'Update fee types'
),
(
    'fee_types.delete',
    'Delete Fee Types',
    'fee_types',
    'Delete fee types'
),

-- Fees
(
    'fees.view',
    'View Fees',
    'fees',
    'View student fee records'
),
(
    'fees.assign',
    'Assign Fees',
    'fees',
    'Assign fees to students'
),
(
    'fees.update',
    'Update Fees',
    'fees',
    'Update student fee records'
),
(
    'fees.collect',
    'Collect Fees',
    'fees',
    'Collect and record student fee payments'
),

-- Payments
(
    'payments.view',
    'View Payments',
    'payments',
    'View payment and receipt records'
),
(
    'payments.create',
    'Create Payments',
    'payments',
    'Create payment records'
),
(
    'payments.cancel',
    'Cancel Payments',
    'payments',
    'Cancel payment records'
),
(
    'payments.refund',
    'Refund Payments',
    'payments',
    'Record payment refunds'
),

-- Exams
(
    'exams.view',
    'View Exams',
    'exams',
    'View examination records'
),
(
    'exams.create',
    'Create Exams',
    'exams',
    'Create examinations'
),
(
    'exams.update',
    'Update Exams',
    'exams',
    'Update examinations'
),
(
    'exams.delete',
    'Delete Exams',
    'exams',
    'Delete examinations'
),

-- Results
(
    'results.view',
    'View Results',
    'results',
    'View student examination results'
),
(
    'results.create',
    'Create Results',
    'results',
    'Enter student examination results'
),
(
    'results.update',
    'Update Results',
    'results',
    'Update student examination results'
),
(
    'results.publish',
    'Publish Results',
    'results',
    'Publish student examination results'
),

-- Certificates
(
    'certificates.view',
    'View Certificates',
    'certificates',
    'View student certificates'
),
(
    'certificates.create',
    'Create Certificates',
    'certificates',
    'Create and issue student certificates'
),
(
    'certificates.update',
    'Update Certificates',
    'certificates',
    'Update certificate records'
),
(
    'certificates.revoke',
    'Revoke Certificates',
    'certificates',
    'Revoke issued certificates'
),

-- Institute Users
(
    'users.view',
    'View Institute Users',
    'users',
    'View users belonging to the institute'
),
(
    'users.create',
    'Create Institute Users',
    'users',
    'Add users to the institute'
),
(
    'users.update',
    'Update Institute Users',
    'users',
    'Update institute user information'
),
(
    'users.remove',
    'Remove Institute Users',
    'users',
    'Remove or deactivate institute memberships'
),

-- Roles
(
    'roles.view',
    'View Roles',
    'roles',
    'View institute roles and permissions'
),
(
    'roles.create',
    'Create Roles',
    'roles',
    'Create institute roles'
),
(
    'roles.update',
    'Update Roles',
    'roles',
    'Update institute roles and permissions'
),
(
    'roles.delete',
    'Delete Roles',
    'roles',
    'Delete institute roles'
),
(
    'roles.assign',
    'Assign Roles',
    'roles',
    'Assign roles to institute users'
),

-- Institute
(
    'institute.view',
    'View Institute',
    'institute',
    'View institute profile and configuration'
),
(
    'institute.update',
    'Update Institute',
    'institute',
    'Update institute profile and configuration'
),
(
    'institute.settings',
    'Manage Institute Settings',
    'institute',
    'Manage institute system settings'
),

-- Reports
(
    'reports.view',
    'View Reports',
    'reports',
    'View institute reports'
),
(
    'reports.export',
    'Export Reports',
    'reports',
    'Export institute reports'
)

ON CONFLICT (code)
DO UPDATE SET
    name = EXCLUDED.name,
    module = EXCLUDED.module,
    description = EXCLUDED.description,
    is_system_permission = TRUE,
    status = 'active',
    updated_at = CURRENT_TIMESTAMP;
