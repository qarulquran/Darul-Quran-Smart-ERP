// ==========================================
// ISM - Islamic School Management
// Master Layout Loader
// Header + Sidebar + Footer
// Core + Language Initialization
// ==========================================

(function () {

    "use strict";


    // ======================================
    // Configuration
    // ======================================

    const ROOT_PATH = "../";


    const CORE_SCRIPTS = [

        "../config/app-config.js",

        "../config/language-config.js",

        "../config/permission-config.js",

        "../core/institute.js",

        "../core/session.js",

        "../core/auth.js",

        "../core/database-manager.js",

        "../core/clearance-manager.js",

        "../core/bootstrap.js"

    ];


    // ======================================
    // Loaded Script Registry
    // ======================================

    const loadedScripts =
        new Set();


    // ======================================
    // Load JavaScript Once
    // ======================================

    function loadScript(
        src
    ) {

        return new Promise(
            function (resolve, reject) {

                if (
                    loadedScripts.has(src)
                ) {

                    resolve();

                    return;

                }


                const existing =
                    document.querySelector(
                        `script[src="${src}"]`
                    );


                if (existing) {

                    loadedScripts.add(src);

                    resolve();

                    return;

                }


                const script =
                    document.createElement(
                        "script"
                    );


                script.src = src;

                script.async = false;


                script.onload =
                    function () {

                        loadedScripts.add(src);

                        resolve();

                    };


                script.onerror =
                    function () {

                        reject(
                            new Error(
                                "Failed to load: " +
                                src
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
    // Load Core System
    // ======================================

    async function loadCore() {

        for (
            const src
            of CORE_SCRIPTS
        ) {

            try {

                await loadScript(
                    src
                );

            } catch (error) {

                console.error(
                    "Core loading error:",
                    error
                );

            }

        }

    }


    // ======================================
    // Execute Component Scripts
    // ======================================

    function executeScripts(
        container
    ) {

        const scripts =
            Array.from(
                container.querySelectorAll(
                    "script"
                )
            );


        scripts.forEach(
            function (oldScript) {

                const newScript =
                    document.createElement(
                        "script"
                    );


                // External JS
                if (
                    oldScript.src
                ) {

                    newScript.src =
                        oldScript.src;

                }

                // Inline JS
                else {

                    newScript.textContent =
                        oldScript.textContent;

                }


                // Preserve attributes
                Array.from(
                    oldScript.attributes
                )
                .forEach(
                    function (attribute) {

                        if (
                            attribute.name !==
                            "src"
                        ) {

                            newScript.setAttribute(
                                attribute.name,
                                attribute.value
                            );

                        }

                    }
                );


                oldScript.parentNode.replaceChild(
                    newScript,
                    oldScript
                );

            }
        );

    }


    // ======================================
    // Load HTML Component
    // ======================================

    async function loadComponent(
        id,
        file
    ) {

        const container =
            document.getElementById(id);


        if (!container) {

            console.warn(
                "Layout container not found:",
                id
            );

            return false;

        }


        try {

            const response =
                await fetch(file);


            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );

            }


            const html =
                await response.text();


            container.innerHTML =
                html;


            // Execute component scripts
            executeScripts(
                container
            );


            return true;

        } catch (error) {

            console.error(
                "Component loading failed:",
                file,
                error
            );


            container.innerHTML = `

                <div
                    style="
                        padding:20px;
                        text-align:center;
                        color:#b71c1c;
                    "
                >

                    Unable to load layout component.

                </div>

            `;


            return false;

        }

    }


    // ======================================
    // Create Mobile Overlay
    // ======================================

    function ensureOverlay() {

        if (
            document.getElementById(
                "overlay"
            )
        ) {

            return;

        }


        const overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            "overlay";


        overlay.className =
            "layout-overlay";


        document.body.appendChild(
            overlay
        );

    }


    // ======================================
    // Apply Current Language
    // ======================================

    function applyCurrentLanguage() {

        if (
            typeof window.applyLanguageDirection ===
            "function"
        ) {

            window.applyLanguageDirection();

        }


        if (
            typeof window.translatePage ===
            "function"
        ) {

            window.translatePage();

        }

    }


    // ======================================
    // Re-initialize Layout
    // ======================================

    function initializeLayout() {

        ensureOverlay();

        applyCurrentLanguage();


        document.dispatchEvent(

            new CustomEvent(
                "ismLayoutReady"
            )

        );

    }


    // ======================================
    // Main Layout Loader
    // ======================================

    async function initializeApplication() {

        try {

            // ----------------------------------
            // Core
            // ----------------------------------

            await loadCore();


            // ----------------------------------
            // Components
            // ----------------------------------

            await Promise.all([

                loadComponent(
                    "header",
                    "../components/header.html"
                ),

                loadComponent(
                    "sidebar",
                    "../components/sidebar.html"
                ),

                loadComponent(
                    "footer",
                    "../components/footer.html"
                )

            ]);


            // ----------------------------------
            // Layout
            // ----------------------------------

            initializeLayout();


        } catch (error) {

            console.error(
                "ISM layout initialization failed:",
                error
            );

        }

    }


    // ======================================
    // Public API
    // ======================================

    window.loadComponent =
        loadComponent;


    window.initializeISMLayout =
        initializeApplication;


    // ======================================
    // Start
    // ======================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeApplication
        );

    } else {

        initializeApplication();

    }


})();
