# ISM Smart ERP - Multi-Tenant Database Design

## 1. Database Overview

ISM Smart ERP is a multi-tenant Islamic School and Madrasa Management Platform.

The same ISM software will be used by multiple institutions.

Each institution will have its own:

- Students
- Teachers
- Classes
- Subjects
- Attendance
- Fees
- Finance
- Exams
- Results
- Certificates
- Users
- Settings

All institution-specific data must be isolated by `institution_id`.

Example:

- ISM Platform
  - Darul Quran Ahmadia Madrasah
  - Institution 2
  - Institution 3
  - Institution 4

One institution must never be able to access another institution's private data.

---

# 2. Core Multi-Tenant Tables

## 2.1 Institutions

Stores all institutions using ISM.

Fields:

- institution_id
- institution_code
- institution_name
- short_name
- institution_type
- logo
- address
- district
- country
- phone
- email
- website
- language
- currency
- timezone
- academic_year
- status
- created_at
- updated_at

Example:

institution_code:

DQ

institution_name:

Darul Quran Ahmadia Madrasah

Status:

- Active
- Suspended
- Inactive

---

## 2.2 Users

Stores all platform users.

Fields:

- user_id
- institution_id
- name
- username
- email
- phone
- password_hash
- role_id
- status
- last_login_at
- created_at
- updated_at

Important:

`institution_id` may be NULL only for ISM platform-level users such as Super Admin.

Institution users must always belong to an institution.

Passwords must never be stored as plain text.

---

## 2.3 Roles

Stores system roles.

Fields:

- role_id
- institution_id
- role_name
- role_code
- description
- is_system_role
- status
- created_at
- updated_at

Default Roles:

- Super Admin
- Institution Admin
- Teacher
- Accountant
- Staff
- Librarian
- Hostel Manager
- Guardian
- Student

Platform-level roles can have `institution_id = NULL`.

Institution-specific custom roles may use their own `institution_id`.

---

## 2.4 Permissions

Stores available system permissions.

Fields:

- permission_id
- permission_code
- permission_name
- module_name
- description

Examples:

- student.view
- student.create
- student.edit
- student.delete
- fee.collect
- fee.view
- finance.create
- finance.view
- attendance.manage
- result.manage
- settings.manage

---

## 2.5 Role Permissions

Connects roles with permissions.

Fields:

- role_permission_id
- role_id
- permission_id

Relationship:

Role
↓
Role Permissions
↓
Permission

---

# 3. Student Management

## 3.1 Students

Stores student information.

Fields:

- student_id
- institution_id
- student_code
- name
- father_name
- mother_name
- date_of_birth
- birth_registration_number
- gender
- blood_group
- address
- phone
- guardian_name
- guardian_phone
- guardian_relation
- admission_date
- class_id
- section_id
- photo
- status
- created_by
- created_at
- updated_at

Student code should be unique within an institution.

Example:

DQ-2-2026-00001

Recommended unique rule:

- institution_id
- student_code

---

## 3.2 Admissions

Stores admission records.

Fields:

- admission_id
- institution_id
- student_id
- admission_number
- admission_date
- academic_year
- previous_school
- admission_fee
- documents
- notes
- created_by
- created_at
- updated_at

Relationship:

Institution
↓
Student
↓
Admission

---

# 4. Academic Management

## 4.1 Academic Years

Fields:

- academic_year_id
- institution_id
- year_name
- start_date
- end_date
- is_current
- status

---

## 4.2 Classes

Fields:

- class_id
- institution_id
- class_name
- class_code
- academic_year_id
- status
- created_at
- updated_at

Examples:

- Nursery
- Class 1
- Class 2
- Hifz
- Nazera

---

## 4.3 Sections

Fields:

- section_id
- institution_id
- class_id
- section_name
- teacher_id
- status

---

## 4.4 Subjects

Fields:

- subject_id
- institution_id
- subject_name
- subject_code
- class_id
- teacher_id
- status

---

# 5. Teacher and Staff Management

## 5.1 Teachers

Fields:

- teacher_id
- institution_id
- teacher_code
- name
- phone
- email
- address
- qualification
- joining_date
- basic_salary
- photo
- status
- created_at
- updated_at

---

## 5.2 Payroll

Fields:

- payroll_id
- institution_id
- teacher_id
- salary_month
- basic_salary
- allowance
- deduction
- net_salary
- payment_status
- payment_date
- payment_method
- created_by
- created_at

---

# 6. Attendance Management

## 6.1 Student Attendance

Fields:

- attendance_id
- institution_id
- student_id
- class_id
- attendance_date
- status
- remarks
- recorded_by
- created_at
- updated_at

Attendance Status:

- Present
- Absent
- Late
- Leave

Recommended unique rule:

- institution_id
- student_id
- attendance_date

This prevents duplicate attendance for the same student on the same day.

---

# 7. Fee Management

Fee management should use separate fee definitions, student dues and payments.

Do not store all fee information in only one payment table.

---

## 7.1 Fee Types

Fields:

- fee_type_id
- institution_id
- fee_name
- fee_code
- fee_category
- default_amount
- frequency
- status

Examples:

- Monthly Fee
- Admission Fee
- Exam Fee
- Hostel Fee
- Transport Fee
- Other Fee

Frequency:

- One Time
- Monthly
- Quarterly
- Yearly
- Custom

---

## 7.2 Student Fee Assignments

Stores fees assigned to students.

Fields:

- fee_assignment_id
- institution_id
- student_id
- fee_type_id
- academic_year_id
- fee_month
- amount
- discount_amount
- payable_amount
- due_date
- status
- created_at
- updated_at

Status:

- Unpaid
- Partial
- Paid
- Waived

---

## 7.3 Fee Payments

Stores actual payments.

Fields:

- payment_id
- institution_id
- student_id
- fee_assignment_id
- fee_type_id
- receipt_number
- amount_paid
- payment_date
- payment_method
- reference_number
- collected_by
- notes
- created_at

Payment Methods:

- Cash
- Bank
- Mobile Banking
- Online Payment
- Other

Receipt number must be unique.

Recommended unique rule:

- institution_id
- receipt_number

---

# 8. Finance Management

Student fee collection and general finance must use a shared accounting source of truth.

Fee payments should automatically create finance ledger transactions.

---

## 8.1 Finance Categories

Fields:

- finance_category_id
- institution_id
- category_name
- category_type
- status

Category Type:

- Income
- Expense

Examples:

Income:

- Student Fee
- Donation
- Admission Fee
- Other Income

Expense:

- Salary
- Electricity
- Food
- Rent
- Maintenance
- Other Expense

---

## 8.2 Finance Transactions

Fields:

- transaction_id
- institution_id
- transaction_type
- category_id
- amount
- transaction_date
- payment_method
- received_from
- paid_to
- source_type
- source_id
- reference_number
- note
- created_by
- created_at

Transaction Type:

- Income
- Expense

Important:

When a student fee payment is completed:

Fee Payment
↓
Finance Transaction

The system should not manually count the same payment twice.

Example:

source_type:

STUDENT_FEE

source_id:

payment_id

---

# 9. Examination and Result Management

## 9.1 Exams

Fields:

- exam_id
- institution_id
- exam_name
- academic_year_id
- class_id
- start_date
- end_date
- status

---

## 9.2 Exam Marks

Fields:

- exam_mark_id
- institution_id
- exam_id
- student_id
- subject_id
- marks_obtained
- total_marks
- grade
- remarks
- entered_by
- created_at
- updated_at

---

## 9.3 Results

Fields:

- result_id
- institution_id
- exam_id
- student_id
- total_marks
- percentage
- grade
- position
- result_status
- published_at

---

# 10. Certificate Management

## 10.1 Certificates

Fields:

- certificate_id
- institution_id
- student_id
- certificate_type
- certificate_number
- issue_date
- issued_by
- verification_code
- status
- created_at

Certificate number must be unique within an institution.

---

# 11. Guardian Management

## 11.1 Guardians

Fields:

- guardian_id
- institution_id
- name
- phone
- email
- address
- user_id
- status

---

## 11.2 Student Guardians

Fields:

- student_guardian_id
- institution_id
- student_id
- guardian_id
- relationship
- is_primary

One guardian may be linked with multiple students.

---

# 12. Institution Settings

Stores institution-specific configuration.

Fields:

- setting_id
- institution_id
- setting_key
- setting_value
- updated_by
- updated_at

Examples:

- institution_logo
- receipt_header
- receipt_footer
- default_language
- currency
- academic_year
- student_code_format
- timezone

No institution-specific setting should be hardcoded into ISM frontend.

---

# 13. Audit Logs

Stores sensitive system activity.

Fields:

- audit_log_id
- institution_id
- user_id
- action
- module
- record_id
- old_values
- new_values
- ip_address
- user_agent
- created_at

Examples:

- Student Created
- Student Updated
- Fee Collected
- Payment Deleted
- Result Changed
- User Permission Changed

---

# 14. Database Relationships

ISM Platform
↓
Institution
↓
Users

Institution
↓
Students
↓
Admissions

Institution
↓
Classes
↓
Sections
↓
Subjects

Institution
↓
Teachers
↓
Classes / Subjects

Institution
↓
Students
↓
Attendance

Institution
↓
Students
↓
Fee Assignments
↓
Fee Payments
↓
Finance Transactions

Institution
↓
Exams
↓
Exam Marks
↓
Results

Institution
↓
Students
↓
Certificates

Institution
↓
Roles
↓
Role Permissions
↓
Permissions

---

# 15. Multi-Tenant Security Rules

These rules are mandatory.

## Rule 1

Every institution-owned business record must contain:

`institution_id`

---

## Rule 2

The backend must determine the logged-in user's institution.

The frontend must not be trusted to decide which institution's data can be accessed.

---

## Rule 3

All database queries for institution users must be filtered by:

`institution_id`

Example concept:

Current User
↓
Current Institution
↓
Only Current Institution Data

---

## Rule 4

A user from one institution must never access another institution's:

- Students
- Teachers
- Fees
- Finance
- Attendance
- Results
- Certificates
- Settings

---

## Rule 5

ISM Super Admin can manage institutions at platform level.

Institution Admin can only manage their own institution.

---

# 16. Security

Database security requirements:

- Password hashing
- Role-Based Access Control
- Permission-Based Access Control
- Tenant isolation
- Input validation
- Prepared database queries
- Secure API authentication
- Audit logging
- Regular backups
- Database indexes
- Unique constraints
- Foreign key constraints

Plain text passwords are prohibited.

---

# 17. Recommended Database Indexes

Important indexes should include:

- institution_id
- student_code
- teacher_code
- receipt_number
- attendance_date
- payment_date
- transaction_date
- academic_year_id
- class_id
- student_id

Composite indexes should be considered for:

- institution_id + student_code
- institution_id + receipt_number
- institution_id + student_id
- institution_id + attendance_date

---

# 18. Future Expansion

ISM should support future modules without redesigning the core tenant architecture.

Future modules may include:

- Online Payment Gateway
- SMS Notifications
- WhatsApp Notifications
- Mobile Application API
- Hostel Management
- Library Management
- Inventory Management
- Discipline and Behavior
- Donation Management
- Staff Management
- Transport Management
- Online Admission
- Parent Portal
- Student Portal
- Teacher Portal
- AI Analytics
- Cloud Backup
- Subscription and Billing
- Institution Plan Management

---

# 19. Core Design Principle

ISM is the main software platform.

Institutions are customers of ISM.

Example:

ISM Smart ERP
↓
Darul Quran Ahmadia Madrasah
↓
Students / Teachers / Fees / Finance / Results

ISM Smart ERP
↓
Another Institution
↓
Its own Students / Teachers / Fees / Finance / Results

All institutions use the same software codebase.

Their private data must remain completely isolated.
