# Darul Quran Smart ERP - API Documentation

## 1. API Overview

API (Application Programming Interface) will connect the frontend application with the backend server.

Architecture:

Frontend
↓
API Request
↓
Backend Server
↓
Database
↓
API Response
↓
Frontend Display

---

# 2. Authentication API

## Login API

Endpoint:

POST /api/auth/login

Purpose:

Authenticate users into the system.

Request:

- Email
- Password

Response:

- User information
- Role
- Authentication token

---

## Logout API

Endpoint:

POST /api/auth/logout

Purpose:

Securely logout user from the system.

---

# 3. Student APIs

## Add Student

Endpoint:

POST /api/students

Purpose:

Create a new student record.

Data:

- Name
- Father name
- Mother name
- Date of birth
- Address
- Class
- Contact information

---

## Get Students

Endpoint:

GET /api/students

Purpose:

Retrieve all student information.

---

## Get Single Student

Endpoint:

GET /api/students/:id

Purpose:

View specific student details.

---

## Update Student

Endpoint:

PUT /api/students/:id

Purpose:

Update student information.

---

## Delete Student

Endpoint:

DELETE /api/students/:id

Purpose:

Remove student record.

---

# 4. Admission APIs

Create Admission:

POST /api/admission

Get Admission Records:

GET /api/admission

---

# 5. Attendance APIs

Add Attendance:

POST /api/attendance

Get Attendance:

GET /api/attendance

Attendance Data:

- Student ID
- Date
- Status

---

# 6. Fee Management APIs

Collect Fee:

POST /api/fees

Get Payment History:

GET /api/fees

Generate Receipt:

GET /api/fees/receipt/:id

---

# 7. Result APIs

Create Exam:

POST /api/exams

Add Marks:

POST /api/results

View Result:

GET /api/results/:studentId

---

# 8. Certificate APIs

Create Certificate:

POST /api/certificates

Get Certificate:

GET /api/certificates/:id

---

# 9. Teacher APIs

Add Teacher:

POST /api/teachers

Get Teachers:

GET /api/teachers

Update Teacher:

PUT /api/teachers/:id

---

# 10. Security API Rules

Security Features:

- JWT Authentication
- Password Encryption
- Role Based Access Control
- Input Validation
- Secure API Requests

---

# 11. Future API Expansion

Future APIs:

- Mobile App API
- Online Payment API
- SMS Gateway API
- AI Analytics API
- Cloud Backup API
