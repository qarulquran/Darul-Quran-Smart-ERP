/**
 * ISM Smart ERP
 * Academic Routes
 *
 * Base path:
 * /api/v1/academic
 */

const express =
  require("express");

const {
  listClasses,

  listClassSections,
  createClassSectionController,

  listAcademicSubjectsController,
  createAcademicSubjectController,
  updateAcademicSubjectController,

  listClassCurriculum,
  assignSubjectToClassController,
  removeSubjectFromClassController,

  listHifzStages,
} = require(
  "../controllers/academic.controller"
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

const router =
  express.Router();

// --------------------------------------------------
// Classes
// --------------------------------------------------

router.get(
  "/classes",
  authenticate,
  authorizeInstitute,
  listClasses
);

// --------------------------------------------------
// Sections
// --------------------------------------------------

router.get(
  "/classes/:classId/sections",
  authenticate,
  authorizeInstitute,
  listClassSections
);

router.post(
  "/classes/:classId/sections",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.update"
  ),
  createClassSectionController
);

// --------------------------------------------------
// Subjects / Kitab
// --------------------------------------------------

router.get(
  "/subjects",
  authenticate,
  authorizeInstitute,
  listAcademicSubjectsController
);

router.post(
  "/subjects",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.update"
  ),
  createAcademicSubjectController
);

router.patch(
  "/subjects/:subjectId",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.update"
  ),
  updateAcademicSubjectController
);

// --------------------------------------------------
// Class Curriculum
// --------------------------------------------------

router.get(
  "/classes/:classId/curriculum",
  authenticate,
  authorizeInstitute,
  listClassCurriculum
);

router.post(
  "/classes/:classId/curriculum",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.update"
  ),
  assignSubjectToClassController
);

router.delete(
  "/classes/:classId/curriculum/:subjectId",
  authenticate,
  authorizeInstitute,
  authorizePermission(
    "students.update"
  ),
  removeSubjectFromClassController
);

// --------------------------------------------------
// Hifz Stages
// --------------------------------------------------

router.get(
  "/hifz-stages",
  authenticate,
  authorizeInstitute,
  listHifzStages
);

// --------------------------------------------------
// Export
// --------------------------------------------------

module.exports =
  router;
