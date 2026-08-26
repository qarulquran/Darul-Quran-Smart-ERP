// ==========================================
// ISM - Islamic School Management
// Global Language & Translation Engine
// Bengali / English / Arabic
// ==========================================

(function () {

    "use strict";


    // ======================================
    // Configuration
    // ======================================

    const LANGUAGE_STORAGE_KEY =
        "erp_language";


    const DEFAULT_LANGUAGE =
        "bn";


    const SUPPORTED_LANGUAGES = {

        bn: {
            name: "বাংলা",
            direction: "ltr",
            file: "bn.js"
        },

        en: {
            name: "English",
            direction: "ltr",
            file: "en.js"
        },

        ar: {
            name: "العربية",
            direction: "rtl",
            file: "ar.js"
        }

    };


    // ======================================
    // Translation Cache
    // ======================================

    const translations = {};


    // ======================================
    // Current Language
    // ======================================

    function getCurrentLanguage() {

        const saved =
            localStorage.getItem(
                LANGUAGE_STORAGE_KEY
            );


        if (
            saved &&
            SUPPORTED_LANGUAGES[saved]
        ) {

            return saved;

        }


        return DEFAULT_LANGUAGE;

    }


    // ======================================
    // Language Direction
    // ======================================

    function applyLanguageDirection(
        language
    ) {

        const lang =
            language ||
            getCurrentLanguage();


        const config =
            SUPPORTED_LANGUAGES[lang];


        if (!config) {
            return;
        }


        document.documentElement.lang =
            lang;


        document.documentElement.dir =
            config.direction;


        document.body.classList.toggle(
            "rtl-mode",
            config.direction === "rtl"
        );

    }


    // ======================================
    // Find Translation Resource Path
    // ======================================

    function getLanguageFilePath(
        language
    ) {

        const configScript =
            document.querySelector(
                'script[src*="language-config.js"]'
            );


        if (
            !configScript ||
            !configScript.src
        ) {

            return null;

        }


        try {

            return new URL(
                "../languages/" +
                SUPPORTED_LANGUAGES[language].file,
                configScript.src
            ).href;

        } catch (error) {

            console.error(
                "Language path error:",
                error
            );

            return null;

        }

    }


    // ======================================
    // Get Global Resource Name
    // ======================================

    function getResource(
        language
    ) {

        if (language === "bn") {

            return window.ISM_BN || null;

        }


        if (language === "en") {

            return window.ISM_EN || null;

        }


        if (language === "ar") {

            return window.ISM_AR || null;

        }


        return null;

    }


    // ======================================
    // Load Language Resource
    // ======================================

    function loadLanguage(
        language
    ) {

        return new Promise(
            function (resolve, reject) {

                if (
                    !SUPPORTED_LANGUAGES[language]
                ) {

                    reject(
                        new Error(
                            "Unsupported language"
                        )
                    );

                    return;

                }


                const existing =
                    getResource(
                        language
                    );


                if (existing) {

                    translations[language] =
                        existing;

                    resolve(existing);

                    return;

                }


                const src =
                    getLanguageFilePath(
                        language
                    );


                if (!src) {

                    reject(
                        new Error(
                            "Language file path unavailable"
                        )
                    );

                    return;

                }


                const script =
                    document.createElement(
                        "script"
                    );


                script.src =
                    src;


                script.async = false;


                script.onload =
                    function () {

                        const resource =
                            getResource(
                                language
                            );


                        if (!resource) {

                            reject(
                                new Error(
                                    "Translation resource not found"
                                )
                            );

                            return;

                        }


                        translations[language] =
                            resource;


                        resolve(resource);

                    };


                script.onerror =
                    function () {

                        reject(
                            new Error(
                                "Failed to load language: "
                                +
                                language
                            )
                        );

                    };


                document.head.appendChild(
                    script
                );

            }
        );

    }


    // ======================================
    // Translate Key
    // ======================================

    function translate(
        key,
        language
    ) {

        const lang =
            language ||
            getCurrentLanguage();


        const resource =
            translations[lang]
            ||
            getResource(lang);


        if (!resource) {

            return key;

        }


        return (
            resource[key]
            ||
            key
        );

    }


    // ======================================
    // Translate Current Page
    // ======================================

    function translatePage(
        language
    ) {

        const lang =
            language ||
            getCurrentLanguage();


        const elements =
            document.querySelectorAll(
                "[data-i18n]"
            );


        elements.forEach(
            function (element) {

                const key =
                    element.getAttribute(
                        "data-i18n"
                    );


                if (!key) {
                    return;
                }


                element.textContent =
                    translate(
                        key,
                        lang
                    );

            }
        );


        // -------------------------------
        // Placeholder Translation
        // -------------------------------

        const placeholders =
            document.querySelectorAll(
                "[data-i18n-placeholder]"
            );


        placeholders.forEach(
            function (element) {

                const key =
                    element.getAttribute(
                        "data-i18n-placeholder"
                    );


                element.setAttribute(
                    "placeholder",
                    translate(
                        key,
                        lang
                    )
                );

            }
        );


        // -------------------------------
        // Title Translation
        // -------------------------------

        const titleElement =
            document.querySelector(
                "[data-i18n-title]"
            );


        if (titleElement) {

            const key =
                titleElement.getAttribute(
                    "data-i18n-title"
                );


            document.title =
                translate(
                    key,
                    lang
                );

        }

    }


    // ======================================
    // Set Language
    // ======================================

    async function setLanguage(
        language
    ) {

        if (
            !SUPPORTED_LANGUAGES[language]
        ) {

            return false;

        }


        try {

            await loadLanguage(
                language
            );


            localStorage.setItem(
                LANGUAGE_STORAGE_KEY,
                language
            );


            applyLanguageDirection(
                language
            );


            translatePage(
                language
            );


            document.dispatchEvent(
                new CustomEvent(
                    "ismLanguageChanged",
                    {
                        detail: {
                            language:
                                language
                        }
                    }
                )
            );


            return true;

        } catch (error) {

            console.error(
                "Language change failed:",
                error
            );


            return false;

        }

    }


    // ======================================
    // Change Language
    // ======================================

    function changeLanguage(
        language
    ) {

        if (
            language ===
            getCurrentLanguage()
        ) {

            applyLanguageDirection(
                language
            );

            return;

        }


        setLanguage(
            language
        )
        .then(
            function (success) {

                if (success) {

                    window.location.reload();

                }

            }
        );

    }


    // ======================================
    // Initialize
    // ======================================

    async function initializeLanguage() {

        const current =
            getCurrentLanguage();


        try {

            await loadLanguage(
                current
            );


            applyLanguageDirection(
                current
            );


            translatePage(
                current
            );


            document.dispatchEvent(
                new CustomEvent(
                    "ismLanguageReady",
                    {
                        detail: {
                            language:
                                current
                        }
                    }
                )
            );

        } catch (error) {

            console.error(
                "Language initialization failed:",
                error
            );

        }

    }


    // ======================================
    // Public API
    // ======================================

    window.LANGUAGE_CONFIG = {

        defaultLanguage:
            DEFAULT_LANGUAGE,

        supportedLanguages:
            SUPPORTED_LANGUAGES

    };


    window.getCurrentLanguage =
        getCurrentLanguage;


    window.changeLanguage =
        changeLanguage;


    window.setLanguage =
        setLanguage;


    window.translate =
        translate;


    window.translatePage =
        translatePage;


    window.applyLanguageDirection =
        applyLanguageDirection;


    window.loadLanguage =
        loadLanguage;


    // ======================================
    // Start
    // ======================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeLanguage
        );

    } else {

        initializeLanguage();

    }


})();
