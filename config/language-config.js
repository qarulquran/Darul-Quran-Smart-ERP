// ==========================================
// ISM - Islamic School Management
// Global Language & Translation Engine
// Bengali / English / Arabic
// Live Translation + RTL + Cache Control
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


    /*
     * Change this value whenever
     * language resource files are updated.
     *
     * This prevents GitHub Pages/browser
     * from serving an old bn/en/ar file.
     */

    const LANGUAGE_RESOURCE_VERSION =
        "20260827-2056";


    const SUPPORTED_LANGUAGES = {

        bn: {

            name:
                "বাংলা",

            direction:
                "ltr",

            file:
                "bn.js"

        },


        en: {

            name:
                "English",

            direction:
                "ltr",

            file:
                "en.js"

        },


        ar: {

            name:
                "العربية",

            direction:
                "rtl",

            file:
                "ar.js"

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
            saved
            &&
            SUPPORTED_LANGUAGES[saved]
        ) {

            return saved;

        }


        return DEFAULT_LANGUAGE;

    }


    // ======================================
    // Apply Language Direction
    // ======================================

    function applyLanguageDirection(
        language
    ) {

        const lang =
            language
            ||
            getCurrentLanguage();


        const config =
            SUPPORTED_LANGUAGES[
                lang
            ];


        if (!config) {

            return false;

        }


        // ----------------------------------
        // HTML language
        // ----------------------------------

        document.documentElement.lang =
            lang;


        // ----------------------------------
        // RTL / LTR
        // ----------------------------------

        document.documentElement.dir =
            config.direction;


        // ----------------------------------
        // Body class
        // ----------------------------------

        if (
            document.body
        ) {

            document.body.classList.toggle(
                "rtl-mode",
                config.direction ===
                "rtl"
            );


            document.body.classList.toggle(
                "ltr-mode",
                config.direction ===
                "ltr"
            );


            document.body.setAttribute(
                "dir",
                config.direction
            );

        }


        return true;

    }


    // ======================================
    // Find Language File Path
    // ======================================

    function getLanguageFilePath(
        language
    ) {

        const config =
            SUPPORTED_LANGUAGES[
                language
            ];


        if (!config) {

            return null;

        }


        const configScript =
            document.querySelector(
                'script[src*="language-config.js"]'
            );


        if (
            !configScript
            ||
            !configScript.src
        ) {

            return null;

        }


        try {

            const url =
                new URL(

                    "../languages/"
                    +
                    config.file,

                    configScript.src

                );


            /*
             * Cache busting.
             *
             * Example:
             *
             * ar.js?v=20260827-2056
             */

            url.searchParams.set(
                "v",
                LANGUAGE_RESOURCE_VERSION
            );


            return url.href;

        }

        catch (error) {

            console.error(
                "Language path error:",
                error
            );


            return null;

        }

    }


    // ======================================
    // Get Global Resource
    // ======================================

    function getResource(
        language
    ) {

        switch (
            language
        ) {

            case "bn":

                return (
                    window.ISM_BN
                    ||
                    null
                );


            case "en":

                return (
                    window.ISM_EN
                    ||
                    null
                );


            case "ar":

                return (
                    window.ISM_AR
                    ||
                    null
                );


            default:

                return null;

        }

    }


    // ======================================
    // Load Language Resource
    // ======================================

    function loadLanguage(
        language
    ) {

        return new Promise(
            function (
                resolve,
                reject
            ) {

                if (
                    !SUPPORTED_LANGUAGES[
                        language
                    ]
                ) {

                    reject(
                        new Error(
                            "Unsupported language: "
                            +
                            language
                        )
                    );


                    return;

                }


                // ----------------------------------
                // Already cached internally
                // ----------------------------------

                if (
                    translations[
                        language
                    ]
                ) {

                    resolve(
                        translations[
                            language
                        ]
                    );


                    return;

                }


                // ----------------------------------
                // Already loaded globally
                // ----------------------------------

                const existing =
                    getResource(
                        language
                    );


                if (
                    existing
                ) {

                    translations[
                        language
                    ] =
                        existing;


                    resolve(
                        existing
                    );


                    return;

                }


                // ----------------------------------
                // Build resource URL
                // ----------------------------------

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


                // ----------------------------------
                // Load Script
                // ----------------------------------

                const script =
                    document.createElement(
                        "script"
                    );


                script.src =
                    src;


                script.async =
                    false;


                script.dataset.language =
                    language;


                script.onload =
                    function () {

                        const resource =
                            getResource(
                                language
                            );


                        if (
                            !resource
                        ) {

                            reject(
                                new Error(
                                    "Translation resource not found: "
                                    +
                                    language
                                )
                            );


                            return;

                        }


                        translations[
                            language
                        ] =
                            resource;


                        resolve(
                            resource
                        );

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
            language
            ||
            getCurrentLanguage();


        const resource =
            translations[
                lang
            ]
            ||
            getResource(
                lang
            );


        if (
            !resource
        ) {

            return key;

        }


        if (
            Object.prototype
                .hasOwnProperty
                .call(
                    resource,
                    key
                )
        ) {

            return resource[
                key
            ];

        }


        return key;

    }


    // ======================================
    // Translate Text Elements
    // ======================================

    function translateTextElements(
        language
    ) {

        const elements =
            document.querySelectorAll(
                "[data-i18n]"
            );


        elements.forEach(
            function (
                element
            ) {

                const key =
                    element.getAttribute(
                        "data-i18n"
                    );


                if (!key) {

                    return;

                }


                const translated =
                    translate(
                        key,
                        language
                    );


                /*
                 * Keep the original text
                 * when a translation key
                 * is missing.
                 */

                if (
                    translated !==
                    key
                ) {

                    element.textContent =
                        translated;

                }

            }
        );

    }


    // ======================================
    // Translate Placeholders
    // ======================================

    function translatePlaceholders(
        language
    ) {

        const elements =
            document.querySelectorAll(
                "[data-i18n-placeholder]"
            );


        elements.forEach(
            function (
                element
            ) {

                const key =
                    element.getAttribute(
                        "data-i18n-placeholder"
                    );


                if (!key) {

                    return;

                }


                const translated =
                    translate(
                        key,
                        language
                    );


                if (
                    translated !==
                    key
                ) {

                    element.setAttribute(
                        "placeholder",
                        translated
                    );

                }

            }
        );

    }


    // ======================================
    // Translate Tooltips / Titles
    // ======================================

    function translateTitles(
        language
    ) {

        const elements =
            document.querySelectorAll(
                "[data-i18n-title]"
            );


        elements.forEach(
            function (
                element
            ) {

                const key =
                    element.getAttribute(
                        "data-i18n-title"
                    );


                if (!key) {

                    return;

                }


                const translated =
                    translate(
                        key,
                        language
                    );


                if (
                    translated ===
                    key
                ) {

                    return;

                }


                /*
                 * Hidden page-title hook.
                 *
                 * Example:
                 *
                 * <div
                 * data-i18n-title="addNewStudent"
                 * hidden>
                 * </div>
                 */

                if (
                    element.hidden
                ) {

                    document.title =
                        translated;


                    return;

                }


                /*
                 * Normal controls:
                 * set tooltip/title attribute.
                 */

                element.setAttribute(
                    "title",
                    translated
                );

            }
        );

    }


    // ======================================
    // Synchronize Language Selectors
    // ======================================

    function syncLanguageSelectors(
        language
    ) {

        const selectors =
            document.querySelectorAll(
                "#languageSelector"
            );


        selectors.forEach(
            function (
                selector
            ) {

                if (
                    selector.value !==
                    language
                ) {

                    selector.value =
                        language;

                }

            }
        );

    }


    // ======================================
    // Translate Current Page
    // ======================================

    function translatePage(
        language
    ) {

        const lang =
            language
            ||
            getCurrentLanguage();


        translateTextElements(
            lang
        );


        translatePlaceholders(
            lang
        );


        translateTitles(
            lang
        );


        syncLanguageSelectors(
            lang
        );


        applyLanguageDirection(
            lang
        );

    }


    // ======================================
    // Set Language
    // ======================================

    async function setLanguage(
        language
    ) {

        if (
            !SUPPORTED_LANGUAGES[
                language
            ]
        ) {

            console.error(
                "Unsupported language:",
                language
            );


            return false;

        }


        try {

            // ----------------------------------
            // Load translation first
            // ----------------------------------

            await loadLanguage(
                language
            );


            // ----------------------------------
            // Save language
            // ----------------------------------

            localStorage.setItem(
                LANGUAGE_STORAGE_KEY,
                language
            );


            // ----------------------------------
            // Global current language
            // ----------------------------------

            window.CURRENT_LANGUAGE =
                language;


            // ----------------------------------
            // Apply RTL/LTR first
            // ----------------------------------

            applyLanguageDirection(
                language
            );


            // ----------------------------------
            // Translate immediately
            // ----------------------------------

            translatePage(
                language
            );


            // ----------------------------------
            // Notify components/pages
            // ----------------------------------

            document.dispatchEvent(
                new CustomEvent(
                    "ismLanguageChanged",
                    {

                        detail: {

                            language:
                                language,

                            direction:
                                SUPPORTED_LANGUAGES[
                                    language
                                ]
                                .direction

                        }

                    }
                )
            );


            return true;

        }

        catch (error) {

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

    async function changeLanguage(
        language
    ) {

        /*
         * Do NOT reload the page.
         *
         * Live translation prevents
         * inconsistent language state,
         * especially Arabic RTL.
         */

        return await setLanguage(
            language
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


            window.CURRENT_LANGUAGE =
                current;


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
                                current,

                            direction:
                                SUPPORTED_LANGUAGES[
                                    current
                                ]
                                .direction

                        }

                    }
                )
            );

        }

        catch (error) {

            console.error(
                "Language initialization failed:",
                error
            );

        }

    }


    // ======================================
    // Public Configuration
    // ======================================

    window.LANGUAGE_CONFIG = {

        defaultLanguage:
            DEFAULT_LANGUAGE,

        supportedLanguages:
            SUPPORTED_LANGUAGES,

        storageKey:
            LANGUAGE_STORAGE_KEY,

        resourceVersion:
            LANGUAGE_RESOURCE_VERSION

    };


    // ======================================
    // Public API
    // ======================================

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


    window.getLanguageFilePath =
        getLanguageFilePath;


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

    }

    else {

        initializeLanguage();

    }


})();
