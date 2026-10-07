const BREAKING_NEWS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQBV3h8Cj871kZWAzP8r0bPKkMODcrURrJrJsAeizKnbm6mn7ThObiaTgOL1EM3jv5ua8Taap3xS9dL/pub?gid=166700684&single=true&output=csv";
const TUTUP_DINAS_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRr8R_L7SK3go995gTrx9UZUJMtUeyrCq1SLSrtYlN9HlZeHKFUODicrD_9cyr8H57EppczJ3ID7k4-/pub?gid=269519834&single=true&output=csv";
const SWEEPING_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSl-54_yoSLzhScnnqobxltHP6ix37y2L_ThNjXic5eqGKd0N5Ule916jxr9ISKQtnGR_RkAVXsxW1O/pub?gid=0&single=true&output=csv";
const METER_HILANG_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTTAgE1S935-2P6AUUddelLeHJBOcUgrzAROMQAzu1AyGhm6SVRncEcuplPqxnvdFKsZDEcIOqyhwbv/pub?gid=1078006060&single=true&output=csv";
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
function parseAngkaIndonesia(value) {
    if (!value) return 0;

    const text = String(value)
        .trim()
        .replace(/\//g, "");

    if (/^\d{1,3}\.\d{3}$/.test(text)) {
        return Number(text.replace(/\./g, ""));
    }

    return Number(text.replace(/,/g, "")) || 0;
}

   function parseAngkaIndonesia(value) {
    if (!value) return 0;

    const text = String(value)
        .trim()
        .replace(/\//g, "");

    if (/^\d{1,3}\.\d{3}$/.test(text)) {
        return Number(text.replace(/\./g, ""));
    }

    return Number(text.replace(/,/g, "")) || 0;
}

async function loadTutupDinas() {
    try {
        const response = await fetch(TUTUP_DINAS_URL, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil data Tutup Dinas.");
        }

        const csvText = await response.text();
        const rows = parseCSV(csvText);

        if (!rows || rows.length <= 1) {
            throw new Error("Data Tutup Dinas kosong.");
        }

        const data = rows
            .slice(1)
            .filter(row => row.length >= 7)
            .map(row => ({
                terimaTutup: parseAngkaIndonesia(row[2]),
                realisasiBayar: parseAngkaIndonesia(row[3]),
                terimaBukaan: parseAngkaIndonesia(row[5]),
                realisasiBukaan: parseAngkaIndonesia(row[6])
            }));

        const terimaTutup = data.reduce(
            (sum, row) => sum + row.terimaTutup,
            0
        );

        const realisasiBayar = data.reduce(
            (sum, row) => sum + row.realisasiBayar,
            0
        );

        const persen = terimaTutup > 0
            ? (realisasiBayar / terimaTutup) * 100
            : 0;

        const terimaEl = document.getElementById("homeTutupTerima");
        const realisasiEl = document.getElementById("homeTutupRealisasi");
        const persenEl = document.getElementById("homeTutupPersen");

        if (terimaEl) {
            terimaEl.textContent = terimaTutup.toLocaleString("id-ID");
        }

        if (realisasiEl) {
            realisasiEl.textContent = realisasiBayar.toLocaleString("id-ID");
        }

        if (persenEl) {
            persenEl.textContent = persen.toLocaleString("id-ID", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + "%";
        }

    } catch (error) {
        console.error("Tutup Dinas Error:", error);
    }
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
function parseSweepingNumber(value) {
    if (!value) return 0;

    const text = String(value)
        .trim()
        .replace(/\//g, "")
        .replace(/\./g, "")
        .replace(/%/g, "")
        .replace(/,/g, ".");

    return Number(text) || 0;
}

async function loadSweeping() {
    try {
        const response = await fetch(SWEEPING_URL, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil data Sweeping.");
        }

        const csvText = await response.text();

        const rows = parseCSV(csvText);

        const data = rows
            .filter(row => {
                const bulan = String(row[0] || "").trim();

                return /^(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember) 2026$/i.test(bulan);
            })
            .map(row => ({
                total: parseSweepingNumber(row[6]),
                target: parseSweepingNumber(row[7])
            }));

        const total = data.reduce(
            (sum, row) => sum + row.total,
            0
        );

        const target = data.reduce(
            (sum, row) => sum + row.target,
            0
        );

        const persen = target > 0
            ? (total / target) * 100
            : 0;

        const targetEl =
            document.getElementById("homeSweepingTarget");

        const realisasiEl =
            document.getElementById("homeSweepingRealisasi");

        const persenEl =
            document.getElementById("homeSweepingPersen");

        if (targetEl) {
            targetEl.textContent =
                "Rp " + target.toLocaleString("id-ID");
        }

        if (realisasiEl) {
            realisasiEl.textContent =
                "Rp " + total.toLocaleString("id-ID");
        }

        if (persenEl) {
            persenEl.textContent =
                persen.toLocaleString("id-ID", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) + "%";
        }

    } catch (error) {
        console.error("Sweeping Error:", error);
    }
}
async function loadMeterHilang() {
    try {
        const response = await fetch(METER_HILANG_URL, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil data Meter Hilang.");
        }

        const csvText = await response.text();

        const rows = csvText
            .trim()
            .split(/\r?\n/);

        if (!rows || rows.length <= 1) {
            throw new Error("Data Meter Hilang kosong.");
        }

        // TOTAL KASUS
        const total = rows.length - 1;

        // HITUNG KASUS AKTIF PER ZONA
        const zonaAktif = {};

        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(",");

            const zona = String(cols[1] || "")
                .trim()
                .toUpperCase();

            const status = String(cols[7] || "")
                .trim()
                .toUpperCase();

            if (status === "PROSES" || status === "BARU") {
                zonaAktif[zona] =
                    (zonaAktif[zona] || 0) + 1;
            }
        }

        // CARI HOT ZONE
        let hotZona = "-";
        let jumlahKasus = 0;

        for (const zona in zonaAktif) {
            if (zonaAktif[zona] > jumlahKasus) {
                jumlahKasus = zonaAktif[zona];
                hotZona = zona;
            }
        }

        // TENTUKAN LEVEL
        let level = "🟢 NORMAL";

        if (jumlahKasus >= 5) {
            level = "🔴 KRITIS";
        } else if (jumlahKasus >= 3) {
            level = "🟠 SIAGA";
        } else if (jumlahKasus >= 1) {
            level = "🟡 WASPADA";
        }

        // TAMPILKAN KE HOME
        const totalEl =
            document.getElementById("homeMeterTotal");

        const statusEl =
            document.getElementById("homeMeterStatus");

        const hotZoneEl =
            document.getElementById("homeMeterHotZone");

        if (totalEl) {
            totalEl.textContent =
                total.toLocaleString("id-ID");
        }

        if (statusEl) {
            statusEl.textContent = level;
        }

        if (hotZoneEl) {
            hotZoneEl.textContent = hotZona;
        }

    } catch (error) {
        console.error("Meter Hilang Error:", error);
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

async function loadMeterHilangTerbaru() {
    const tbody = document.getElementById("latestMeterTableBody");

    if (!tbody) return;

    try {
        const response = await fetch(METER_HILANG_URL);

        if (!response.ok) {
            throw new Error("Gagal mengambil data Meter Hilang");
        }

        const text = await response.text();
        const rows = parseCSV(text);
        console.log("METER HILANG ROWS:", rows);
console.log("JUMLAH ROWS:", rows.length);
console.log("ROW PERTAMA:", rows[1]);
console.log("PANJANG KOLOM:", rows.slice(0, 5).map(row => row.length));
console.log("DATA KOLOM 0:", rows[1]?.[0]);
console.log("DATA KOLOM 1:", rows[1]?.[1]);
console.log("RAW CSV:", text);

        if (!rows || rows.length <= 1) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">Belum ada data Meter Hilang.</td>
                </tr>
            `;
            return;
        }

        const data = rows
            .slice(1)
            .filter(row => row && row.length >= 8)
            .sort((a, b) => {
                return (
                    parseTanggalMeterHilang(b[0]) -
                    parseTanggalMeterHilang(a[0])
                );
            })
            .slice(0, 10);

        tbody.innerHTML = "";

        data.forEach(row => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${row[0] || "-"}</td>
                <td>${row[1] || "-"}</td>
                <td>${row[2] || "-"}</td>
                <td>${row[3] || "-"}</td>
                <td>${row[4] || "-"}</td>
                <td>${row[6] || "-"}</td>
                <td>${row[7] || "-"}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Meter Hilang Terbaru:", error);

        tbody.innerHTML = `
            <tr>
                <td colspan="7">Gagal memuat data Meter Hilang.</td>
            </tr>
        `;
    }
}
document.addEventListener("DOMContentLoaded", function () {
    loadBreakingNews();
    loadTutupDinas();
    loadSweeping();
    loadMeterHilangTerbaru();

    setConnectionStatus("dashboard", true);

    setInterval(loadBreakingNews, 60000);
});