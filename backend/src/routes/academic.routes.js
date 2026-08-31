/**
 * ISM Smart ERP
 * Academic Routes
 *
 * Base path:
 * /api/v1/academic
 */

const express = require("express");

const {
  listClasses,
  listClassCurriculum,
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

const router = express.Router();

// --------------------------------------------------
// List Classes
// --------------------------------------------------

router.get(
  "/classes",
  authenticate,
  authorizeInstitute,
  listClasses
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
// Exports
// --------------------------------------------------

module.exports = router;
