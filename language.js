/* =========================================================
   FEMORA - LANGUAGE SYSTEM
   English / Urdu
   Language stays selected across all pages
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const languageButton = document.querySelector("#language-btn");

    // Saved language
    // Default = English
    let currentLanguage =
        localStorage.getItem("femoraLanguage") || "en";


    /* =====================================================
       APPLY LANGUAGE
    ===================================================== */

    function applyLanguage(language) {

        currentLanguage = language;

        // Save language permanently
        localStorage.setItem(
            "femoraLanguage",
            language
        );


        /* ================= HTML LANGUAGE ================= */

        document.documentElement.lang = language;


        /* ================= BODY CLASS ================= */

        if (language === "ur") {

            document.body.classList.add("urdu");

        } else {

            document.body.classList.remove("urdu");

        }


        /* ================= TEXT ================= */

        const elements =
            document.querySelectorAll(
                "[data-en][data-ur]"
            );


        elements.forEach(function (element) {

            if (language === "ur") {

                element.textContent =
                    element.getAttribute("data-ur");

            } else {

                element.textContent =
                    element.getAttribute("data-en");

            }

        });


        /* ================= PLACEHOLDERS ================= */

        const inputs =
            document.querySelectorAll(
                "[data-placeholder-en][data-placeholder-ur]"
            );


        inputs.forEach(function (input) {

            if (language === "ur") {

                input.placeholder =
                    input.getAttribute(
                        "data-placeholder-ur"
                    );

            } else {

                input.placeholder =
                    input.getAttribute(
                        "data-placeholder-en"
                    );

            }

        });


        /* ================= LANGUAGE BUTTON ================= */

        if (languageButton) {

            if (language === "ur") {

                languageButton.textContent =
                    "English";

                languageButton.setAttribute(
                    "aria-label",
                    "Switch to English"
                );

            } else {

                languageButton.textContent =
                    "اردو";

                languageButton.setAttribute(
                    "aria-label",
                    "اردو میں تبدیل کریں"
                );

            }

        }

    }


    /* =====================================================
       LANGUAGE BUTTON
    ===================================================== */

    if (languageButton) {

        languageButton.addEventListener(
            "click",
            function () {

                if (currentLanguage === "en") {

                    applyLanguage("ur");

                } else {

                    applyLanguage("en");

                }

            }
        );

    }


    /* =====================================================
       APPLY SAVED LANGUAGE WHEN PAGE OPENS
    ===================================================== */

    applyLanguage(currentLanguage);

});