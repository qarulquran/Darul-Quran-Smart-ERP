// ==========================================
// Darul Quran Smart ERP
// Student Management System
// Core-Compatible Student List
// ==========================================

(function () {

    "use strict";


    // ==========================================
    // Configuration
    // ==========================================

    const LEGACY_KEY = "students";

    const DEFAULT_INSTITUTION_ID = "DQ001";


    // ==========================================
    // Get Current Institution ID
    // ==========================================

    function getSafeInstitutionId() {

        try {

            if (
                typeof window.getInstitutionId === "function"
            ) {

                return (
                    window.getInstitutionId()
                    || DEFAULT_INSTITUTION_ID
                );

            }

        } catch (error) {

            console.error(
                "Institution ID error:",
                error
            );

        }

        return DEFAULT_INSTITUTION_ID;
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
    // Save Legacy Students
    // ==========================================

    function saveLegacyStudents(students) {

        localStorage.setItem(

            LEGACY_KEY,

            JSON.stringify(students)

        );

    }


    // ==========================================
    // Get Core Students
    // ==========================================

    function getCoreStudents() {

        try {

            if (
                typeof window.getRecords !== "function"
            ) {

                return [];

            }


            const records =
                window.getRecords("students");


            return Array.isArray(records)
                ? records
                : [];

        } catch (error) {

            console.error(
                "Core student read error:",
                error
            );


            return [];

        }

    }


    // ==========================================
    // Save Core Students
    // ==========================================

    function saveCoreStudents(students) {

        try {

            if (
                typeof window.saveRecords === "function"
            ) {

                window.saveRecords(
                    "students",
                    students
                );

                return true;

            }

        } catch (error) {

            console.error(
                "Core student save error:",
                error
            );

        }

        return false;

    }


    // ==========================================
    // Prepare Student Record
    // ==========================================

    function prepareStudent(student) {

        const institutionId =
            student.institutionId
            ||
            student.instituteId
            ||
            getSafeInstitutionId();


        return {

            ...student,

            institutionId:
                institutionId

        };

    }


    // ==========================================
    // Migrate Legacy Data
    // ==========================================

    function migrateStudentsIfNeeded() {

        const legacyStudents =
            getLegacyStudents();


        if (
            !legacyStudents.length
        ) {

            return [];

        }


        const coreStudents =
            getCoreStudents();


        // If Core Database is available
        if (
            typeof window.getRecords === "function"
        ) {

            if (
                coreStudents.length === 0
            ) {

                const migratedStudents =
                    legacyStudents.map(
                        prepareStudent
                    );


                saveCoreStudents(
                    migratedStudents
                );


                return migratedStudents;

            }


            return coreStudents;

        }


        // Legacy mode
        return legacyStudents;

    }


    // ==========================================
    // Get Students
    // ==========================================

    function getStudents() {

        const students =
            migrateStudentsIfNeeded();


        return students.map(
            prepareStudent
        );

    }


    // ==========================================
    // Save Students
    // ==========================================

    function saveStudents(students) {

        const prepared =
            students.map(
                prepareStudent
            );


        // Save Core Database
        saveCoreStudents(
            prepared
        );


        // Keep legacy data synchronized
        // until complete migration is finished
        saveLegacyStudents(
            prepared
        );

    }


    // ==========================================
    // Global Student Data
    // ==========================================

    let allStudents =
        getStudents();


    // ==========================================
    // HTML Escape
    // ==========================================

    function escapeHTML(value) {

        return String(
            value === undefined ||
            value === null
                ? ""
                : value
        )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    }


    // ==========================================
    // Encode Student Code
    // ==========================================

    function encodeCode(code) {

        return encodeURIComponent(
            String(code || "")
        );

    }


    // ==========================================
    // Display Students
    // ==========================================

    function displayStudents(data) {

        const table =
            document.getElementById(
                "studentTable"
            );


        if (!table) {

            return;

        }


        table.innerHTML = "";


        if (
            !Array.isArray(data)
            ||
            data.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td colspan="8">

                        No Student Found

                    </td>

                </tr>

            `;

            return;

        }


        data.forEach(
            function (student) {

                const photo =
                    student.photo
                    ||
                    "https://via.placeholder.com/60";


                const code =
                    student.studentCode
                    || "";


                const name =
                    student.name
                    || "";


                const studentClass =
                    student.admissionClass
                    || "";


                const father =
                    student.fatherName
                    || "";


                const mobile =
                    student.guardianMobile
                    || "";


                const feeStatus =
                    student.feeStatus
                    || "Due";


                const safePhoto =
                    escapeHTML(photo);


                const safeCode =
                    escapeHTML(code);


                const safeName =
                    escapeHTML(name);


                const safeClass =
                    escapeHTML(studentClass);


                const safeFather =
                    escapeHTML(father);


                const safeMobile =
                    escapeHTML(mobile);


                const safeFeeStatus =
                    escapeHTML(feeStatus);


                const encodedCode =
                    encodeCode(code);


                table.innerHTML += `

                    <tr>

                        <td>

                            <img

                                src="${safePhoto}"

                                width="60"

                                height="60"

                                alt="Student Photo"

                                style="
                                    border-radius:50%;
                                    object-fit:cover;
                                "

                                onerror="
                                    this.src='https://via.placeholder.com/60';
                                "

                            >

                        </td>


                        <td>

                            ${safeCode}

                        </td>


                        <td>

                            ${safeName}

                        </td>


                        <td>

                            ${safeClass}

                        </td>


                        <td>

                            ${safeFather}

                        </td>


                        <td>

                            ${safeMobile}

                        </td>


                        <td>

                            ${safeFeeStatus}

                        </td>


                        <td>


                            <button

                                onclick="
                                    viewStudent(
                                        decodeURIComponent('${encodedCode}')
                                    )
                                "

                                class="view-btn"

                            >

                                👁 View

                            </button>



                            <button

                                onclick="
                                    editStudent(
                                        decodeURIComponent('${encodedCode}')
                                    )
                                "

                                class="edit-btn"

                            >

                                ✏ Edit

                            </button>



                            <button

                                onclick="
                                    deleteStudent(
                                        decodeURIComponent('${encodedCode}')
                                    )
                                "

                                class="delete-btn"

                            >

                                🗑 Delete

                            </button>


                        </td>


                    </tr>

                `;

            }
        );

    }


    // ==========================================
    // View Student
    // ==========================================

    function viewStudent(code) {

        localStorage.setItem(

            "selectedStudent",

            code

        );


        window.location.href =
            "student-profile.html";

    }


    // ==========================================
    // Edit Student
    // ==========================================

    function editStudent(code) {

        localStorage.setItem(

            "editStudent",

            code

        );


        window.location.href =
            "edit-student.html";

    }


    // ==========================================
    // Delete Student
    // ==========================================

    function deleteStudent(code) {

        const confirmDelete =
            confirm(
                "Delete this student?"
            );


        if (!confirmDelete) {

            return;

        }


        const students =
            getStudents();


        const filtered =
            students.filter(

                function (student) {

                    return (
                        String(
                            student.studentCode
                        )
                        !==
                        String(code)
                    );

                }

            );


        if (
            filtered.length ===
            students.length
        ) {

            alert(
                "Student not found"
            );

            return;

        }


        saveStudents(
            filtered
        );


        // Refresh global list

        allStudents =
            getStudents();


        alert(
            "Student Deleted Successfully"
        );


        displayStudents(
            allStudents
        );

    }


    // ==========================================
    // Search Students
    // ==========================================

    function searchStudents() {

        const searchInput =
            document.getElementById(
                "searchStudent"
            );


        if (!searchInput) {

            displayStudents(
                allStudents
            );

            return;

        }


        const value =
            searchInput.value
            .trim()
            .toLowerCase();


        if (!value) {

            displayStudents(
                allStudents
            );

            return;

        }


        const result =
            allStudents.filter(

                function (student) {

                    return (

                        String(
                            student.name || ""
                        )
                        .toLowerCase()
                        .includes(value)

                        ||

                        String(
                            student.studentCode || ""
                        )
                        .toLowerCase()
                        .includes(value)

                        ||

                        String(
                            student.guardianMobile || ""
                        )
                        .toLowerCase()
                        .includes(value)

                        ||

                        String(
                            student.fatherName || ""
                        )
                        .toLowerCase()
                        .includes(value)

                        ||

                        String(
                            student.admissionClass || ""
                        )
                        .toLowerCase()
                        .includes(value)

                    );

                }

            );


        displayStudents(
            result
        );

    }


    // ==========================================
    // Initialize Page
    // ==========================================

    function initializeStudentsPage() {

        allStudents =
            getStudents();


        displayStudents(
            allStudents
        );


        const searchButton =
            document.getElementById(
                "searchBtn"
            );


        const searchInput =
            document.getElementById(
                "searchStudent"
            );


        if (searchButton) {

            searchButton.onclick =
                searchStudents;

        }


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchStudents
            );


            searchInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        searchStudents();

                    }

                }
            );

        }

    }


    // ==========================================
    // Global Functions
    // ==========================================

    window.getStudents =
        getStudents;

    window.displayStudents =
        displayStudents;

    window.viewStudent =
        viewStudent;

    window.editStudent =
        editStudent;

    window.deleteStudent =
        deleteStudent;

    window.searchStudents =
        searchStudents;


    // ==========================================
    // Start
    // ==========================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeStudentsPage
        );

    } else {

        initializeStudentsPage();

    }


})();
