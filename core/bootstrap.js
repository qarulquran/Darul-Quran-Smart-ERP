// ==========================================
// ISM - Islamic School Management
// Core Bootstrap & Integration Layer
// ==========================================

(function () {

    "use strict";


    // ======================================
    // Default Development User
    // ======================================
    // Development environment only.
    // Production authentication must be
    // handled server-side.

    const DEFAULT_ADMIN = {

        id: "USR-DQ001-ADMIN-001",

        username: "admin",

        password: "12345",

        name: "System Administrator",

        role: "INSTITUTION_ADMIN",

        institutionId: "DQ001",

        language: "bn",

        status: "active",

        createdAt:
            new Date().toISOString()

    };


    // ======================================
    // Ensure Institution
    // ======================================

    function ensureInstitution() {

        if (
            typeof window.getInstitution !==
            "function"
        ) {

            return;

        }


        const institution =
            window.getInstitution();


        if (!institution) {

            return;

        }


        /*
         * Save the current institution so
         * future tenant switching can use
         * the same structure.
         */

        if (
            typeof window.setInstitution ===
            "function"
        ) {

            window.setInstitution(
                institution
            );

        }


        window.CURRENT_INSTITUTION =
            institution;

    }


    // ======================================
    // Ensure Initial User
    // ======================================

    function ensureInitialUser() {

        let users = [];


        try {

            const saved =
                localStorage.getItem(
                    "users"
                );


            users =
                saved
                    ? JSON.parse(saved)
                    : [];


            if (!Array.isArray(users)) {

                users = [];

            }

        }

        catch (error) {

            console.error(
                "User database error:",
                error
            );

            users = [];

        }


        /*
         * Never overwrite existing users.
         */

        const existingAdmin =
            users.find(
                function (user) {

                    return (
                        user.username
                            ===
                        DEFAULT_ADMIN.username

                        &&

                        user.institutionId
                            ===
                        DEFAULT_ADMIN.institutionId
                    );

                }
            );


        if (!existingAdmin) {

            users.push(
                DEFAULT_ADMIN
            );


            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );

        }


        window.ISM_USERS =
            users;

    }


    // ======================================
    // Current Language
    // ======================================

    function initializeLanguage() {

        if (
            typeof window.getCurrentLanguage ===
            "function"
        ) {

            window.CURRENT_LANGUAGE =
                window.getCurrentLanguage();

        }


        if (
            typeof window.applyLanguageDirection ===
            "function"
        ) {

            window.applyLanguageDirection();

        }

    }


    // ======================================
    // Current Session
    // ======================================

    function initializeSession() {

        if (
            typeof window.getSession ===
            "function"
        ) {

            window.CURRENT_SESSION =
                window.getSession();

        }

    }


    // ======================================
    // Legacy Data Migration
    // ======================================

    function migrateLegacyData() {

        if (
            typeof window.migrateLegacyCollection !==
            "function"
        ) {

            return;

        }


        const collections = [

            "students",

            "fees",

            "attendance",

            "teachers",

            "results",

            "payments",

            "notifications"

        ];


        collections.forEach(
            function (collection) {

                try {

                    window.migrateLegacyCollection(
                        collection
                    );

                }

                catch (error) {

                    console.error(

                        "Migration failed:",

                        collection,

                        error

                    );

                }

            }
        );

    }


    // ======================================
    // Current Institution Context
    // ======================================

    function initializeInstitutionContext() {

        const institution =
            window.CURRENT_INSTITUTION;


        if (!institution) {

            return;

        }


        window.CURRENT_INSTITUTION_ID =
            institution.id || "DQ001";


        window.CURRENT_INSTITUTION_CODE =
            institution.code || "DQ";

    }


    // ======================================
    // ERP Startup
    // ======================================

    function initializeERP() {

        try {

            // ------------------------------
            // Institution
            // ------------------------------

            ensureInstitution();


            // ------------------------------
            // Initial Development User
            // ------------------------------

            ensureInitialUser();


            // ------------------------------
            // Language
            // ------------------------------

            initializeLanguage();


            // ------------------------------
            // Session
            // ------------------------------

            initializeSession();


            // ------------------------------
            // Institution Context
            // ------------------------------

            initializeInstitutionContext();


            // ------------------------------
            // Legacy Migration
            // ------------------------------

            migrateLegacyData();


            // ------------------------------
            // Ready
            // ------------------------------

            window.ERP_READY =
                true;


            document.dispatchEvent(

                new CustomEvent(
                    "erpReady"
                )

            );


        }

        catch (error) {

            console.error(
                "ISM bootstrap failed:",
                error
            );


            window.ERP_READY =
                false;


            document.dispatchEvent(

                new CustomEvent(
                    "erpBootstrapError",
                    {
                        detail: error
                    }
                )

            );

        }

    }


    // ======================================
    // Start
    // ======================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeERP
        );

    }

    else {

        initializeERP();

    }


})();
