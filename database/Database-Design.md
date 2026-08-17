# Darul Quran Smart ERP - Database Design

## 1. Database Overview

Darul Quran Smart ERP will use a structured database system to store and manage all madrasa information securely.

Database will manage students, teachers, classes, attendance, fees, exams, certificates and system users.

---

# Main Database Collections / Tables

## 1. Students

Stores all student information.

Fields:

- student_id
- name
- father_name
- mother_name
- date_of_birth
- gender
- address
- phone
- guardian_information
- admission_date
- class_id
- photo
- status

---

## 2. Admission

Stores admission records.

Fields:

- admission_id
- student_id
- admission_date
- previous_school
- admission_fee
- documents
- created_by

---

## 3. Teachers

Stores teacher information.

Fields:

- teacher_id
- name
- phone
- email
- address
- qualification
- joining_date
- salary
- status

---

## 4. Classes

Stores class information.

Fields:

- class_id
- class_name
- section
- teacher_id
- academic_year

---

## 5. Subjects

Stores subject details.

Fields:

- subject_id
- subject_name
- class_id
- teacher_id

---

## 6. Attendance

Stores daily attendance.

Fields:

- attendance_id
- student_id
- date
- status
- recorded_by

Attendance Status:
- Present
- Absent
- Late

---

## 7. Fee Management

Stores student payment information.

Fields:

- payment_id
- student_id
- fee_type
- amount
- payment_date
- due_amount
- payment_status
- receipt_number

---

## 8. Examination & Result

Stores exam and marks information.

Fields:

- exam_id
- student_id
- subject_id
- marks
- grade
- result_status

---

## 9. Certificate Management

Stores certificate records.

Fields:

- certificate_id
- student_id
- certificate_type
- issue_date
- certificate_number

---

## 10. Users & Roles

Controls system access.

Fields:

- user_id
- name
- email
- password
- role
- permissions

Roles:

- Admin
- Teacher
- Accountant
- Student

---

# Database Relationship

Student
↓
Admission
↓
Class
↓
Attendance
↓
Exam Result
↓
Certificate

Teacher
↓
Class
↓
Subject

Student
↓
Fee Payment

---

# Security

Database security features:

- Password encryption
- Role based access control
- Regular backup
- Data validation

---

# Future Database Expansion

Future additions:

- Online payment records
- SMS notification data
- Mobile app API support
- AI analytics data
