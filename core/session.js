// ==========================================
// Darul Quran Smart ERP
// Unified Session Management
// ==========================================

(function () {

    "use strict";


    // ======================================
    // Session Configuration
    // ======================================

    const SESSION_KEY = "ERP_SESSION";

    const SESSION_TIMEOUT =
        24 * 60 * 60 * 1000; // 24 Hours


    // ======================================
    // Read Session
    // ======================================

    function getSession() {

        const data =
            localStorage.getItem(
                SESSION_KEY
            );


        if (!data) {
            return null;
        }


        try {

            const session =
                JSON.parse(data);


            // --------------------------------
            // Validate Login Time
            // --------------------------------

            if (session.loginTime) {

                const loginTime =
                    new Date(
                        session.loginTime
                    ).getTime();


                const now =
                    Date.now();


                if (
                    now - loginTime
                    >
                    SESSION_TIMEOUT
                ) {

                    destroySession();

                    return null;
                }
            }


            return session;

        } catch (error) {

            console.error(
                "Session data error:",
                error
            );


            destroySession();


            return null;
        }
    }


    // ======================================
    // Save Session
    // ======================================

    function saveSession(session) {

        if (!session) {
            return false;
        }


        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(session)
        );


        return true;
    }


    // ======================================
    // Create Session
    // ======================================

    function createSession(user) {

        if (!user) {
            return null;
        }


        const session = {

            userId:
                user.id || null,

            username:
                user.username || "",

            name:
                user.name || "",

            role:
                user.role || "STUDENT",

            institutionId:
                user.institutionId ||
                user.instituteId ||
                "DQ001",

            language:
                user.language ||
                localStorage.getItem(
                    "erp_language"
                ) ||
                "bn",

            loginTime:
                new Date().toISOString()

        };


        saveSession(session);


        return session;
    }


    // ======================================
    // Destroy Session
    // ======================================

    function destroySession() {

        localStorage.removeItem(
            SESSION_KEY
        );


        localStorage.removeItem(
            "currentUser"
        );

    }


    // ======================================
    // Check Session
    // ======================================

    function checkSession() {

        return getSession() !== null;
    }


    // ======================================
    // Current User
    // ======================================

    function getSessionUser() {

        const session =
            getSession();


        if (!session) {
            return null;
        }


        return {

            id:
                session.userId,

            username:
                session.username,

            name:
                session.name,

            role:
                session.role,

            institutionId:
                session.institutionId,

            language:
                session.language

        };
    }


    // ======================================
    // Current Role
    // ======================================

    function getSessionRole() {

        const session =
            getSession();


        return session
            ? session.role
            : null;
    }


    // ======================================
    // Current Institution
    // ======================================

    function getSessionInstitution() {

        const session =
            getSession();


        return session
            ? session.institutionId
            : null;
    }


    // ======================================
    // Refresh Session Time
    // ======================================

    function refreshSession() {

        const session =
            getSession();


        if (!session) {
            return false;
        }


        session.loginTime =
            new Date().toISOString();


        return saveSession(
            session
        );
    }


    // ======================================
    // Require Active Session
    // ======================================

    function requireSession(
        redirectPage = "index.html"
    ) {

        if (!checkSession()) {

            window.location.href =
                redirectPage;

            return false;
        }


        return true;
    }


    // ======================================
    // Global Access
    // ======================================

    window.SESSION_KEY =
        SESSION_KEY;

    window.getSession =
        getSession;

    window.saveSession =
        saveSession;

    window.createSession =
        createSession;

    window.destroySession =
        destroySession;

    window.checkSession =
        checkSession;

    window.getSessionUser =
        getSessionUser;

    window.getSessionRole =
        getSessionRole;

    window.getSessionInstitution =
        getSessionInstitution;

    window.refreshSession =
        refreshSession;

    window.requireSession =
        requireSession;


})();
