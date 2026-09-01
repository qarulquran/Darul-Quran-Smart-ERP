/**
 * ISM Smart ERP
 * Hifz Controller
 */

const {
  createHifzEnrollment,
  getHifzEnrollmentById,
  updateHifzEnrollmentStage,
  completeHifzEnrollment,
  getStudentHifzEnrollments,
} = require(
  "../services/hifz.service"
);

// --------------------------------------------------
// Create Enrollment
// --------------------------------------------------

const createHifzEnrollmentController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const instituteId =
        req.institute?.id;

      if (!instituteId) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Institute context is required.",
          });
      }

      const enrollment =
        await createHifzEnrollment({
          instituteId,
          data: req.body,
        });

      return res
        .status(201)
        .json({
          success: true,

          message:
            "Hifz enrollment created successfully",

          data: {
            enrollment,
          },

          requestId:
            req.requestId,
        });
    } catch (error) {
      return next(error);
    }
  };

// --------------------------------------------------
// Get Enrollment
// --------------------------------------------------

const getHifzEnrollmentController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const enrollment =
        await getHifzEnrollmentById({
          instituteId:
            req.institute?.id,

          enrollmentId:
            req.params.enrollmentId,
        });

      return res
        .status(200)
        .json({
          success: true,

          data: {
            enrollment,
          },

          requestId:
            req.requestId,
        });
    } catch (error) {
      return next(error);
    }
  };

// --------------------------------------------------
// Update Stage
// --------------------------------------------------

const updateHifzStageController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const enrollment =
        await updateHifzEnrollmentStage({
          instituteId:
            req.institute?.id,

          enrollmentId:
            req.params.enrollmentId,

          stageCode:
            req.body.stageCode,
        });

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Hifz stage updated successfully",

          data: {
            enrollment,
          },

          requestId:
            req.requestId,
        });
    } catch (error) {
      return next(error);
    }
  };

// --------------------------------------------------
// Complete Enrollment
// --------------------------------------------------

const completeHifzEnrollmentController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const enrollment =
        await completeHifzEnrollment({
          instituteId:
            req.institute?.id,

          enrollmentId:
            req.params.enrollmentId,

          completionDate:
            req.body.completionDate,
        });

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Hifz enrollment completed successfully",

          data: {
            enrollment,
          },

          requestId:
            req.requestId,
        });
    } catch (error) {
      return next(error);
    }
  };

// --------------------------------------------------
// Student Hifz History
// --------------------------------------------------

const listStudentHifzEnrollmentsController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const enrollments =
        await getStudentHifzEnrollments({
          instituteId:
            req.institute?.id,

          studentId:
            req.params.studentId,
        });

      return res
        .status(200)
        .json({
          success: true,

          data: {
            enrollments,
            total:
              enrollments.length,
          },

          requestId:
            req.requestId,
        });
    } catch (error) {
      return next(error);
    }
  };

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  createHifzEnrollmentController,
  getHifzEnrollmentController,
  updateHifzStageController,
  completeHifzEnrollmentController,
  listStudentHifzEnrollmentsController,
};
