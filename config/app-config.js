// ==========================================
// ISM - Islamic School Management
// Master Platform Configuration
// ==========================================

const APP_CONFIG = {

    // ======================================
    // MASTER PLATFORM IDENTITY
    // ======================================

    platform: {

        name: "ISM",

        fullName:
            "Islamic School Management",

        tagline:
            "Smart Management for Islamic Education",

        version:
            "1.0.0",

        type:
            "Multi-Institution Education Management Platform"

    },


    // ======================================
    // BRANDING
    // ======================================

    branding: {

        logo:
            "assets/images/ism-logo-horizontal.png",

        icon:
            "assets/images/ism-icon.png",

        favicon:
            "assets/images/ism-icon.png"

    },


    // ======================================
    // DEFAULT LANGUAGE
    // ======================================

    defaultLanguage: "bn",


    supportedLanguages: [

        "bn",
        "en",
        "ar"

    ],


    // ======================================
    // LANGUAGE DIRECTIONS
    // ======================================

    languageDirection: {

        bn: "ltr",

        en: "ltr",

        ar: "rtl"

    },


    // ======================================
    // COUNTRY / REGION
    // ======================================

    country: "Bangladesh",

    timezone:
        "Asia/Dhaka",


    // ======================================
    // MULTI-INSTITUTION
    // ======================================

    multiInstitution: true,


    multiTenant: true,


    // ======================================
    // CURRENT DEVELOPMENT MODE
    // ======================================

    mode: "development",


    // ======================================
    // MODULE CONTROL
    // ======================================

    features: {

        dashboard: true,

        students: true,

        admission: true,

        academic: true,

        classManagement: true,

        subjectManagement: true,

        routine: true,

        attendance: true,

        result: true,

        certificate: true,

        idCard: true,

        fee: true,

        finance: true,

        teachers: true,

        payroll: false,

        guardianPortal: false,

        onlinePayment: false,

        library: false,

        inventory: false,

        hostel: false,

        discipline: false,

        reports: true,

        auditLog: true,

        notifications: true

    }

};


// ==========================================
// Global Access
// ==========================================

window.APP_CONFIG = APP_CONFIG;
