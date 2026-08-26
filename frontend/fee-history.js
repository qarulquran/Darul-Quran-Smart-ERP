// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP Fee History
// Core-Compatible Final Version
// ==========================================

(function () {

    "use strict";


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
                    &&
                    records.length > 0
                ) {

                    return records;

                }

            }

        } catch (error) {

            console.error(
                "Core student error:",
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
                "Core fee error:",
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
    // Search Fee History
    // ======================================

    function searchFeeHistory() {

        const input =
            document.getElementById(
                "studentCode"
            );


        const studentInfo =
            document.getElementById(
                "studentInfo"
            );


        const historyBox =
            document.getElementById(
                "history"
            );


        if (
            !input
            ||
            !studentInfo
            ||
            !historyBox
        ) {

            return;

        }


        const code =
            input.value
                .trim();


        if (!code) {

            alert(
                "Enter Student Code"
            );

            return;

        }


        const institutionId =
            getInstitutionIdSafe();


        // ==================================
        // Find Student
        // ==================================

        const students =
            getStudents();


        const student =
            students.find(
                function (item) {

                    const sameCode =
                        String(
                            item.studentCode
                            || ""
                        )
                        .toLowerCase()
                        ===
                        code.toLowerCase();


                    const sameInstitution =
                        !item.institutionId
                        ||
                        item.institutionId
                        ===
                        institutionId;


                    return (
                        sameCode
                        &&
                        sameInstitution
                    );

                }
            );


        if (!student) {

            studentInfo.innerHTML = "";

            historyBox.innerHTML = "";


            alert(
                "Student Not Found"
            );

            return;

        }


        // ==================================
        // Student Information
        // ==================================

        studentInfo.innerHTML = `

            <div class="student-card">

                <h3>
                    Student Information
                </h3>

                <p>
                    <b>Name:</b>
                    ${escapeHTML(
                        student.name || "-"
                    )}
                </p>

                <p>
                    <b>Student Code:</b>
                    ${escapeHTML(
                        student.studentCode || "-"
                    )}
                </p>

                <p>
                    <b>Class:</b>
                    ${escapeHTML(
                        student.admissionClass || "-"
                    )}
                </p>

                <p>
                    <b>Father:</b>
                    ${escapeHTML(
                        student.fatherName || "-"
                    )}
                </p>

            </div>

        `;


        // ==================================
        // Get Student Fees
        // ==================================

        const fees =
            getFees();


        const studentFees =
            fees.filter(
                function (fee) {

                    const sameStudent =
                        fee.studentCode
                        ===
                        student.studentCode;


                    const sameInstitution =
                        !fee.institutionId
                        ||
                        fee.institutionId
                        ===
                        institutionId;


                    return (
                        sameStudent
                        &&
                        sameInstitution
                    );

                }
            );


        if (
            studentFees.length ===
            0
        ) {

            historyBox.innerHTML = `

                <h3>
                    No Fee Payment Found
                </h3>

            `;

            return;

        }


        // ==================================
        // Calculate Totals
        // ==================================

        let totalPaid = 0;

        let monthlyPaid = 0;

        let otherPaid = 0;


        let rows = "";


        studentFees.forEach(
            function (fee) {

                const amount =
                    Number(
                        fee.amount
                    )
                    ||
                    0;


                totalPaid +=
                    amount;


                if (
                    fee.feeType
                    ===
                    "Monthly Fee"
                ) {

                    monthlyPaid +=
                        amount;

                } else {

                    otherPaid +=
                        amount;

                }


                rows += `

                    <tr>

                        <td>
                            ${escapeHTML(
                                fee.month || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                fee.feeType || "-"
                            )}
                        </td>

                        <td>
                            ৳ ${amount.toLocaleString(
                                "en-BD"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                fee.paymentMethod || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                fee.paymentDate || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                fee.receiptNo || "-"
                            )}
                        </td>

                    </tr>

                `;

            }
        );


        // ==================================
        // Display History
        // ==================================

        historyBox.innerHTML = `

            <h3>
                Fee History
            </h3>


            <div class="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Month
                            </th>

                            <th>
                                Fee Type
                            </th>

                            <th>
                                Amount
                            </th>

                            <th>
                                Method
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Receipt
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>


            <div class="fee-summary">

                <h3>
                    Payment Summary
                </h3>


                <p>
                    <b>
                        Monthly Fee Paid:
                    </b>

                    ৳ ${monthlyPaid.toLocaleString(
                        "en-BD"
                    )}
                </p>


                <p>
                    <b>
                        Other Fee Paid:
                    </b>

                    ৳ ${otherPaid.toLocaleString(
                        "en-BD"
                    )}
                </p>


                <h2>

                    Total Paid:
                    ৳ ${totalPaid.toLocaleString(
                        "en-BD"
                    )}

                </h2>

            </div>

        `;

    }


    // ======================================
    // Global Function
    // ======================================

    window.searchFeeHistory =
        searchFeeHistory;


})();
