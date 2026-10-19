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
        const micButton = document.getElementById("jarvis-mic");
        const statusText = document.getElementById("jarvis-status-text");
        const conversation = document.getElementById("jarvis-conversation");

        if (!widget || !toggleButton || !panel || !closeButton || !micButton || !statusText || !conversation) {
            console.warn("JARVIS: Elemen UI belum tersedia.");
            return;
        }
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const speechSupported = typeof SpeechRecognition !== "undefined";

micButton.disabled = !speechSupported;
micButton.textContent = speechSupported
    ? "🎙 Aktifkan Mikrofon"
    : "Mikrofon tidak didukung browser";

statusText.textContent = speechSupported
    ? "JARVIS SIAP"
    : "MODE SUARA TIDAK DIDUKUNG";
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
if (speechSupported) {
    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
        statusText.textContent = "JARVIS MENDENGARKAN";
        micButton.textContent = "Mendengarkan...";
    };

    
recognition.onresult = function (event) {
    const said = event.results[0][0].transcript;

    const message = document.createElement("div");
    message.className = "jarvis-message user";
    message.textContent = said;
    conversation.appendChild(message);

    const reply = "Halo, saya mendengar: " + said;

    const response = document.createElement("div");
    response.className = "jarvis-message assistant";
    response.textContent = reply;
    conversation.appendChild(response);

    statusText.textContent = "JARVIS MEMBALAS";

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = "id-ID";
        utterance.rate = 1;
        utterance.pitch = 1;

        const voices = window.speechSynthesis.getVoices();
        const indoVoice = voices.find(
            voice => voice.lang.toLowerCase().startsWith("id")
        );

        if (indoVoice) {
            utterance.voice = indoVoice;
        }

        utterance.onend = function () {
            statusText.textContent = "JARVIS SIAP";
        };

        utterance.onerror = function () {
            statusText.textContent = "BALASAN SUARA GAGAL";
        };

        window.speechSynthesis.speak(utterance);
    } else {
        statusText.textContent = "BALASAN TEKS SIAP";
    }

    micButton.textContent = "🎙 Aktifkan Mikrofon";
};

    micButton.addEventListener("click", function () {
        try {
            recognition.start();
        } catch (error) {
            statusText.textContent = "MIKROFON SEDANG AKTIF";
        }
    });
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
