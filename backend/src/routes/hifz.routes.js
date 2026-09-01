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
  updateHifzStageController,
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
  validateUpdateHifzStage,
} = require(
  "../middleware/validate-hifz"
);

const router =
  express.Router();

// --------------------------------------------------
// Create Enrollment
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
// Progress Enrollment Stage
// --------------------------------------------------

router.patch(
  "/enrollments/:enrollmentId/stage",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.update"
  ),
  validateUpdateHifzStage,
  updateHifzStageController
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
