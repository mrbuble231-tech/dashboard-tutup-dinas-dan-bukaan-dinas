
/* =========================================
   JARVIS V1.0 — CORE UI
   Tahap 1: Buka dan tutup panel
========================================= */

(function () {
    "use strict";

    function initJarvisUI() {
        const widget = document.getElementById("jarvis-widget");
        const toggleButton = document.getElementById("jarvis-toggle");
        const panel = document.getElementById("jarvis-panel");
        const closeButton = document.getElementById("jarvis-close");

        if (!widget || !toggleButton || !panel || !closeButton) {
            console.warn("JARVIS: Elemen UI belum tersedia.");
            return;
        }

        function setPanelOpen(isOpen) {
            panel.classList.toggle("is-open", isOpen);
            panel.setAttribute("aria-hidden", String(!isOpen));
            toggleButton.setAttribute("aria-expanded", String(isOpen));
            toggleButton.setAttribute(
                "aria-label",
                isOpen ? "Tutup panel JARVIS" : "Buka JARVIS"
            );

            if (isOpen) {
                closeButton.focus();
            } else {
                toggleButton.focus();
            }
        }

        toggleButton.addEventListener("click", function () {
            const isOpen = panel.classList.contains("is-open");
            setPanelOpen(!isOpen);
        });

        closeButton.addEventListener("click", function () {
            setPanelOpen(false);
        });

        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                panel.classList.contains("is-open")
            ) {
                setPanelOpen(false);
            }
        });

        console.info("JARVIS: UI core siap.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initJarvisUI, {
            once: true
        });
    } else {
        initJarvisUI();
    }
})();
