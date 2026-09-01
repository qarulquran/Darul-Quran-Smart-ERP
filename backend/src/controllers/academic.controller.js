/**
 * ISM Smart ERP
 * Academic Controller
 *
 * Handles:
 * - Classes
 * - Sections
 * - Curriculum
 * - Hifz stages
 */

const {
  getClasses,
  getClassSections,
  createClassSection,
  getClassCurriculum,
  getHifzStages,
} = require(
  "../services/academic.service"
);

// --------------------------------------------------
// List Classes
// --------------------------------------------------

const listClasses = async (
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

    const classes =
      await getClasses(
        instituteId
      );

    return res
      .status(200)
      .json({
        success: true,
        data: classes,
      });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// List Class Sections
// --------------------------------------------------

const listClassSections = async (
  req,
  res,
  next
) => {
  try {
    const instituteId =
      req.institute?.id;

    const classId =
      req.params.classId;

    const sections =
      await getClassSections(
        instituteId,
        classId
      );

    return res
      .status(200)
      .json({
        success: true,
        data: sections,
      });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// Create Class Section
// --------------------------------------------------

const createClassSectionController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const instituteId =
        req.institute?.id;

      const classId =
        req.params.classId;

      const {
        sectionCode,
        name,
        nameBn,
        nameEn,
        nameAr,
        description,
        capacity,
        sortOrder,
        status,
        settings,
      } = req.body || {};

      if (!instituteId) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Institute context is required.",
          });
      }

      if (!classId) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Class ID is required.",
          });
      }

      if (
        !sectionCode ||
        typeof sectionCode !== "string"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Section code is required.",
          });
      }

      if (
        !name ||
        typeof name !== "string"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Section name is required.",
          });
      }

      if (
        capacity !== undefined &&
        capacity !== null &&
        (
          !Number.isInteger(capacity) ||
          capacity < 0
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Capacity must be a non-negative integer.",
          });
      }

      if (
        sortOrder !== undefined &&
        (
          !Number.isInteger(sortOrder) ||
          sortOrder < 0
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Sort order must be a non-negative integer.",
          });
      }

      const allowedStatuses = [
        "active",
        "inactive",
        "archived",
      ];

      if (
        status !== undefined &&
        !allowedStatuses.includes(
          status
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid section status.",
          });
      }

      const section =
        await createClassSection({
          instituteId,
          classId,
          data: {
            sectionCode:
              sectionCode.trim(),

            name:
              name.trim(),

            nameBn:
              nameBn?.trim(),

            nameEn:
              nameEn?.trim(),

            nameAr:
              nameAr?.trim(),

            description:
              description?.trim(),

            capacity,
            sortOrder,
            status,
            settings,
          },
        });

      return res
        .status(201)
        .json({
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
// List Class Curriculum
// --------------------------------------------------

const listClassCurriculum = async (
  req,
  res,
  next
) => {
  try {
    const instituteId =
      req.institute?.id;

    const classId =
      req.params.classId;

    const curriculum =
      await getClassCurriculum(
        instituteId,
        classId
      );

    return res
      .status(200)
      .json({
        success: true,
        data: curriculum,
      });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// List Hifz Stages
// --------------------------------------------------

const listHifzStages = async (
  req,
  res,
  next
) => {
  try {
    const instituteId =
      req.institute?.id;

    const stages =
      await getHifzStages(
        instituteId
      );

    return res
      .status(200)
      .json({
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
  listClassSections,
  createClassSectionController,
  listClassCurriculum,
  listHifzStages,
};
