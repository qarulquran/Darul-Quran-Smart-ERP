// ==========================================
// Darul Quran Ahmadia Madrasah
// Smart ERP Fee Collection System
// Core-Compatible Final Version
// ==========================================

(function () {

    "use strict";


    const LEGACY_STUDENT_KEY = "students";
    const LEGACY_FEE_KEY = "fees";
    const LAST_RECEIPT_KEY = "lastReceipt";


    let selectedStudent = null;


    // ======================================
    // Institution
    // ======================================

    function getInstitutionSafe() {

        try {

            if (
                typeof window.getInstitution ===
                "function"
            ) {

                return (
                    window.getInstitution()
                    ||
                    {
                        id: "DQ001",
                        code: "DQ"
                    }
                );

            }

        } catch (error) {

            console.error(
                "Institution error:",
                error
            );

        }


        return {
            id: "DQ001",
            code: "DQ"
        };

    }


    // ======================================
    // Students
    // ======================================

    function getStudents() {

        try {

            if (
                typeof window.getRecords ===
                "function"
            ) {

                const coreStudents =
                    window.getRecords("students");


                if (
                    Array.isArray(coreStudents)
                    &&
                    coreStudents.length > 0
                ) {

                    return coreStudents;

                }

            }

        } catch (error) {

            console.error(
                "Core student error:",
                error
            );

        }


        const data =
            localStorage.getItem(
                LEGACY_STUDENT_KEY
            );


        if (!data) {
            return [];
        }


        try {

            const students =
                JSON.parse(data);


            return Array.isArray(students)
                ? students
                : [];

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

                const coreFees =
                    window.getRecords("fees");


                if (
                    Array.isArray(coreFees)
                ) {

                    return coreFees;

                }

            }

        } catch (error) {

            console.error(
                "Core fee error:",
                error
            );

        }


        const data =
            localStorage.getItem(
                LEGACY_FEE_KEY
            );


        if (!data) {
            return [];
        }


        try {

            const fees =
                JSON.parse(data);


            return Array.isArray(fees)
                ? fees
                : [];

        } catch (error) {

            return [];

        }

    }


    // ======================================
    // Save Fees
    // ======================================

    function saveFees(fees) {

        let savedToCore = false;


        try {

            if (
                typeof window.saveRecords ===
                "function"
            ) {

                window.saveRecords(
                    "fees",
                    fees
                );

                savedToCore = true;

            }

        } catch (error) {

            console.error(
                "Core fee save error:",
                error
            );

        }


        // Keep legacy storage for
        // backward compatibility.

        localStorage.setItem(
            LEGACY_FEE_KEY,
            JSON.stringify(fees)
        );


        return savedToCore;

    }


    // ======================================
    // Save Students
    // ======================================

    function saveStudents(students) {

        try {

            if (
                typeof window.saveRecords ===
                "function"
            ) {

                window.saveRecords(
                    "students",
                    students
                );

            }

        } catch (error) {

            console.error(
                "Core student save error:",
                error
            );

        }


        localStorage.setItem(
            LEGACY_STUDENT_KEY,
            JSON.stringify(students)
        );

    }


    // ======================================
    // Search Student
    // ======================================

    function searchStudent() {

        const input =
            document.getElementById(
                "studentCodeInput"
            );


        if (!input) {
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


        const students =
            getStudents();


        const institution =
            getInstitutionSafe();


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
                        item.institutionId ===
                        institution.id;


                    return (
                        sameCode
                        &&
                        sameInstitution
                    );

                }
            );


        if (!student) {

            selectedStudent = null;

            clearStudentInfo();


            alert(
                "Student Not Found"
            );

            return;

        }


        selectedStudent =
            student;


        showStudentInfo(
            student
        );

    }


    // ======================================
    // Display Student
    // ======================================

    function showStudentInfo(student) {

        const name =
            document.getElementById(
                "studentName"
            );


        const studentClass =
            document.getElementById(
                "studentClass"
            );


        const father =
            document.getElementById(
                "fatherName"
            );


        if (name) {

            name.innerText =
                student.name || "-";

        }


        if (studentClass) {

            studentClass.innerText =
                student.admissionClass
                || "-";

        }


        if (father) {

            father.innerText =
                student.fatherName
                || "-";

        }

    }


    // ======================================
    // Clear Student
    // ======================================

    function clearStudentInfo() {

        [
            "studentName",
            "studentClass",
            "fatherName"
        ]
        .forEach(
            function (id) {

                const element =
                    document.getElementById(id);


                if (element) {

                    element.innerText =
                        "-";

                }

            }
        );

    }


    // ======================================
    // Receipt Number
    // ======================================

    function generateReceiptNo() {

        const institution =
            getInstitutionSafe();


        const code =
            institution.code
            || "DQ";


        const year =
            new Date()
                .getFullYear();


        const serial =
            Date.now()
                .toString()
                .slice(-8);


        return (

            String(code)
                .toUpperCase()

            +

            "-REC-"

            +

            year

            +

            "-"

            +

            serial

        );

    }


    // ======================================
    // Update Admission Status
    // ======================================

    function updateAdmissionStatus(
        studentCode
    ) {

        const students =
            getStudents();


        const updated =
            students.map(
                function (student) {

                    if (
                        student.studentCode
                        ===
                        studentCode
                    ) {

                        return {

                            ...student,

                            admissionFeeStatus:
                                "Paid",

                            admissionStatus:
                                "Confirmed",

                            updatedAt:
                                new Date()
                                    .toISOString()

                        };

                    }


                    return student;

                }
            );


        saveStudents(
            updated
        );


        selectedStudent =
            updated.find(
                function (student) {

                    return (
                        student.studentCode
                        ===
                        studentCode
                    );

                }
            )
            ||
            selectedStudent;

    }


    // ======================================
    // Save Payment
    // ======================================

    function saveFee() {

        if (!selectedStudent) {

            alert(
                "Please Search Student First"
            );

            return;

        }


        const amountInput =
            document.getElementById(
                "amount"
            );


        const feeTypeInput =
            document.getElementById(
                "feeType"
            );


        const monthInput =
            document.getElementById(
                "feeMonth"
            );


        const methodInput =
            document.getElementById(
                "paymentMethod"
            );


        if (
            !amountInput
            ||
            !feeTypeInput
            ||
            !monthInput
            ||
            !methodInput
        ) {

            alert(
                "Payment form is incomplete."
            );

            return;

        }


        const amount =
            Number(
                amountInput.value
            );


        if (
            !Number.isFinite(amount)
            ||
            amount <= 0
        ) {

            alert(
                "Enter a valid amount."
            );

            return;

        }


        const institution =
            getInstitutionSafe();


        const receiptNo =
            generateReceiptNo();


        const fee = {

            id:
                Date.now(),

            institutionId:
                selectedStudent.institutionId
                ||
                institution.id,

            institutionCode:
                selectedStudent.institutionCode
                ||
                institution.code,

            studentCode:
                selectedStudent.studentCode,

            studentName:
                selectedStudent.name,

            fatherName:
                selectedStudent.fatherName,

            admissionClass:
                selectedStudent.admissionClass,

            feeType:
                feeTypeInput.value,

            month:
                monthInput.value,

            amount:
                amount,

            paymentMethod:
                methodInput.value,

            paymentDate:
                new Date()
                    .toLocaleDateString(
                        "en-GB"
                    ),

            paymentDateISO:
                new Date()
                    .toISOString(),

            receiptNo:
                receiptNo,

            status:
                "Paid"

        };


        // ----------------------------------
        // Save Payment
        // ----------------------------------

        const fees =
            getFees();


        fees.push(
            fee
        );


        saveFees(
            fees
        );


        // ----------------------------------
        // Admission Fee Control
        // ----------------------------------

        if (
            fee.feeType
            ===
            "Admission Fee"
        ) {

            updateAdmissionStatus(
                fee.studentCode
            );

        }


        // ----------------------------------
        // Receipt Cache
        // ----------------------------------

        localStorage.setItem(

            LAST_RECEIPT_KEY,

            JSON.stringify(
                fee
            )

        );


        alert(

            "Payment Saved Successfully\n\n" +

            "Receipt No:\n" +

            receiptNo

        );


        window.location.href =
            "receipt.html";

    }


    // ======================================
    // Open Receipt
    // ======================================

    function openReceipt() {

        const data =
            localStorage.getItem(
                LAST_RECEIPT_KEY
            );


        if (!data) {

            alert(
                "No Receipt Found"
            );

            return;

        }


        window.location.href =
            "receipt.html";

    }


    // ======================================
    // Logout
    // ======================================

    function logout() {

        if (
            typeof window.logout ===
            "function"
        ) {

            window.logout();

            return;

        }


        localStorage.removeItem(
            "ERP_SESSION"
        );


        localStorage.removeItem(
            "currentUser"
        );


        window.location.href =
            "index.html";

    }


    // ======================================
    // Global Functions
    // ======================================

    window.searchStudent =
        searchStudent;

    window.saveFee =
        saveFee;

    window.openReceipt =
        openReceipt;

    window.logout =
        logout;

})();
