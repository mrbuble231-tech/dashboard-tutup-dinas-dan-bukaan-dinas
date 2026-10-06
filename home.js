const BREAKING_NEWS_URL =
  "https://docs.google.com/spreadsheets/d/1vzWR3aAA50V5o2pH72LW96OyMY-dTHSwkvAWxMn-EhY/gviz/tq?tqx=out:csv&gid=166700684";

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
    const sumber = escapeHTML(item.sumber);
    const linkSumber = escapeHTML(item["link sumber"]);

    return `
      <article class="breaking-item">

        <h3 class="breaking-item-title">
          ${judul}
        </h3>

        <div class="breaking-item-meta">
          ${kategori}
          ${zona ? ` • ${zona}` : ""}
          ${lokasi ? ` • ${lokasi}` : ""}
        </div>

        <p class="breaking-item-summary">
          ${ringkasan}
        </p>

        ${
          linkSumber
            ? `<a
                 class="breaking-item-source"
                 href="${linkSumber}"
                 target="_blank"
                 rel="noopener noreferrer"
               >
                 Sumber: ${sumber || "Buka berita"}
               </a>`
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

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    tampilkanBreakingNews(rows);

  } catch (error) {
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

document.addEventListener("DOMContentLoaded", function () {
  loadBreakingNews();

  // Refresh setiap 60 detik
  setInterval(loadBreakingNews, 60000);
});
