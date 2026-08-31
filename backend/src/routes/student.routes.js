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
// Exports
// --------------------------------------------------

module.exports = router;
