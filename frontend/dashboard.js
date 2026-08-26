// ==========================================
// ISM - Islamic School Management
// Master Dashboard Controller
// Institution-aware + Core Database
// ==========================================

(function () {

    "use strict";


    const MONTHLY_FEES = {

        "শিশু শ্রেণী": 500,
        "প্রথম শ্রেণী": 600,
        "দ্বিতীয় শ্রেণি": 600,
        "তৃতীয় শ্রেণী": 600,
        "চতুর্থ শ্রেণি": 600,
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
    // Institution
    // ======================================

    function getInstitutionId() {

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

        return "DQ001";

    }


    // ======================================
    // Safe Database Read
    // ======================================

    function getRecordsSafe(
        collection
    ) {

        try {

            if (
                typeof window.getRecords ===
                "function"
            ) {

                const records =
                    window.getRecords(
                        collection
                    );


                if (
                    Array.isArray(records)
                ) {

                    return records;

                }

            }

        } catch (error) {

            console.error(
                "Core data error:",
                collection,
                error
            );

        }


        try {

            const data =
                localStorage.getItem(
                    collection
                );


            const records =
                data
                    ? JSON.parse(data)
                    : [];


            return Array.isArray(records)
                ? records
                : [];

        } catch (error) {

            console.error(
                "Legacy data error:",
                collection,
                error
            );


            return [];

        }

    }


    // ======================================
    // Institution-filtered Data
    // ======================================

    function getInstitutionRecords(
        collection
    ) {

        const institutionId =
            getInstitutionId();


        return getRecordsSafe(
            collection
        )
        .filter(
            function (item) {

                return (

                    !item.institutionId

                    ||

                    item.institutionId
                    ===
                    institutionId

                );

            }
        );

    }


    // ======================================
    // Format Money
    // ======================================

    function formatMoney(
        value
    ) {

        return (

            "৳"

            +

            Number(
                value || 0
            )
            .toLocaleString(
                "en-BD"
            )

        );

    }


    // ======================================
    // Date Helpers
    // ======================================

    function startOfToday() {

        const date =
            new Date();


        date.setHours(
            0,
            0,
            0,
            0
        );


        return date;

    }


    function startOfMonth() {

        const date =
            new Date();


        return new Date(
            date.getFullYear(),
            date.getMonth(),
            1
        );

    }


    // ======================================
    // Institution Name
    // ======================================

    function loadInstitutionIdentity() {

        const element =
            document.getElementById(
                "dashboardInstitutionName"
            );


        if (
            !element
            ||
            typeof window.getInstitutionName !==
            "function"
        ) {

            return;

        }


        element.textContent =
            window.getInstitutionName()
            ||
            "-";

    }


    // ======================================
    // Current Date
    // ======================================

    function loadDate() {

        const element =
            document.getElementById(
                "dashboardDate"
            );


        if (!element) {

            return;

        }


        element.textContent =
            new Date().toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );

    }


    // ======================================
    // Main Summary
    // ======================================

    function loadSummary() {

        const students =
            getInstitutionRecords(
                "students"
            );


        const teachers =
            getInstitutionRecords(
                "teachers"
            );


        const fees =
            getInstitutionRecords(
                "fees"
            );


        const attendance =
            getInstitutionRecords(
                "attendance"
            );


        const today =
            startOfToday();


        const monthStart =
            startOfMonth();


        const activeStudents =
            students.filter(
                function (student) {

                    return (
                        student.status !==
                        "inactive"
                    );

                }
            );


        const monthlyFees =
            fees.filter(
                function (fee) {

                    if (
                        fee.status
                        &&
                        fee.status !==
                        "Paid"
                    ) {

                        return false;

                    }


                    if (
                        fee.paymentDateISO
                    ) {

                        return (
                            new Date(
                                fee.paymentDateISO
                            )
                            >=
                            monthStart
                        );

                    }


                    return false;

                }
            );


        const todayFees =
            fees.filter(
                function (fee) {

                    if (
                        fee.status
                        &&
                        fee.status !==
                        "Paid"
                    ) {

                        return false;

                    }


                    if (
                        fee.paymentDateISO
                    ) {

                        return (
                            new Date(
                                fee.paymentDateISO
                            )
                            >=
                            today
                        );

                    }


                    return (
                        fee.paymentDate
                        ===
                        today.toLocaleDateString(
                            "en-GB"
                        )
                    );

                }
            );


        const monthlyCollection =
            monthlyFees.reduce(
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


        const paidToday =
            todayFees.reduce(
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


        const present =
            attendance.filter(
                function (record) {

                    return (
                        record.status
                        ===
                        "Present"
                    );

                }
            ).length;


        const totalAttendance =
            attendance.length;


        const attendancePercentage =
            totalAttendance > 0

                ?

                Math.round(
                    (
                        present
                        /
                        totalAttendance
                    )
                    *
                    100
                )

                :

                0;


        const currentYear =
            new Date()
                .getFullYear();


        const newAdmissions =
            students.filter(
                function (student) {

                    if (
                        !student.admissionDate
                    ) {

                        return false;

                    }


                    const admission =
                        new Date(
                            student.admissionDate
                        );


                    return (
                        admission.getFullYear()
                        ===
                        currentYear
                    );

                }
            ).length;


        setText(
            "totalStudents",
            activeStudents.length
        );


        setText(
            "totalTeachers",
            teachers.length
        );


        setText(
            "monthlyFee",
            formatMoney(
                monthlyCollection
            )
        );


        setText(
            "attendance",
            attendancePercentage +
            "%"
        );


        setText(
            "newAdmission",
            newAdmissions
        );


        setText(
            "paidThisMonth",
            formatMoney(
                monthlyCollection
            )
        );


        return {

            students:
                activeStudents,

            teachers:
                teachers,

            fees:
                fees,

            attendance:
                attendance,

            monthlyCollection:
                monthlyCollection,

            paidToday:
                paidToday

        };

    }


    // ======================================
    // Due Calculation
    // ======================================

    function calculateDue() {

        const students =
            getInstitutionRecords(
                "students"
            );


        const fees =
            getInstitutionRecords(
                "fees"
            );


        let monthlyDue = 0;

        let otherDue = 0;


        students.forEach(
            function (student) {

                const studentFees =
                    fees.filter(
                        function (fee) {

                            return (
                                fee.studentCode
                                ===
                                student.studentCode
                            );

                        }
                    );


                // --------------------------
                // Monthly Fee
                // --------------------------

                let monthlyPaid =
                    studentFees
                        .filter(
                            function (fee) {

                                return (

                                    fee.feeType
                                    ===
                                    "Monthly Fee"

                                    &&

                                    fee.status
                                    ===
                                    "Paid"

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

                        (
                            (
                                today
                                    .getFullYear()
                                -
                                startDate
                                    .getFullYear()
                            )
                            *
                            12
                        )

                        +

                        (
                            today
                                .getMonth()
                            -
                            startDate
                                .getMonth()
                        )

                        +

                        1;


                    months =
                        Math.max(
                            0,
                            months
                        );


                    const classFee =
                        Number(
                            MONTHLY_FEES[
                                student.admissionClass
                            ]
                            ||
                            0
                        );


                    const expected =
                        months *
                        classFee;


                    monthlyDue +=
                        Math.max(
                            0,
                            expected -
                            monthlyPaid
                        );

                }


                // --------------------------
                // Explicit Other Obligations
                // --------------------------

                studentFees.forEach(
                    function (fee) {

                        if (
                            fee.feeType ===
                            "Monthly Fee"
                        ) {

                            return;

                        }


                        const expected =
                            Number(

                                fee.expectedAmount
                                ??
                                fee.feeDueAmount
                                ??
                                fee.dueAmount
                                ??
                                0

                            );


                        if (
                            expected <=
                            0
                        ) {

                            return;

                        }


                        const paid =
                            Number(
                                fee.amount
                            )
                            ||
                            0;


                        if (
                            fee.status ===
                            "Paid"
                        ) {

                            otherDue +=
                                Math.max(
                                    0,
                                    expected -
                                    paid
                                );

                        }

                    }
                );

            }
        );


        const totalDue =
            monthlyDue
            +
            otherDue;


        setText(
            "monthlyDueAmount",
            formatMoney(
                monthlyDue
            )
        );


        setText(
            "otherDueAmount",
            formatMoney(
                otherDue
            )
        );


        setText(
            "totalDueAmount",
            formatMoney(
                totalDue
            )
        );


        return {

            monthlyDue:
                monthlyDue,

            otherDue:
                otherDue,

            totalDue:
                totalDue

        };

    }


    // ======================================
    // Recent Payments
    // ======================================

    function loadRecentPayments() {

        const container =
            document.getElementById(
                "recentPayments"
            );


        if (!container) {

            return;

        }


        const fees =
            getInstitutionRecords(
                "fees"
            )
            .slice();


        fees.sort(
            function (
                a,
                b
            ) {

                return (

                    new Date(
                        b.paymentDateISO
                        ||
                        b.paymentDate
                        ||
                        0
                    )

                    -

                    new Date(
                        a.paymentDateISO
                        ||
                        a.paymentDate
                        ||
                        0
                    )

                );

            }
        );


        const recent =
            fees.slice(
                0,
                5
            );


        if (
            recent.length ===
            0
        ) {

            container.innerHTML =
                `
                    <div class="empty-state">
                        No Data Found
                    </div>
                `;

            return;

        }


        container.innerHTML =
            recent.map(
                function (fee) {

                    return `

                        <div
                            class="activity-row">

                            <div
                                class="activity-row-main">

                                <strong>
                                    ${escapeHTML(
                                        fee.studentName
                                        ||
                                        fee.studentCode
                                        ||
                                        "-"
                                    )}
                                </strong>


                                <small>
                                    ${escapeHTML(
                                        fee.feeType
                                        ||
                                        "-"
                                    )}
                                </small>

                            </div>


                            <div
                                class="activity-row-side">

                                <strong>
                                    ${formatMoney(
                                        fee.amount
                                    )}
                                </strong>


                                <small>
                                    ${escapeHTML(
                                        fee.paymentDate
                                        ||
                                        "-"
                                    )}
                                </small>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

    }


    // ======================================
    // Recent Admissions
    // ======================================

    function loadRecentAdmissions() {

        const container =
            document.getElementById(
                "recentAdmission"
            );


        if (!container) {

            return;

        }


        const students =
            getInstitutionRecords(
                "students"
            )
            .slice();


        students.sort(
            function (
                a,
                b
            ) {

                return (

                    new Date(
                        b.createdAt
                        ||
                        b.admissionDate
                        ||
                        0
                    )

                    -

                    new Date(
                        a.createdAt
                        ||
                        a.admissionDate
                        ||
                        0
                    )

                );

            }
        );


        const recent =
            students.slice(
                0,
                5
            );


        if (
            recent.length ===
            0
        ) {

            container.innerHTML =
                `
                    <div class="empty-state">
                        No Data Found
                    </div>
                `;

            return;

        }


        container.innerHTML =
            recent.map(
                function (student) {

                    return `

                        <div
                            class="activity-row">

                            <div
                                class="activity-row-main">

                                <strong>
                                    ${escapeHTML(
                                        student.name
                                        ||
                                        "-"
                                    )}
                                </strong>


                                <small>
                                    ${escapeHTML(
                                        student.admissionClass
                                        ||
                                        "-"
                                    )}
                                </small>

                            </div>


                            <div
                                class="activity-row-side">

                                <strong>
                                    ${escapeHTML(
                                        student.studentCode
                                        ||
                                        "-"
                                    )}
                                </strong>


                                <small>
                                    ${escapeHTML(
                                        student.admissionDate
                                        ||
                                        "-"
                                    )}
                                </small>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

    }


    // ======================================
    // Charts
    // ======================================

    function loadCharts() {

        if (
            typeof Chart ===
            "undefined"
        ) {

            console.warn(
                "Chart.js is not available."
            );

            return;

        }


        const students =
            getInstitutionRecords(
                "students"
            );


        const attendance =
            getInstitutionRecords(
                "attendance"
            );


        const fees =
            getInstitutionRecords(
                "fees"
            );


        const studentCanvas =
            document.getElementById(
                "studentChart"
            );


        const attendanceCanvas =
            document.getElementById(
                "attendanceChart"
            );


        const incomeCanvas =
            document.getElementById(
                "incomeChart"
            );


        // ----------------------------------
        // Student Chart
        // ----------------------------------

        if (
            studentCanvas
        ) {

            const classMap =
                {};


            students.forEach(
                function (student) {

                    const className =
                        student.admissionClass
                        ||
                        "Unknown";


                    classMap[className] =
                        (
                            classMap[
                                className
                            ]
                            ||
                            0
                        )
                        +
                        1;

                }
            );


            const labels =
                Object.keys(
                    classMap
                )
                .slice(
                    0,
                    10
                );


            const values =
                labels.map(
                    function (label) {

                        return classMap[
                            label
                        ];

                    }
                );


            new Chart(
                studentCanvas,
                {

                    type: "bar",

                    data: {

                        labels:
                            labels.length
                                ? labels
                                : ["No Data"],

                        datasets: [

                            {

                                label:
                                    "Students",

                                data:
                                    labels.length
                                        ? values
                                        : [0]

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio:
                            false

                    }

                }
            );

        }


        // ----------------------------------
        // Attendance Chart
        // ----------------------------------

        if (
            attendanceCanvas
        ) {

            const present =
                attendance.filter(
                    function (record) {

                        return (
                            record.status
                            ===
                            "Present"
                        );

                    }
                ).length;


            const absent =
                Math.max(
                    0,
                    attendance.length -
                    present
                );


            new Chart(
                attendanceCanvas,
                {

                    type:
                        "doughnut",

                    data: {

                        labels: [

                            "Present",
                            "Absent"

                        ],

                        datasets: [

                            {

                                data: [

                                    present,
                                    absent

                                ]

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio:
                            false,

                        cutout:
                            "68%"

                    }

                }
            );

        }


        // ----------------------------------
        // Income Chart
        // ----------------------------------

        if (
            incomeCanvas
        ) {

            const monthNames = [

                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"

            ];


            const year =
                new Date()
                    .getFullYear();


            const values =
                monthNames.map(
                    function (
                        _,
                        index
                    ) {

                        return fees
                            .filter(
                                function (fee) {

                                    if (
                                        !fee.paymentDateISO
                                        ||
                                        fee.status !==
                                        "Paid"
                                    ) {

                                        return false;

                                    }


                                    const date =
                                        new Date(
                                            fee.paymentDateISO
                                        );


                                    return (

                                        date.getFullYear()
                                        ===
                                        year

                                        &&

                                        date.getMonth()
                                        ===
                                        index

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

                    }
                );


            new Chart(
                incomeCanvas,
                {

                    type:
                        "line",

                    data: {

                        labels:
                            monthNames,

                        datasets: [

                            {

                                label:
                                    "Collection",

                                data:
                                    values,

                                tension:
                                    0.35,

                                fill:
                                    false

                            }

                        ]

                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false

                    }

                }
            );

        }

    }


    // ======================================
    // Set Text
    // ======================================

    function setText(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.textContent =
                value;

        }

    }


    // ======================================
    // HTML Escape
    // ======================================

    function escapeHTML(
        value
    ) {

        return String(
            value ??
            ""
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
    // Initialize
    // ======================================

    function initializeDashboard() {

        loadInstitutionIdentity();

        loadDate();

        loadSummary();

        calculateDue();

        loadRecentPayments();

        loadRecentAdmissions();

        loadCharts();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeDashboard
        );

    } else {

        initializeDashboard();

    }


})();
