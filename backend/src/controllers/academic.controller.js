/**
 * ISM Smart ERP
 * Academic Controller
 */

const {
  getClasses,
  getClassSections,
  createClassSection,

  getAcademicSubjects,
  createAcademicSubject,
  updateAcademicSubject,

  getClassCurriculum,
  assignSubjectToClass,
  removeSubjectFromClass,

  getHifzStages,
} = require(
  "../services/academic.service"
);

// --------------------------------------------------
// Classes
// --------------------------------------------------

const listClasses = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await getClasses(
        req.institute?.id
      );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Sections
// --------------------------------------------------

const listClassSections = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await getClassSections(
        req.institute?.id,
        req.params.classId
      );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const createClassSectionController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const section =
        await createClassSection({
          instituteId:
            req.institute?.id,

          classId:
            req.params.classId,

          data: req.body,
        });

      return res.status(201).json({
        success: true,
        message:
          "Section created successfully",
        data: {
          section,
        },
      });
    } catch (error) {
      return next(error);
    }
  };

// --------------------------------------------------
// Subjects
// --------------------------------------------------

const listAcademicSubjectsController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const subjects =
        await getAcademicSubjects(
          req.institute?.id
        );

      return res.status(200).json({
        success: true,
        data: {
          subjects,
          total:
            subjects.length,
        },
      });
    } catch (error) {
      return next(error);
    }
  };

const createAcademicSubjectController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        subjectCode,
        subjectType = "subject",
        nameBn,
        nameEn,
        nameAr,
      } = req.body || {};

      if (
        !subjectCode ||
        !nameBn ||
        !nameEn ||
        !nameAr
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Subject code and all three language names are required.",
        });
      }

      const allowedTypes = [
        "subject",
        "book",
        "quran",
        "memorization",
        "language",
        "general",
      ];

      if (
        !allowedTypes.includes(
          subjectType
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid subject type.",
        });
      }

      const subject =
        await createAcademicSubject({
          instituteId:
            req.institute?.id,

          data: req.body,
        });

      return res.status(201).json({
        success: true,
        message:
          "Academic subject created successfully",
        data: {
          subject,
        },
      });
    } catch (error) {
      return next(error);
    }
  };

const updateAcademicSubjectController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const subject =
        await updateAcademicSubject({
          instituteId:
            req.institute?.id,

          subjectId:
            req.params.subjectId,

          data: req.body || {},
        });

      return res.status(200).json({
        success: true,
        message:
          "Academic subject updated successfully",
        data: {
          subject,
        },
      });
    } catch (error) {
      return next(error);
    }
  };

// --------------------------------------------------
// Curriculum
// --------------------------------------------------

const listClassCurriculum = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await getClassCurriculum(
        req.institute?.id,
        req.params.classId
      );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const assignSubjectToClassController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        subjectId,
      } = req.body || {};

      if (!subjectId) {
        return res.status(400).json({
          success: false,
          message:
            "Subject ID is required.",
        });
      }

      const curriculum =
        await assignSubjectToClass({
          instituteId:
            req.institute?.id,

          classId:
            req.params.classId,

          data: req.body,
        });

      return res.status(201).json({
        success: true,
        message:
          "Subject assigned to class successfully",
        data: {
          curriculum,
        },
      });
    } catch (error) {
      return next(error);
    }
  };

const removeSubjectFromClassController =
  async (
    req,
    res,
    next
  ) => {
    try {
      await removeSubjectFromClass({
        instituteId:
          req.institute?.id,

        classId:
          req.params.classId,

        subjectId:
          req.params.subjectId,
      });

      return res.status(200).json({
        success: true,
        message:
          "Subject removed from class curriculum successfully",
      });
    } catch (error) {
      return next(error);
    }
  };

// --------------------------------------------------
// Hifz Stages
// --------------------------------------------------

const listHifzStages = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await getHifzStages(
        req.institute?.id
      );

    return res.status(200).json({
      success: true,
      data,
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

  listClassSections,
  createClassSectionController,

  listAcademicSubjectsController,
  createAcademicSubjectController,
  updateAcademicSubjectController,

  listClassCurriculum,
  assignSubjectToClassController,
  removeSubjectFromClassController,

  listHifzStages,
};
