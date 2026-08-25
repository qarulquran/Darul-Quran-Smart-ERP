// =====================================
// Darul Quran Smart ERP
// Application Configuration
// =====================================


const APP_CONFIG = {


    // Software Identity

    name: "Darul Quran Smart ERP",


    version: "1.0.0",


    platform: "Multi Institution Education ERP",



    // Language Support

    defaultLanguage: "bn",


    supportedLanguages: [

        "bn",
        "en",
        "ar"

    ],



    // Country

    country: "Bangladesh",



    // System Mode

    mode: "development",



    // Multi Institution Support

    multiInstitution: true,



    // Module Control

    features: {


        student: true,

        admission: true,

        fee: true,

        attendance: true,

        result: true,

        teacher: true,

        finance: true,


        payroll: false,

        library: false,

        inventory: false,

        hostel: false


    }



};



// Global Access

window.APP_CONFIG = APP_CONFIG;
