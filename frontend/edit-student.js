// ==========================================
// Darul Quran Smart ERP
// Edit Student System
// Core-Compatible Final Version
// ==========================================

(function () {

    "use strict";


    const LEGACY_KEY = "students";


    // ==========================================
    // Institution
    // ==========================================

    function getSafeInstitution() {

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


    // ==========================================
    // Read Legacy Students
    // ==========================================

    function getLegacyStudents() {

        const data =
            localStorage.getItem(
                LEGACY_KEY
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

            console.error(
                "Student data error:",
                error
            );

            return [];

        }

    }


    // ==========================================
    // Core Students
    // ==========================================

    function getCoreStudents() {

        try {

            if (
                typeof window.getRecords ===
                "function"
            ) {

                const records =
                    window.getRecords(
                        "students"
                    );

                return Array.isArray(records)
                    ? records
                    : [];

            }

        } catch (error) {

            console.error(
                "Core database error:",
                error
            );

        }

        return [];

    }


    function saveCoreStudents(
        students
    ) {

        try {

            if (
                typeof window.saveRecords ===
                "function"
            ) {

                window.saveRecords(
                    "students",
                    students
                );

                return true;

            }

        } catch (error) {

            console.error(
                "Core save error:",
                error
            );

        }

        return false;

    }


    function saveLegacyStudents(
        students
    ) {

        localStorage.setItem(

            LEGACY_KEY,

            JSON.stringify(
                students
            )

        );

    }


    // ==========================================
    // Get All Students
    // ==========================================

    function getStudents() {

        const coreStudents =
            getCoreStudents();


        if (
            coreStudents.length > 0
        ) {

            return coreStudents;

        }


        return getLegacyStudents();

    }


    // ==========================================
    // Selected Student
    // ==========================================

    const oldStudentCode =

        localStorage.getItem(
            "editStudent"
        );


    if (!oldStudentCode) {

        alert(
            "No student selected."
        );

        window.location.href =
            "students.html";

        return;

    }


    // ==========================================
    // Find Student
    // ==========================================

    let students =
        getStudents();


    let student =
        students.find(
            function (item) {

                return (

                    String(
                        item.studentCode
                        || ""
                    )
                    ===
                    String(
                        oldStudentCode
                    )

                );

            }
        );


    if (!student) {

        alert(
            "Student Not Found"
        );

        window.location.href =
            "students.html";

        return;

    }


    // ==========================================
    // Fill Form
    // ==========================================

    function setValue(
        id,
        value
    ) {

        const element =
            document.getElementById(id);


        if (element) {

            element.value =
                value || "";

        }

    }


    setValue(
        "studentName",
        student.name
    );


    setValue(
        "fatherName",
        student.fatherName ||
        student.father
    );


    setValue(
        "motherName",
        student.motherName ||
        student.mother
    );


    setValue(
        "dateOfBirth",
        student.dateOfBirth
    );


    setValue(
        "studentClass",
        student.admissionClass ||
        student.className
    );


    setValue(
        "mobile",
        student.guardianMobile ||
        student.mobile
    );



    // ------------------------------------------
    // Address Compatibility
    // ------------------------------------------

    let addressText = "";


    if (
        student.address
        &&
        typeof student.address === "object"
    ) {

        addressText = [

            student.address.division,

            student.address.district,

            student.address.thana,

            student.address.union,

            student.address.ward,

            student.address.village,

            student.address.details

        ]
        .filter(Boolean)
        .join(", ");

    } else {

        addressText =
            student.address || "";

    }


    setValue(
        "address",
        addressText
    );



    const codeDisplay =
        document.getElementById(
            "studentCodeDisplay"
        );


    if (codeDisplay) {

        codeDisplay.innerText =
            student.studentCode || "-";

    }


    // ==========================================
    // Update Form
    // ==========================================

    const editForm =
        document.getElementById(
            "editForm"
        );


    if (!editForm) {
        return;
    }


    editForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // ----------------------------------
            // Read New Values
            // ----------------------------------

            const newName =
                document
                    .getElementById(
                        "studentName"
                    )
                    .value
                    .trim();


            const newFather =
                document
                    .getElementById(
                        "fatherName"
                    )
                    .value
                    .trim();


            const newMother =
                document
                    .getElementById(
                        "motherName"
                    )
                    .value
                    .trim();


            const newDob =
                document
                    .getElementById(
                        "dateOfBirth"
                    )
                    .value;


            const newClass =
                document
                    .getElementById(
                        "studentClass"
                    )
                    .value;


            const newMobile =
                document
                    .getElementById(
                        "mobile"
                    )
                    .value
                    .trim();


            const newAddress =
                document
                    .getElementById(
                        "address"
                    )
                    .value
                    .trim();



            // ----------------------------------
            // Validation
            // ----------------------------------

            if (!newName) {

                alert(
                    "Please enter student name."
                );

                return;

            }


            if (!newClass) {

                alert(
                    "Please select class."
                );

                return;

            }



            // ----------------------------------
            // Preserve Identity Fields
            // ----------------------------------

            const institution =
                getSafeInstitution();


            const updatedStudent = {

                ...student,

                // Permanent identity
                id:
                    student.id ||
                    Date.now(),

                studentCode:
                    student.studentCode,

                institutionId:
                    student.institutionId ||
                    institution.id,

                institutionCode:
                    student.institutionCode ||
                    institution.code,


                // Updated information

                name:
                    newName,

                fatherName:
                    newFather,

                motherName:
                    newMother,

                dateOfBirth:
                    newDob,

                admissionClass:
                    newClass,

                guardianMobile:
                    newMobile,

                address:
                    newAddress,


                updatedAt:
                    new Date()
                    .toISOString()

            };



            // ----------------------------------
            // Replace Record
            // ----------------------------------

            const updatedStudents =
                students.map(
                    function (item) {

                        if (
                            String(
                                item.studentCode
                            )
                            ===
                            String(
                                oldStudentCode
                            )
                        ) {

                            return updatedStudent;

                        }


                        return item;

                    }
                );



            // ----------------------------------
            // Save Core
            // ----------------------------------

            saveCoreStudents(
                updatedStudents
            );


            // ----------------------------------
            // Legacy Compatibility
            // ----------------------------------

            saveLegacyStudents(
                updatedStudents
            );



            // ----------------------------------
            // Keep Selected Student Reference
            // ----------------------------------

            localStorage.setItem(

                "selectedStudent",

                updatedStudent.studentCode

            );


            localStorage.setItem(

                "editStudent",

                updatedStudent.studentCode

            );



            alert(
                "Student Updated Successfully"
            );


            window.location.href =
                "students.html";

        }
    );

})();
