const BREAKING_NEWS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQBV3h8Cj871kZWAzP8r0bPKkMODcrURrJrJsAeizKnbm6mn7ThObiaTgOL1EM3jv5ua8Taap3xS9dL/pub?gid=166700684&single=true&output=csv";

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") i++;

      row.push(cell);
      rows.push(row);

      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function tampilkanBreakingNews(rows) {
  const container = document.getElementById("breakingNewsList");

  if (!container) return;

  if (!rows || rows.length <= 1) {
    container.innerHTML = `
      <div class="breaking-empty">
        Belum ada breaking news terbaru.
      </div>
    `;
    return;
  }

  const headers = rows[0].map(header =>
    header.trim().toLowerCase()
  );

  const data = rows.slice(1)
    .filter(row => row.some(value => value.trim() !== ""))
    .map(row => {
      const item = {};

      headers.forEach((header, index) => {
        item[header] = row[index] || "";
      });

      return item;
    });

  const beritaTerbaru = data
    .filter(item => {
      const status = (item.status || "").toLowerCase();

      return (
        status === "breaking" ||
        status === "aktif" ||
        status === "publish" ||
        status === "published"
      );
    })
    .slice(-5)
    .reverse();

  if (beritaTerbaru.length === 0) {
    container.innerHTML = `
      <div class="breaking-empty">
        Belum ada breaking news aktif.
      </div>
    `;
    return;
  }

 container.innerHTML = beritaTerbaru.map(item => {
  const judul = escapeHTML(item.judul);
  const kategori = escapeHTML(item.kategori);
  const zona = escapeHTML(item.zona);
  const lokasi = escapeHTML(item.lokasi);
  const ringkasan = escapeHTML(item.ringkasan);
  const tanggal = escapeHTML(item.tanggal);
  const sumber = escapeHTML(item.sumber);
  const linkSumber = escapeHTML(item["link sumber"]);

  return `
    <article class="breaking-item">

      <div class="breaking-item-top">
        <span class="breaking-item-badge">
          🔴 BREAKING
        </span>

        ${
          tanggal
            ? `<span class="breaking-item-date">${tanggal}</span>`
            : ""
        }
      </div>

      <h3 class="breaking-item-title">
        ${judul}
      </h3>

      <div class="breaking-item-meta">
        ${kategori}
        ${zona ? ` • ${zona}` : ""}
        ${lokasi ? ` • ${lokasi}` : ""}
      </div>

      ${
        ringkasan
          ? `
            <p class="breaking-item-summary">
              ${ringkasan}
            </p>
          `
          : ""
      }

      ${
        linkSumber
          ? `
            <a
              class="breaking-item-source"
              href="${linkSumber}"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 ${sumber || "Buka sumber berita"}
            </a>
          `
          : ""
      }

    </article>
  `;
}).join("");
}

async function loadBreakingNews() {
  try {
    const response = await fetch(BREAKING_NEWS_URL, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data Breaking News.");
    }
    setConnectionStatus("news", true);
    setConnectionStatus("sheet", true);
const updatedNow = new Date();

const updatedTime = updatedNow.toLocaleTimeString("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});

const lastUpdated = document.getElementById("lastUpdated");

if (lastUpdated) {
  lastUpdated.textContent = updatedTime + " WIB";
}
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    tampilkanBreakingNews(rows);

  } catch (error) {
    setConnectionStatus("news", false);
    setConnectionStatus("sheet", false);
    console.error("Breaking News Error:", error);

    const container = document.getElementById("breakingNewsList");

    if (container) {
      container.innerHTML = `
        <div class="breaking-empty">
          Breaking News belum dapat dimuat.
        </div>
      `;
    }
  }
}
function setConnectionStatus(type, online) {
  const dot = document.getElementById(type + "StatusDot");
  const text = document.getElementById(type + "StatusText");

  if (!dot || !text) return;

  dot.classList.toggle("offline", !online);
  text.classList.toggle("offline", !online);

  text.textContent = online ? "ONLINE" : "OFFLINE";
}
document.addEventListener("DOMContentLoaded", function () {
  loadBreakingNews();
  setConnectionStatus("dashboard", true);
  // Refresh setiap 60 detik
  setInterval(loadBreakingNews, 60000);
});
