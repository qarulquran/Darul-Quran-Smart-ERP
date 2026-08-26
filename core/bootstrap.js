// ==========================================
// Darul Quran Smart ERP
// Core Bootstrap & Integration Layer
// ==========================================


(function () {

    "use strict";


    // ======================================
    // Core Startup
    // ======================================

    function initializeERP() {

        // ----------------------------------
        // Current Institution
        // ----------------------------------

        if (
            typeof window.getInstitution === "function"
        ) {

            const institution =
                window.getInstitution();

            window.CURRENT_INSTITUTION =
                institution;

        }


        // ----------------------------------
        // Current Language
        // ----------------------------------

        if (
            typeof window.getCurrentLanguage === "function"
        ) {

            window.CURRENT_LANGUAGE =
                window.getCurrentLanguage();

        }


        // ----------------------------------
        // Language Direction
        // ----------------------------------

        if (
            typeof window.applyLanguageDirection === "function"
        ) {

            window.applyLanguageDirection();

        }


        // ----------------------------------
        // Current Session
        // ----------------------------------

        if (
            typeof window.getSession === "function"
        ) {

            window.CURRENT_SESSION =
                window.getSession();

        }


        // ----------------------------------
        // Legacy Data Migration
        // ----------------------------------
        // IMPORTANT:
        // This copies old localStorage data
        // into the institution-specific
        // database namespace.
        //
        // Original old data is NOT deleted.

        if (
            typeof window.migrateLegacyCollection === "function"
        ) {

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

                    } catch (error) {

                        console.error(
                            "Migration failed:",
                            collection,
                            error
                        );

                    }

                }
            );

        }


        // ----------------------------------
        // ERP Ready Flag
        // ----------------------------------

        window.ERP_READY = true;


        document.dispatchEvent(
            new CustomEvent("erpReady")
        );


    }


    // ======================================
    // Start
    // ======================================

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeERP
        );

    } else {

        initializeERP();

    }


})();
