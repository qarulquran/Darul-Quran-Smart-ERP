// ==========================================
// Darul Quran Smart ERP
// Authentication Core
// Unified Login + Session System
// ==========================================

(function () {

    "use strict";


    // ======================================
    // Storage Keys
    // ======================================

    const USERS_KEY = "users";
    const SESSION_KEY = "ERP_SESSION";


    // ======================================
    // Read Users
    // ======================================

    function getUsers() {

        const data =
            localStorage.getItem(USERS_KEY);

        if (!data) {
            return [];
        }

        try {

            const users =
                JSON.parse(data);

            return Array.isArray(users)
                ? users
                : [];

        } catch (error) {

            console.error(
                "User data error:",
                error
            );

            return [];
        }
    }


    // ======================================
    // Find User
    // ======================================

    function findUser(
        username,
        password
    ) {

        const users = getUsers();

        return users.find(function (user) {

            return (
                String(user.username || "")
                    .trim()
                    .toLowerCase()
                ===
                String(username || "")
                    .trim()
                    .toLowerCase()
            )
            &&
            String(user.password || "")
                ===
            String(password || "");

        }) || null;
    }


    // ======================================
    // Create Unified Session
    // ======================================

    function createLoginSession(user) {

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
                getSavedLanguage(),

            loginTime:
                new Date().toISOString()

        };


        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(session)
        );


        return session;
    }


    // ======================================
    // Login
    // ======================================

    function login(
        username,
        password
    ) {

        const user =
            findUser(
                username,
                password
            );


        if (!user) {

            return {

                success: false,

                message:
                    "Invalid Username or Password",

                user: null

            };
        }


        if (
            user.status &&
            user.status !== "active"
        ) {

            return {

                success: false,

                message:
                    "This account is inactive",

                user: null

            };
        }


        const session =
            createLoginSession(user);


        return {

            success: true,

            message:
                "Login Successful",

            user: user,

            session: session

        };
    }


    // ======================================
    // Get Current Session
    // ======================================

    function getCurrentSession() {

        const data =
            localStorage.getItem(
                SESSION_KEY
            );


        if (!data) {
            return null;
        }


        try {

            return JSON.parse(data);

        } catch (error) {

            localStorage.removeItem(
                SESSION_KEY
            );

            return null;
        }
    }


    // ======================================
    // Get Current User
    // ======================================

    function getCurrentUser() {

        const session =
            getCurrentSession();


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
    // Login Status
    // ======================================

    function isLoggedIn() {

        return (
            getCurrentSession()
            !== null
        );
    }


    // ======================================
    // Logout
    // ======================================

    function logout() {

        localStorage.removeItem(
            SESSION_KEY
        );


        localStorage.removeItem(
            "currentUser"
        );


        window.location.href =
            "index.html";
    }


    // ======================================
    // Saved Language
    // ======================================

    function getSavedLanguage() {

        return (
            localStorage.getItem(
                "erp_language"
            )
            ||
            "bn"
        );
    }


    // ======================================
    // Current Role
    // ======================================

    function getCurrentRole() {

        const session =
            getCurrentSession();


        return session
            ? session.role
            : null;
    }


    // ======================================
    // Current Institution
    // ======================================

    function getCurrentInstitutionId() {

        const session =
            getCurrentSession();


        return session
            ? session.institutionId
            : null;
    }


    // ======================================
    // Protect Page
    // ======================================

    function requireLogin(
        redirectPage = "index.html"
    ) {

        if (!isLoggedIn()) {

            window.location.href =
                redirectPage;

            return false;
        }


        return true;
    }


    // ======================================
    // Global API
    // ======================================

    window.getUsers =
        getUsers;

    window.findUser =
        findUser;

    window.login =
        login;

    window.logout =
        logout;

    window.getCurrentSession =
        getCurrentSession;

    window.getCurrentUser =
        getCurrentUser;

    window.isLoggedIn =
        isLoggedIn;

    window.getCurrentRole =
        getCurrentRole;

    window.getCurrentInstitutionId =
        getCurrentInstitutionId;

    window.requireLogin =
        requireLogin;

})();
