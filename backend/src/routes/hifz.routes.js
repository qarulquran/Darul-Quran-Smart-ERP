/**
 * ISM Smart ERP
 * Hifz Routes
 *
 * Base:
 * /api/v1/hifz
 */

const express =
  require("express");

const {
  createHifzEnrollmentController,
  getHifzEnrollmentController,
  listStudentHifzEnrollmentsController,
} = require(
  "../controllers/hifz.controller"
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
  validateCreateHifzEnrollment,
} = require(
  "../middleware/validate-hifz"
);

const router =
  express.Router();

// --------------------------------------------------
// Create Hifz Enrollment
// --------------------------------------------------

router.post(
  "/enrollments",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.update"
  ),
  validateCreateHifzEnrollment,
  createHifzEnrollmentController
);

// --------------------------------------------------
// Get Enrollment
// --------------------------------------------------

router.get(
  "/enrollments/:enrollmentId",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.view"
  ),
  getHifzEnrollmentController
);

// --------------------------------------------------
// Student Hifz History
// --------------------------------------------------

router.get(
  "/students/:studentId/enrollments",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.view"
  ),
  listStudentHifzEnrollmentsController
);

// --------------------------------------------------
// Export
// --------------------------------------------------

module.exports =
  router;
