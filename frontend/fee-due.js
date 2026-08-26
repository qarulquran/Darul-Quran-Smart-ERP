// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP Fee Due Management
// Core-Compatible Final Version
// ==========================================

(function () {

    "use strict";


    // ======================================
    // Monthly Fee
    // ======================================

    const monthlyFee = {

        "শিশু শ্রেণী": 500,

        "প্রথম শ্রেণী": 600,

        "দ্বিতীয় শ্রেণি": 600,

        "তৃতীয় শ্রেণী": 600,

        "চতুর্থ শ্রেণী": 600,

        "পঞ্চম শ্রেণী": 700,

        "ষষ্ঠ শ্রেণি": 800,

        "Class 1": 600,

        "Class 2": 600,

        "Class 3": 600,

        "Class 4": 600,

        "Class 5": 700,

        "Class 6": 800

    };


    // ======================================
    // Other Fee Default Setup
    // ======================================

    const otherFeeSetup = {

        "Admission Fee": 1000,

        "Exam Fee": 500,

        "ID Card Fee": 200,

        "Book Fee": 500,

        "Uniform Fee": 800,

        "Tour Fee": 1000,

        "Certificate Fee": 500,

        "Other Fee": 0

    };


    // ======================================
    // Students
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
    // Fees
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
    // Institution
    // ======================================

    function getInstitutionIdSafe() {

        try {

            if (
                typeof window.getInstitutionId ===
                "function"
            ) {

                return (
                    window.getInstitutionId()
                    ||
                    "DQ001"
                );

            }

        } catch (error) {

            console.error(
                "Institution error:",
                error
            );

        }


        return "DQ001";
    }


    // ======================================
    // Month Difference
    // ======================================

    function monthDifference(
        startDate,
        endDate
    ) {

        return (

            (
                endDate.getFullYear()
                -
                startDate.getFullYear()
            )
            * 12

            +

            (
                endDate.getMonth()
                -
                startDate.getMonth()
            )

            +

            1

        );

    }


    // ======================================
    // Load Due
    // ======================================

    function loadDue() {

        const students =
            getStudents();


        const fees =
            getFees();


        const institutionId =
            getInstitutionIdSafe();


        const filterElement =
            document.getElementById(
                "feeFilter"
            );


        const table =
            document.getElementById(
                "dueTable"
            );


        const totalElement =
            document.getElementById(
                "totalDue"
            );


        if (
            !filterElement
            ||
            !table
            ||
            !totalElement
        ) {

            return;

        }


        const filter =
            filterElement.value;


        table.innerHTML =
            "";


        let totalDue =
            0;


        students.forEach(
            function (student) {


                // --------------------------------
                // Institution Isolation
                // --------------------------------

                if (
                    student.institutionId
                    &&
                    student.institutionId
                    !==
                    institutionId
                ) {

                    return;

                }


                const studentFees =
                    fees.filter(
                        function (fee) {

                            return (

                                fee.studentCode
                                ===
                                student.studentCode

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


                // =================================
                // Monthly Fee
                // =================================

                if (
                    filter === "All"
                    ||
                    filter ===
                    "Monthly Fee"
                ) {


                    let monthlyPaid = 0;


                    studentFees.forEach(
                        function (fee) {

                            if (
                                fee.feeType
                                ===
                                "Monthly Fee"
                            ) {

                                monthlyPaid +=
                                    Number(
                                        fee.amount
                                    )
                                    ||
                                    0;

                            }

                        }
                    );


                    let monthlyDue = 0;


                    if (
                        student.admissionDate
                    ) {

                        const startDate =
                            new Date(
                                student.admissionDate
                            );


                        const today =
                            new Date();


                        let months =
                            monthDifference(
                                startDate,
                                today
                            );


                        if (
                            months < 0
                        ) {

                            months = 0;

                        }


                        const classFee =
                            monthlyFee[
                                student.admissionClass
                            ]
                            ||
                            0;


                        const expected =
                            months *
                            classFee;


                        monthlyDue =
                            expected
                            -
                            monthlyPaid;


                        if (
                            monthlyDue < 0
                        ) {

                            monthlyDue = 0;

                        }


                        if (
                            monthlyDue > 0
                        ) {

                            addRow(

                                table,

                                student,

                                "Monthly Fee",

                                monthlyPaid,

                                expected,

                                monthlyDue

                            );


                            totalDue +=
                                monthlyDue;

                        }

                    }

                }


                // =================================
                // Other Fees
                // =================================

                Object.keys(
                    otherFeeSetup
                )
                .forEach(
                    function (feeType) {


                        if (
                            filter !== "All"
                            &&
                            filter !== feeType
                        ) {

                            return;

                        }


                        const paid =
                            studentFees
                                .filter(
                                    function (fee) {

                                        return (
                                            fee.feeType
                                            ===
                                            feeType
                                        );

                                    }
                                )
                                .reduce(
                                    function (
                                        sum,
                                        fee
                                    ) {

                                        return (
                                            sum
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


                        /*
                         * IMPORTANT:
                         *
                         * Other fees are NOT automatically
                         * due for every student.
                         *
                         * They become due when an explicit
                         * obligation record exists.
                         *
                         * Supported fields:
                         *   expectedAmount
                         *   feeDueAmount
                         *   dueAmount
                         *
                         * This prevents every student from
                         * being incorrectly shown as owing
                         * every optional fee.
                         */


                        const obligation =
                            studentFees
                                .filter(
                                    function (fee) {

                                        return (
                                            fee.feeType
                                            ===
                                            feeType

                                            &&

                                            (
                                                fee.expectedAmount
                                                !==
                                                undefined

                                                ||

                                                fee.feeDueAmount
                                                !==
                                                undefined

                                                ||

                                                fee.dueAmount
                                                !==
                                                undefined
                                            )
                                        );

                                    }
                                );


                        let expected =
                            0;


                        if (
                            obligation.length > 0
                        ) {

                            expected =
                                obligation
                                    .reduce(
                                        function (
                                            sum,
                                            fee
                                        ) {

                                            return (
                                                sum
                                                +
                                                Number(
                                                    fee.expectedAmount
                                                    ??
                                                    fee.feeDueAmount
                                                    ??
                                                    fee.dueAmount
                                                    ??
                                                    0
                                                )
                                            );

                                        },
                                        0
                                    );

                        }


                        if (
                            expected <= 0
                        ) {

                            return;

                        }


                        const due =
                            Math.max(
                                0,
                                expected - paid
                            );


                        if (
                            due > 0
                        ) {

                            addRow(

                                table,

                                student,

                                feeType,

                                paid,

                                expected,

                                due

                            );


                            totalDue +=
                                due;

                        }

                    }
                );

            }
        );


        totalElement.innerText =
            totalDue.toLocaleString(
                "en-BD"
            );

    }


    // ======================================
    // Add Table Row
    // ======================================

    function addRow(
        table,
        student,
        feeType,
        paid,
        expected,
        due
    ) {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    student.name || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    student.admissionClass || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    feeType
                )}
            </td>

            <td>
                ৳ ${Number(
                    paid
                ).toLocaleString(
                    "en-BD"
                )}
            </td>

            <td>
                ৳ ${Number(
                    expected
                ).toLocaleString(
                    "en-BD"
                )}
            </td>

            <td>
                ৳ ${Number(
                    due
                ).toLocaleString(
                    "en-BD"
                )}
            </td>

        `;


        table.appendChild(
            row
        );

    }


    // ======================================
    // HTML Escape
    // ======================================

    function escapeHTML(value) {

        return String(
            value === undefined
            ||
            value === null
                ? ""
                : value
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }


    // ======================================
    // Global
    // ======================================

    window.loadDue =
        loadDue;


    // ======================================
    // Start
    // ======================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            loadDue
        );

    } else {

        loadDue();

    }


})();
