/**
 * ISM Smart ERP
 * Student Routes
 *
 * Base path:
 * /api/v1/students
 */

const express = require("express");

const {
  createStudentController,
  listStudentsController,
  getStudentByIdController,
  updateStudentController,
} = require(
  "../controllers/student.controller"
);

const {
  authenticate,
} = require(
  "../middleware/authenticate"
);

const {
  authorizeInstitute,
} = require(
  "../middleware/authorize-institute"
);

const {
  authorizePermission,
} = require(
  "../middleware/authorize-permission"
);

const {
  validateCreateStudent,
  validateUpdateStudent,
} = require(
  "../middleware/validate-student"
);

const router = express.Router();

// --------------------------------------------------
// List Students
// --------------------------------------------------

router.get(
  "/",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.view"
  ),
  listStudentsController
);

// --------------------------------------------------
// Get Student By ID
// --------------------------------------------------

router.get(
  "/:id",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.view"
  ),
  getStudentByIdController
);

// --------------------------------------------------
// Create Student
// --------------------------------------------------

router.post(
  "/",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.create"
  ),
  validateCreateStudent,
  createStudentController
);

// --------------------------------------------------
// Update Student
// --------------------------------------------------

router.patch(
  "/:id",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.update"
  ),
  validateUpdateStudent,
  updateStudentController
);

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = router;
