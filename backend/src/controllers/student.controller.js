/**
 * ISM Smart ERP
 * Student Controller
 *
 * Handles student HTTP requests
 * and delegates business logic to student.service.
 */

const {
  createStudent,
  listStudents,
} = require("../services/student.service");

// --------------------------------------------------
// Create Student Controller
// --------------------------------------------------

const createStudentController = async (
  req,
  res,
  next
) => {
  try {
    const student =
      await createStudent({
        instituteId:
          req.institute.id,

        data:
          req.body || {},
      });

    return res.status(201).json({
      success: true,

      message:
        "Student created successfully",

      data: {
        student,
      },

      requestId:
        req.requestId,
    });
  } catch (error) {
    return next(error);
  }
};

// --------------------------------------------------
// List Students Controller
// --------------------------------------------------

const listStudentsController = async (
  req,
  res,
  next
) => {
  try {
    const students =
      await listStudents({
        instituteId:
          req.institute.id,
      });

    return res.status(200).json({
      success: true,

      message:
        "Students retrieved successfully",

      data: {
        students,
        total:
          students.length,
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
  createStudentController,
  listStudentsController,
};
