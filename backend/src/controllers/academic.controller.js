
/**
 * ISM Smart ERP
 * Academic Controller
 *
 * Handles academic API requests:
 * - Classes
 * - Class curriculum
 * - Hifz stages
 */

const {
  getClasses,
  getClassCurriculum,
  getHifzStages,
} = require("../services/academic.service");

// --------------------------------------------------
// Get Classes
// --------------------------------------------------

const listClasses = async (req, res, next) => {
  try {
    const instituteId = req.institute?.id;

    if (!instituteId) {
      return res.status(400).json({
        success: false,
        message: "Institute context is required.",
      });
    }

    const classes = await getClasses(instituteId);

    return res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Get Class Curriculum
// --------------------------------------------------

const listClassCurriculum = async (
  req,
  res,
  next
) => {
  try {
    const instituteId = req.institute?.id;
    const classId = req.params.classId;

    if (!instituteId) {
      return res.status(400).json({
        success: false,
        message: "Institute context is required.",
      });
    }

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "Class ID is required.",
      });
    }

    const curriculum =
      await getClassCurriculum(
        instituteId,
        classId
      );

    return res.status(200).json({
      success: true,
      data: curriculum,
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Get Hifz Stages
// --------------------------------------------------

const listHifzStages = async (
  req,
  res,
  next
) => {
  try {
    const instituteId = req.institute?.id;

    if (!instituteId) {
      return res.status(400).json({
        success: false,
        message: "Institute context is required.",
      });
    }

    const stages =
      await getHifzStages(instituteId);

    return res.status(200).json({
      success: true,
      data: stages,
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  listClasses,
  listClassCurriculum,
  listHifzStages,
};
