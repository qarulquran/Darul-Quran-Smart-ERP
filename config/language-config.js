// =====================================
// Darul Quran Smart ERP
// Language Configuration System
// =====================================


const LANGUAGE_CONFIG = {


    // Default Language

    defaultLanguage: "bn",



    // Supported Languages

    languages: {


        bn: {

            name: "বাংলা",

            direction: "ltr"

        },



        en: {

            name: "English",

            direction: "ltr"

        },



        ar: {

            name: "العربية",

            direction: "rtl"

        }


    }



};





// Get Current Language

function getCurrentLanguage(){


    return localStorage.getItem(

        "erp_language"

    ) || LANGUAGE_CONFIG.defaultLanguage;


}






// Change Language

function changeLanguage(language){



    if(

        LANGUAGE_CONFIG.languages[language]

    ){


        localStorage.setItem(

            "erp_language",

            language

        );


        window.location.reload();


    }


}







// Apply Direction

function applyLanguageDirection(){



    let lang = getCurrentLanguage();



    document.documentElement.dir =

    LANGUAGE_CONFIG.languages[lang].direction;



}






window.LANGUAGE_CONFIG = LANGUAGE_CONFIG;

window.getCurrentLanguage = getCurrentLanguage;

window.changeLanguage = changeLanguage;

window.applyLanguageDirection = applyLanguageDirection;
