// ==========================================
// Darul Quran Smart ERP
// Central Clearance & Business Rules Engine
// ==========================================

(function () {

    "use strict";


    // ======================================
    // Monthly Fee Configuration
    // ======================================

    const MONTHLY_FEES = {

        "শিশু শ্রেণী": 500,

        "প্রথম শ্রেণী": 600,

        "দ্বিতীয় শ্রেণী": 600,

        "তৃতীয় শ্রেণী": 600,

        "চতুর্থ শ্রেণী": 600,

        "পঞ্চম শ্রেণী": 700,

        "ষষ্ঠ শ্রেণী": 800,

        "Class 1": 600,

        "Class 2": 600,

        "Class 3": 600,

        "Class 4": 600,

        "Class 5": 700,

        "Class 6": 800

    };


    // ======================================
    // Institution ID
    // ======================================

    function getInstitutionId() {

        try {

            if (
                typeof window.getInstitutionId ===
                "function"
            ) {

                return (
                    window.getInstitutionId()
                    || "DQ001"
                );

            }

        } catch (error) {

            console.error(
                "Institution ID error:",
                error
            );

        }

        return "DQ001";
    }


    // ======================================
    // Get Students
    // ======================================

    function getStudents() {

        try {

            if (
                typeof window.getRecords ===
                "function"
            ) {

                const records =
                    window.getRecords(
                        "students"
                    );

                if (
                    Array.isArray(records)
                ) {

                    return records;

                }

            }

        } catch (error) {

            console.error(
                "Student database error:",
                error
            );

        }


        try {

            return JSON.parse(
                localStorage.getItem(
                    "students"
                )
            ) || [];

        } catch (error) {

            return [];

        }

    }


    // ======================================
    // Get Fees
    // ======================================

    function getFees() {

        try {

            if (
                typeof window.getRecords ===
                "function"
            ) {

                const records =
                    window.getRecords(
                        "fees"
                    );

                if (
                    Array.isArray(records)
                ) {

                    return records;

                }

            }

        } catch (error) {

            console.error(
                "Fee database error:",
                error
            );

        }


        try {

            return JSON.parse(
                localStorage.getItem(
                    "fees"
                )
            ) || [];

        } catch (error) {

            return [];

        }

    }


    // ======================================
    // Find Student
    // ======================================

    function getStudent(studentCode) {

        const institutionId =
            getInstitutionId();

        const students =
            getStudents();

        return (
            students.find(
                function (student) {

                    return (

                        student.studentCode
                        ===
                        studentCode

                        &&

                        (
                            !student.institutionId
                            ||
                            student.institutionId
                            ===
                            institutionId
                        )

                    );

                }
            )
            || null
        );

    }


    // ======================================
    // Get Student Fees
    // ======================================

    function getStudentFees(studentCode) {

        const institutionId =
            getInstitutionId();

        const fees =
            getFees();

        return fees.filter(
            function (fee) {

                return (

                    fee.studentCode
                    ===
                    studentCode

                    &&

                    (
                        !fee.institutionId
                        ||
                        fee.institutionId
                        ===
                        institutionId
                    )

                );

            }
        );

    }


    // ======================================
    // Admission Fee Clearance
    // ======================================

    function checkAdmissionClearance(
        studentCode
    ) {

        const student =
            getStudent(
                studentCode
            );

        if (!student) {

            return {

                allowed: false,

                status: "NOT_FOUND",

                message:
                    "Student not found."

            };

        }


        const fees =
            getStudentFees(
                studentCode
            );


        const admissionPayments =
            fees.filter(
                function (fee) {

                    return (
                        fee.feeType
                        ===
                        "Admission Fee"

                        &&
                        fee.status
                        ===
                        "Paid"
                    );

                }
            );


        const totalPaid =
            admissionPayments.reduce(
                function (
                    total,
                    fee
                ) {

                    return (
                        total
                        +
                        Number(
                            fee.amount
                        )
                    );

                },
                0
            );


        // Existing student status also counts

        const alreadyPaid =
            student.admissionFeeStatus
            ===
            "Paid";


        const cleared =
            alreadyPaid
            ||
            totalPaid > 0;


        return {

            allowed:
                cleared,

            status:
                cleared
                    ? "CLEARED"
                    : "DUE",

            paid:
                totalPaid,

            message:
                cleared
                    ? "Admission fee cleared."
                    : "Admission fee is pending."

        };

    }


    // ======================================
    // Calculate Monthly Fee
    // ======================================

    function calculateMonthlyDue(
        student
    ) {

        if (
            !student
            ||
            !student.admissionDate
        ) {

            return {

                expected: 0,

                paid: 0,

                due: 0

            };

        }


        const startDate =
            new Date(
                student.admissionDate
            );


        const today =
            new Date();


        let months =

            (
                (
                    today.getFullYear()
                    -
                    startDate.getFullYear()
                )
                * 12
            )

            +

            (
                today.getMonth()
                -
                startDate.getMonth()
            )

            +

            1;


        if (months < 0) {

            months = 0;

        }


        const monthlyAmount =
            Number(
                MONTHLY_FEES[
                    student.admissionClass
                ]
                || 0
            );


        const expected =
            months *
            monthlyAmount;


        const fees =
            getStudentFees(
                student.studentCode
            );


        const paid =
            fees
                .filter(
                    function (fee) {

                        return (
                            fee.feeType
                            ===
                            "Monthly Fee"
                        );

                    }
                )
                .reduce(
                    function (
                        total,
                        fee
                    ) {

                        return (
                            total
                            +
                            (
                                Number(
                                    fee.amount
                                )
                                ||
                                0
                            )
                        );

                    },
                    0
                );


        const due =
            Math.max(
                0,
                expected - paid
            );


        return {

            expected:
                expected,

            paid:
                paid,

            due:
                due

        };

    }


    // ======================================
    // Session Due
    // ======================================

    function getSessionDue(
        studentCode
    ) {

        const student =
            getStudent(
                studentCode
            );


        if (!student) {

            return 0;

        }


        return calculateMonthlyDue(
            student
        ).due;

    }


    // ======================================
    // Exam Fee Clearance
    // ======================================

    function checkExamFee(
        studentCode
    ) {

        const fees =
            getStudentFees(
                studentCode
            );


        const examFees =
            fees.filter(
                function (fee) {

                    return (
                        fee.feeType
                        ===
                        "Exam Fee"
                    );

                }
            );


        const totalPaid =
            examFees.reduce(
                function (
                    total,
                    fee
                ) {

                    return (
                        total
                        +
                        (
                            Number(
                                fee.amount
                            )
                            ||
                            0
                        )
                    );

                },
                0
            );


        const expected =
            examFees.reduce(
                function (
                    total,
                    fee
                ) {

                    return (
                        total
                        +
                        (
                            Number(
                                fee.expectedAmount
                                ??
                                fee.feeDueAmount
                                ??
                                0
                            )
                            ||
                            0
                        )
                    );

                },
                0
            );


        /*
         * No explicit exam-fee obligation:
         * do not block admit card.
         */

        if (expected <= 0) {

            return {

                allowed: true,

                status:
                    "NOT_REQUIRED",

                paid:
                    totalPaid,

                due:
                    0,

                message:
                    "No active exam fee obligation."

            };

        }


        const due =
            Math.max(
                0,
                expected - totalPaid
            );


        return {

            allowed:
                due === 0,

            status:
                due === 0
                    ? "CLEARED"
                    : "DUE",

            paid:
                totalPaid,

            due:
                due,

            message:
                due === 0
                    ? "Exam fee cleared."
                    : "Exam fee is pending."

        };

    }


    // ======================================
    // Certificate Clearance
    // ======================================

    function checkCertificateClearance(
        studentCode
    ) {

        const admission =
            checkAdmissionClearance(
                studentCode
            );


        if (!admission.allowed) {

            return {

                allowed: false,

                status:
                    "ADMISSION_DUE",

                due:
                    0,

                message:
                    "Admission fee must be cleared first."

            };

        }


        const sessionDue =
            getSessionDue(
                studentCode
            );


        if (sessionDue > 0) {

            return {

                allowed: false,

                status:
                    "SESSION_DUE",

                due:
                    sessionDue,

                message:
                    "Session dues must be cleared before certificate generation."

            };

        }


        return {

            allowed: true,

            status:
                "CLEARED",

            due:
                0,

            message:
                "Certificate clearance completed."

        };

    }


    // ======================================
    // Admit Card Clearance
    // ======================================

    function checkAdmitCardClearance(
        studentCode
    ) {

        const exam =
            checkExamFee(
                studentCode
            );


        if (!exam.allowed) {

            return {

                allowed: false,

                status:
                    "EXAM_FEE_DUE",

                due:
                    exam.due,

                message:
                    "Exam fee must be cleared before admit card generation."

            };

        }


        return {

            allowed: true,

            status:
                "CLEARED",

            due:
                0,

            message:
                "Admit card generation allowed."

        };

    }


    // ======================================
    // Complete Clearance Summary
    // ======================================

    function getClearanceSummary(
        studentCode
    ) {

        const admission =
            checkAdmissionClearance(
                studentCode
            );


        const exam =
            checkExamFee(
                studentCode
            );


        const sessionDue =
            getSessionDue(
                studentCode
            );


        const admitCard =
            checkAdmitCardClearance(
                studentCode
            );


        const certificate =
            checkCertificateClearance(
                studentCode
            );


        return {

            studentCode:
                studentCode,

            admission:
                admission,

            exam:
                exam,

            sessionDue:
                sessionDue,

            admitCard:
                admitCard,

            certificate:
                certificate,

            totalDue:
                sessionDue

        };

    }


    // ======================================
    // Global API
    // ======================================

    window.checkAdmissionClearance =
        checkAdmissionClearance;


    window.calculateMonthlyDue =
        calculateMonthlyDue;


    window.getSessionDue =
        getSessionDue;


    window.checkExamFee =
        checkExamFee;


    window.checkAdmitCardClearance =
        checkAdmitCardClearance;


    window.checkCertificateClearance =
        checkCertificateClearance;


    window.getClearanceSummary =
        getClearanceSummary;


})();
