// ==========================================
// Darul Quran Smart ERP
// Add Student / Admission System
// Core-Compatible Final Version
// ==========================================

(function () {

    "use strict";


    // ==========================================
    // Configuration
    // ==========================================

    const LEGACY_KEY = "students";

    const DEFAULT_INSTITUTION_ID = "DQ001";

    const DEFAULT_INSTITUTION_CODE = "DQ";


    // ==========================================
    // Institution Helpers
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
                        id:
                            DEFAULT_INSTITUTION_ID,

                        code:
                            DEFAULT_INSTITUTION_CODE,

                        name:
                            "Darul Quran Ahmadia Madrasah"
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

            id:
                DEFAULT_INSTITUTION_ID,

            code:
                DEFAULT_INSTITUTION_CODE,

            name:
                "Darul Quran Ahmadia Madrasah"

        };

    }


    // ==========================================
    // Database Helpers
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
                "Core database read error:",
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
                "Core database save error:",
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

    function getAllStudents() {

        let coreStudents =
            getCoreStudents();


        if (
            coreStudents.length > 0
        ) {

            return coreStudents;

        }


        const legacyStudents =
            getLegacyStudents();


        if (
            legacyStudents.length > 0
        ) {

            const institution =
                getSafeInstitution();


            const migrated =
                legacyStudents.map(
                    function (student) {

                        return {

                            ...student,

                            institutionId:
                                student.institutionId
                                ||
                                institution.id,

                            institutionCode:
                                student.institutionCode
                                ||
                                institution.code

                        };

                    }
                );


            saveCoreStudents(
                migrated
            );


            saveLegacyStudents(
                migrated
            );


            return migrated;

        }


        return [];

    }


    // ==========================================
    // Bangladesh Location Data
    // ==========================================

    let locationData = {};



    const division =
        document.getElementById(
            "divisionSearch"
        );


    const district =
        document.getElementById(
            "districtSearch"
        );


    const thana =
        document.getElementById(
            "thanaSearch"
        );


    const union =
        document.getElementById(
            "unionSearch"
        );


    const ward =
        document.getElementById(
            "wardSearch"
        );



    // ==========================================
    // Load Location Database
    // ==========================================

    fetch(
        "../data/bangladesh-location.json"
    )

    .then(
        function (response) {

            if (!response.ok) {

                throw new Error(
                    "Location file could not be loaded."
                );

            }

            return response.json();

        }
    )

    .then(
        function (data) {

            locationData =
                data || {};

            loadDivision();

        }
    )

    .catch(
        function (error) {

            console.error(
                "Location Error:",
                error
            );

        }
    );


    // ==========================================
    // Load Division
    // ==========================================

    function loadDivision() {

        if (!division) {

            return;

        }


        division.innerHTML =
            "";


        const defaultOption =
            document.createElement(
                "option"
            );


        defaultOption.value = "";

        defaultOption.textContent =
            "Select Division";


        division.appendChild(
            defaultOption
        );


        Object.keys(
            locationData
        ).forEach(
            function (item) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    item;


                option.textContent =
                    item;


                division.appendChild(
                    option
                );

            }
        );

    }


    // ==========================================
    // Reset Child Locations
    // ==========================================

    function resetDistrict() {

        if (district) {

            district.innerHTML =
                "<option value=''>Select District</option>";

        }

    }


    function resetThana() {

        if (thana) {

            thana.innerHTML =
                "<option value=''>Select Thana</option>";

        }

    }


    function resetUnion() {

        if (union) {

            union.innerHTML =
                "<option value=''>Select Union</option>";

        }

    }


    function resetWard() {

        if (ward) {

            ward.innerHTML =
                "<option value=''>Select Ward</option>";

        }

    }


    // ==========================================
    // Division Change
    // ==========================================

    if (division) {

        division.addEventListener(
            "change",
            function () {

                resetDistrict();

                resetThana();

                resetUnion();

                resetWard();


                const divisionData =
                    locationData[
                        division.value
                    ];


                if (!divisionData) {

                    return;

                }


                Object.keys(
                    divisionData
                ).forEach(
                    function (item) {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            item;


                        option.textContent =
                            item;


                        district.appendChild(
                            option
                        );

                    }
                );

            }
        );

    }


    // ==========================================
    // District Change
    // ==========================================

    if (district) {

        district.addEventListener(
            "change",
            function () {

                resetThana();

                resetUnion();

                resetWard();


                const districtData =
                    locationData
                    [division.value]
                    [district.value];


                if (!districtData) {

                    return;

                }


                Object.keys(
                    districtData
                ).forEach(
                    function (item) {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            item;


                        option.textContent =
                            item;


                        thana.appendChild(
                            option
                        );

                    }
                );

            }
        );

    }


    // ==========================================
    // Thana Change
    // ==========================================

    if (thana) {

        thana.addEventListener(
            "change",
            function () {

                resetUnion();

                resetWard();


                const thanaData =
                    locationData
                    [division.value]
                    [district.value]
                    [thana.value];


                if (!thanaData) {

                    return;

                }


                Object.keys(
                    thanaData
                ).forEach(
                    function (item) {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            item;


                        option.textContent =
                            item;


                        union.appendChild(
                            option
                        );

                    }
                );

            }
        );

    }


    // ==========================================
    // Union Change
    // ==========================================

    if (union) {

        union.addEventListener(
            "change",
            function () {

                resetWard();


                const unionData =
                    locationData
                    [division.value]
                    [district.value]
                    [thana.value]
                    [union.value];


                if (!Array.isArray(
                    unionData
                )) {

                    return;

                }


                unionData.forEach(
                    function (item) {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            item;


                        option.textContent =
                            item;


                        ward.appendChild(
                            option
                        );

                    }
                );

            }
        );

    }


    // ==========================================
    // Get Admission Class Number
    // ==========================================

    function getClassCode(
        className
    ) {

        const value =
            String(
                className || ""
            ).trim();


        const match =
            value.match(
                /\d+/
            );


        if (match) {

            return match[0];

        }


        if (
            value.toLowerCase()
            === "play"
        ) {

            return "0";

        }


        if (
            value.toLowerCase()
            === "nursery"
        ) {

            return "N";

        }


        return "0";

    }


    // ==========================================
    // Generate Unique Student Code
    // ==========================================

    function generateStudentCode(
        className
    ) {

        const institution =
            getSafeInstitution();


        const institutionCode =
            institution.code
            ||
            DEFAULT_INSTITUTION_CODE;


        const classCode =
            getClassCode(
                className
            );


        const year =
            new Date()
            .getFullYear();


        const students =
            getAllStudents();


        const prefix =

            String(
                institutionCode
            ).toUpperCase()

            +

            "-" +

            classCode

            +

            "-" +

            year;


        let highestSerial = 0;


        students.forEach(
            function (student) {

                const code =
                    String(
                        student.studentCode
                        || ""
                    );


                if (
                    !code.startsWith(
                        prefix
                    )
                ) {

                    return;

                }


                const parts =
                    code.split("-");


                const lastPart =
                    parts[
                        parts.length - 1
                    ];


                const serial =
                    parseInt(
                        lastPart,
                        10
                    );


                if (
                    !Number.isNaN(
                        serial
                    )
                    &&
                    serial >
                    highestSerial
                ) {

                    highestSerial =
                        serial;

                }

            }
        );


        const nextSerial =
            highestSerial + 1;


        return (

            prefix

            +

            "-" +

            String(
                nextSerial
            ).padStart(
                5,
                "0"
            )

        );

    }


    // ==========================================
    // Convert Image To Base64
    // ==========================================

    function convertImageToBase64(
        file
    ) {

        return new Promise(
            function (resolve, reject) {

                if (!file) {

                    resolve("");

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function () {

                        resolve(
                            reader.result
                        );

                    };


                reader.onerror =
                    function () {

                        reject(
                            new Error(
                                "Image reading failed."
                            )
                        );

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    // ==========================================
    // Required Field Helper
    // ==========================================

    function getValue(
        id
    ) {

        const element =
            document.getElementById(id);


        return element
            ? element.value.trim()
            : "";

    }


    // ==========================================
    // Save Student
    // ==========================================

    const saveButton =
        document.getElementById(
            "saveStudentBtn"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            async function () {

                try {


                    // --------------------------------
                    // Required Information
                    // --------------------------------

                    const studentName =
                        getValue(
                            "studentName"
                        );


                    const fatherName =
                        getValue(
                            "fatherName"
                        );


                    const motherName =
                        getValue(
                            "motherName"
                        );


                    const className =
                        getValue(
                            "admissionClass"
                        );


                    const admissionDate =
                        getValue(
                            "admissionDate"
                        );


                    if (!studentName) {

                        alert(
                            "Please enter student name."
                        );

                        return;

                    }


                    if (!fatherName) {

                        alert(
                            "Please enter father name."
                        );

                        return;

                    }


                    if (!motherName) {

                        alert(
                            "Please enter mother name."
                        );

                        return;

                    }


                    if (!className) {

                        alert(
                            "Please select admission class."
                        );

                        return;

                    }


                    if (!admissionDate) {

                        alert(
                            "Please select admission date."
                        );

                        return;

                    }


                    // --------------------------------
                    // Institution
                    // --------------------------------

                    const institution =
                        getSafeInstitution();


                    // --------------------------------
                    // Student Code
                    // --------------------------------

                    const studentCode =
                        generateStudentCode(
                            className
                        );


                    // --------------------------------
                    // Photo
                    // --------------------------------

                    const photoInput =
                        document.getElementById(
                            "studentPhoto"
                        );


                    let photo = "";


                    if (
                        photoInput
                        &&
                        photoInput.files
                        &&
                        photoInput.files[0]
                    ) {

                        photo =
                            await convertImageToBase64(
                                photoInput.files[0]
                            );

                    }


                    // --------------------------------
                    // Present Address
                    // --------------------------------

                    const address = {

                        division:
                            division
                            ? division.value
                            : "",

                        district:
                            district
                            ? district.value
                            : "",

                        thana:
                            thana
                            ? thana.value
                            : "",

                        union:
                            union
                            ? union.value
                            : "",

                        ward:
                            ward
                            ? ward.value
                            : "",

                        village:
                            getValue(
                                "village"
                            ),

                        details:
                            getValue(
                                "presentAddress"
                            )

                    };


                    // --------------------------------
                    // Session
                    // --------------------------------

                    const currentYear =
                        new Date()
                        .getFullYear();


                    const session =
                        String(
                            currentYear
                        );


                    // --------------------------------
                    // Student Object
                    // --------------------------------

                    const student = {

                        id:
                            Date.now(),

                        institutionId:
                            institution.id
                            ||
                            DEFAULT_INSTITUTION_ID,

                        institutionCode:
                            institution.code
                            ||
                            DEFAULT_INSTITUTION_CODE,

                        studentCode:
                            studentCode,

                        name:
                            studentName,

                        dateOfBirth:
                            getValue(
                                "dateOfBirth"
                            ),

                        birthRegistration:
                            getValue(
                                "birthRegistration"
                            ),

                        bloodGroup:
                            getValue(
                                "bloodGroup"
                            ),

                        nationality:
                            getValue(
                                "nationality"
                            )
                            ||
                            "Bangladeshi",

                        fatherName:
                            fatherName,

                        fatherNid:
                            getValue(
                                "fatherNid"
                            ),

                        motherName:
                            motherName,

                        motherNid:
                            getValue(
                                "motherNid"
                            ),

                        guardianMobile:
                            getValue(
                                "guardianMobile"
                            ),

                        previousInstitution:
                            getValue(
                                "previousInstitution"
                            ),

                        previousClass:
                            getValue(
                                "previousClass"
                            ),

                        admissionClass:
                            className,

                        session:
                            session,

                        admissionDate:
                            admissionDate,

                        admissionStatus:
                            "Pending",

                        admissionFeeStatus:
                            "Due",

                        feeStatus:
                            "Due",

                        attendance:
                            "0%",

                        result:
                            "-",

                        address:
                            address,

                        permanentAddress:
                            getValue(
                                "permanentAddress"
                            ),

                        photo:
                            photo,

                        createdAt:
                            new Date()
                            .toISOString()

                    };


                    // --------------------------------
                    // Save To Core Database
                    // --------------------------------

                    const existing =
                        getAllStudents();


                    existing.push(
                        student
                    );


                    const coreSaved =
                        saveCoreStudents(
                            existing
                        );


                    // --------------------------------
                    // Legacy Compatibility
                    // --------------------------------

                    saveLegacyStudents(
                        existing
                    );


                    // --------------------------------
                    // Success
                    // --------------------------------

                    alert(

                        "Student Added Successfully\n\n"

                        +

                        "Student Code:\n"

                        +

                        studentCode

                        +

                        "\n\nAdmission Status:\n"

                        +

                        "Pending"

                    );


                    window.location.href =
                        "students.html";


                } catch (error) {

                    console.error(
                        "Student save error:",
                        error
                    );


                    alert(
                        "Student could not be saved.\nPlease try again."
                    );

                }

            }
        );

    }


})();
