/**
 * ISM Smart ERP
 * Academic Routes
 */

const express = require("express");

const {
  listClasses,
  listClassCurriculum,
  listHifzStages,
} = require("../controllers/academic.controller");

const authenticate = require("../middleware/authenticate");
const instituteContext = require("../middleware/institute-context");

const router = express.Router();

// --------------------------------------------------
// Academic Routes
// --------------------------------------------------

router.get(
  "/classes",
  authenticate,
  instituteContext,
  listClasses
);

router.get(
  "/classes/:classId/curriculum",
  authenticate,
  instituteContext,
  listClassCurriculum
);

router.get(
  "/hifz-stages",
  authenticate,
  instituteContext,
  listHifzStages
);

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = router;
