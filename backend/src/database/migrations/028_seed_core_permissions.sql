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
    description
)
VALUES

-- ============================================================
-- Dashboard
-- ============================================================

(
    'dashboard.view',
    'View Dashboard',
    'View institute dashboard and summary information'
),

-- ============================================================
-- Students
-- ============================================================

(
    'students.view',
    'View Students',
    'View student records'
),
(
    'students.create',
    'Create Students',
    'Create new student records'
),
(
    'students.update',
    'Update Students',
    'Update existing student records'
),
(
    'students.delete',
    'Delete Students',
    'Delete student records'
),

-- ============================================================
-- Admissions
-- ============================================================

(
    'admissions.view',
    'View Admissions',
    'View admission records'
),
(
    'admissions.create',
    'Create Admissions',
    'Create student admission records'
),
(
    'admissions.update',
    'Update Admissions',
    'Update admission records'
),
(
    'admissions.delete',
    'Delete Admissions',
    'Delete admission records'
),

-- ============================================================
-- Teachers
-- ============================================================

(
    'teachers.view',
    'View Teachers',
    'View teacher records'
),
(
    'teachers.create',
    'Create Teachers',
    'Create teacher records'
),
(
    'teachers.update',
    'Update Teachers',
    'Update teacher records'
),
(
    'teachers.delete',
    'Delete Teachers',
    'Delete teacher records'
),

-- ============================================================
-- Academic Years
-- ============================================================

(
    'academic_years.view',
    'View Academic Years',
    'View academic year records'
),
(
    'academic_years.create',
    'Create Academic Years',
    'Create academic year records'
),
(
    'academic_years.update',
    'Update Academic Years',
    'Update academic year records'
),
(
    'academic_years.manage',
    'Manage Academic Years',
    'Manage current academic year and academic year status'
),

-- ============================================================
-- Classes
-- ============================================================

(
    'classes.view',
    'View Classes',
    'View class records'
),
(
    'classes.create',
    'Create Classes',
    'Create class records'
),
(
    'classes.update',
    'Update Classes',
    'Update class records'
),
(
    'classes.delete',
    'Delete Classes',
    'Delete class records'
),

-- ============================================================
-- Sections
-- ============================================================

(
    'sections.view',
    'View Sections',
    'View section records'
),
(
    'sections.create',
    'Create Sections',
    'Create section records'
),
(
    'sections.update',
    'Update Sections',
    'Update section records'
),
(
    'sections.delete',
    'Delete Sections',
    'Delete section records'
),

-- ============================================================
-- Subjects
-- ============================================================

(
    'subjects.view',
    'View Subjects',
    'View subject records'
),
(
    'subjects.create',
    'Create Subjects',
    'Create subject records'
),
(
    'subjects.update',
    'Update Subjects',
    'Update subject records'
),
(
    'subjects.delete',
    'Delete Subjects',
    'Delete subject records'
),

-- ============================================================
-- Student Enrollments
-- ============================================================

(
    'enrollments.view',
    'View Enrollments',
    'View student academic enrollment records'
),
(
    'enrollments.create',
    'Create Enrollments',
    'Enroll students into academic years and classes'
),
(
    'enrollments.update',
    'Update Enrollments',
    'Update student enrollment records'
),
(
    'enrollments.promote',
    'Promote Students',
    'Promote or repeat students between academic years'
),

-- ============================================================
-- Teacher Academic Assignments
-- ============================================================

(
    'teacher_assignments.view',
    'View Teacher Assignments',
    'View teacher academic assignments'
),
(
    'teacher_assignments.create',
    'Create Teacher Assignments',
    'Assign teachers to classes, sections, and subjects'
),
(
    'teacher_assignments.update',
    'Update Teacher Assignments',
    'Update teacher academic assignments'
),
(
    'teacher_assignments.delete',
    'Delete Teacher Assignments',
    'Remove teacher academic assignments'
),

-- ============================================================
-- Attendance
-- ============================================================

(
    'attendance.view',
    'View Attendance',
    'View student attendance records'
),
(
    'attendance.record',
    'Record Attendance',
    'Record student attendance'
),
(
    'attendance.update',
    'Update Attendance',
    'Update student attendance records'
),
(
    'attendance.delete',
    'Delete Attendance',
    'Delete student attendance records'
),

-- ============================================================
-- Fee Types
-- ============================================================

(
    'fee_types.view',
    'View Fee Types',
    'View fee type configuration'
),
(
    'fee_types.create',
    'Create Fee Types',
    'Create fee types'
),
(
    'fee_types.update',
    'Update Fee Types',
    'Update fee types'
),
(
    'fee_types.delete',
    'Delete Fee Types',
    'Delete fee types'
),

-- ============================================================
-- Student Fees
-- ============================================================

(
    'fees.view',
    'View Fees',
    'View student fee records'
),
(
    'fees.assign',
    'Assign Fees',
    'Assign fees to students'
),
(
    'fees.update',
    'Update Fees',
    'Update student fee records'
),
(
    'fees.collect',
    'Collect Fees',
    'Collect and record student fee payments'
),

-- ============================================================
-- Fee Payments
-- ============================================================

(
    'payments.view',
    'View Payments',
    'View payment and receipt records'
),
(
    'payments.create',
    'Create Payments',
    'Create payment records'
),
(
    'payments.cancel',
    'Cancel Payments',
    'Cancel payment records'
),
(
    'payments.refund',
    'Refund Payments',
    'Record payment refunds'
),

-- ============================================================
-- Exams
-- ============================================================

(
    'exams.view',
    'View Exams',
    'View examination records'
),
(
    'exams.create',
    'Create Exams',
    'Create examinations'
),
(
    'exams.update',
    'Update Exams',
    'Update examinations'
),
(
    'exams.delete',
    'Delete Exams',
    'Delete examinations'
),

-- ============================================================
-- Results
-- ============================================================

(
    'results.view',
    'View Results',
    'View student examination results'
),
(
    'results.create',
    'Create Results',
    'Enter student examination results'
),
(
    'results.update',
    'Update Results',
    'Update student examination results'
),
(
    'results.publish',
    'Publish Results',
    'Publish student examination results'
),

-- ============================================================
-- Certificates
-- ============================================================

(
    'certificates.view',
    'View Certificates',
    'View student certificates'
),
(
    'certificates.create',
    'Create Certificates',
    'Create and issue student certificates'
),
(
    'certificates.update',
    'Update Certificates',
    'Update certificate records'
),
(
    'certificates.revoke',
    'Revoke Certificates',
    'Revoke issued certificates'
),

-- ============================================================
-- Institute Members
-- ============================================================

(
    'users.view',
    'View Institute Users',
    'View users belonging to the institute'
),
(
    'users.create',
    'Create Institute Users',
    'Add users to the institute'
),
(
    'users.update',
    'Update Institute Users',
    'Update institute user information'
),
(
    'users.remove',
    'Remove Institute Users',
    'Remove or deactivate institute memberships'
),

-- ============================================================
-- Roles
-- ============================================================

(
    'roles.view',
    'View Roles',
    'View institute roles and permissions'
),
(
    'roles.create',
    'Create Roles',
    'Create institute roles'
),
(
    'roles.update',
    'Update Roles',
    'Update institute roles and permissions'
),
(
    'roles.delete',
    'Delete Roles',
    'Delete institute roles'
),
(
    'roles.assign',
    'Assign Roles',
    'Assign roles to institute users'
),

-- ============================================================
-- Institute Settings
-- ============================================================

(
    'institute.view',
    'View Institute',
    'View institute profile and configuration'
),
(
    'institute.update',
    'Update Institute',
    'Update institute profile and configuration'
),
(
    'institute.settings',
    'Manage Institute Settings',
    'Manage institute system settings'
),

-- ============================================================
-- Reports
-- ============================================================

(
    'reports.view',
    'View Reports',
    'View institute reports'
),
(
    'reports.export',
    'Export Reports',
    'Export institute reports'
)

ON CONFLICT (code)
DO NOTHING;
