// ==========================================
// ISM - Islamic School Management
// Institution / Tenant Management Core
// ==========================================

(function () {

    "use strict";


    // ======================================
    // Storage Key
    // ======================================

    const INSTITUTE_KEY =
        "ISM_INSTITUTION";


    // ======================================
    // Current Development Tenant
    // ======================================
    // Darul Quran is only an institution/user.
    // It is NOT the master platform identity.

    const DEFAULT_INSTITUTION = {

        id: "DQ001",

        code: "DQ",

        name:
            "Darul Quran Ahmadia Madrasah",

        shortName:
            "Darul Quran",

        type:
            "Madrasa",

        country:
            "Bangladesh",

        status:
            "active",

        branding: {

            logo: "",

            primaryColor:
                "#087f3d",

            secondaryColor:
                "#123b63"

        }

    };


    // ======================================
    // Save Institution
    // ======================================

    function setInstitution(
        institution
    ) {

        if (!institution) {

            return false;

        }


        localStorage.setItem(

            INSTITUTE_KEY,

            JSON.stringify(
                institution
            )

        );


        return true;

    }


    // ======================================
    // Get Current Institution
    // ======================================

    function getInstitution() {

        const saved =
            localStorage.getItem(
                INSTITUTE_KEY
            );


        if (!saved) {

            return DEFAULT_INSTITUTION;

        }


        try {

            const institution =
                JSON.parse(saved);


            return (
                institution
                ||
                DEFAULT_INSTITUTION
            );

        }

        catch (error) {

            console.error(
                "Institution data error:",
                error
            );


            return DEFAULT_INSTITUTION;

        }

    }


    // ======================================
    // Institution ID
    // ======================================

    function getInstitutionId() {

        const institution =
            getInstitution();


        return institution
            ? institution.id
            : null;

    }


    // ======================================
    // Institution Code
    // ======================================

    function getInstitutionCode() {

        const institution =
            getInstitution();


        return institution
            ? institution.code
            : null;

    }


    // ======================================
    // Institution Name
    // ======================================

    function getInstitutionName() {

        const institution =
            getInstitution();


        return institution
            ? institution.name
            : "";

    }


    // ======================================
    // Institution Logo
    // ======================================

    function getInstitutionLogo() {

        const institution =
            getInstitution();


        if (

            institution

            &&

            institution.branding

            &&

            institution.branding.logo

        ) {

            return (
                institution
                    .branding
                    .logo
            );

        }


        return "";

    }


    // ======================================
    // Institution Active Check
    // ======================================

    function isInstitutionActive() {

        const institution =
            getInstitution();


        return (

            institution

            &&

            institution.status ===
            "active"

        );

    }


    // ======================================
    // Clear Institution
    // ======================================

    function clearInstitution() {

        localStorage.removeItem(
            INSTITUTE_KEY
        );

    }


    // ======================================
    // Global API
    // ======================================

    window.DEFAULT_INSTITUTION =
        DEFAULT_INSTITUTION;


    window.setInstitution =
        setInstitution;


    window.getInstitution =
        getInstitution;


    window.getInstitutionId =
        getInstitutionId;


    window.getInstitutionCode =
        getInstitutionCode;


    window.getInstitutionName =
        getInstitutionName;


    window.getInstitutionLogo =
        getInstitutionLogo;


    window.isInstitutionActive =
        isInstitutionActive;


    window.clearInstitution =
        clearInstitution;


})();
