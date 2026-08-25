/* =========================================================
   FEMORA - MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* ================= MOBILE MENU ================= */

    const menuBtn = document.querySelector(".menu-btn");
    const navMenu = document.querySelector(".nav-menu");

    if (menuBtn && navMenu) {

        menuBtn.addEventListener("click", function () {

            navMenu.classList.toggle("show");

        });

    }


    /* ================= CLOSE MOBILE MENU ================= */

    const navLinks = document.querySelectorAll(".nav-menu a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (navMenu) {
                navMenu.classList.remove("show");
            }

        });

    });


    /* ================= ACTIVE PAGE ================= */

    const currentPage =
        window.location.pathname.split("/").pop();

    navLinks.forEach(function (link) {

        const linkPage =
            link.getAttribute("href");

        if (
            linkPage === currentPage ||
            (currentPage === "" && linkPage === "index.html")
        ) {

            link.classList.add("active");

        }

    });


    /* ================= CLOSE MENU OUTSIDE ================= */

    document.addEventListener("click", function (event) {

        if (
            navMenu &&
            menuBtn &&
            !navMenu.contains(event.target) &&
            !menuBtn.contains(event.target)
        ) {

            navMenu.classList.remove("show");

        }

    });


    /* ================= SCROLL ANIMATION ================= */

    const animatedElements =
        document.querySelectorAll(
            ".topic-card, .tip-card, .mission-card, .coverage-item"
        );

    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";
                        entry.target.style.transform =
                            "translateY(0)";

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    animatedElements.forEach(function (element) {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(20px)";

        element.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";

        observer.observe(element);

    });


    /* ================= YEAR ================= */

    const yearElements =
        document.querySelectorAll(".current-year");

    yearElements.forEach(function (element) {

        element.textContent =
            new Date().getFullYear();

    });

});