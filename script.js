/* =========================================================
   DASHBOARD TUTUP DINAS & BUKAAN KEMBALI TD
   SCRIPT - TAHAP 1C
========================================================= */


/* =========================================================
   DATA MASTER
   Sumber: Laporan Rekapitulasi Tutup Dinas
   Januari - Agustus 2026
========================================================= */

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRr8R_L7SK3go995gTrx9UZUJMtUeyrCq1SLSrtYlN9HlZeHKFUODicrD_9cyr8H57EppczJ3ID7k4-/pub?gid=269519834&single=true&output=csv";

async function loadSheetData() {
    const response = await fetch(SHEET_URL);

    if (!response.ok) {
        throw new Error("Gagal mengambil data Google Sheets");
    }

    const csv = await response.text();
    function parseNumber(value) {
    if (!value) return 0;

    const text = String(value)
        .trim()
        .replace(/"/g, "");

    if (/^\d{1,3}(\.\d{3})+$/.test(text)) {
        return Number(text.replace(/\./g, ""));
    }

    return Number(text.replace(/,/g, "")) || 0;
}

    function parseCSVLine(line) {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }

    result.push(current.trim());

    return result;
}

const rows = csv
    .trim()
    .split(/\r?\n/)
    .map(parseCSVLine);

    const headers = rows[0].map(header =>
        header.trim().toLowerCase()
    );

    console.log("HEADER GOOGLE SHEETS:", headers);

    // DATA SEMENTARA
    // Kita cek struktur kolom Sheet dulu sebelum mapping final.
    return rows
 .filter(row => {
    const no = String(row[0] || "")
        .replace(/\ufeff/g, "")
        .trim();

    return /^\d+$/.test(no);
})
    .map(row => ({
        bulan: row[1],

        terimaTutup: parseNumber(row[2]),
        realisasiBayar: parseNumber(row[3]),

        terimaBukaan: parseNumber(row[5]),
        realisasiBukaan: parseNumber(row[6]),

        lunas: parseNumber(row[8]),
        rekBukaan: parseNumber(row[9]),
        rek: parseNumber(row[10]),
        bukaan: parseNumber(row[11]),

        AM: parseNumber(row[12]),
        PPP: parseNumber(row[13]),
        BPD: parseNumber(row[14]),
        TB: parseNumber(row[15]),
        PK: parseNumber(row[16]),
        PGL: parseNumber(row[17]),
        RBK: parseNumber(row[18]),
        MTA: parseNumber(row[19]),
        Batal: parseNumber(row[20]),
        EXP: parseNumber(row[21]),
        Penangguhan: parseNumber(row[22])
    }));
}

const data = await loadSheetData();

console.log("DATA GOOGLE SHEETS:", data);


/* =========================================================
   DATA BULAN KOSONG
========================================================= */




/* =========================================================
   FORMAT ANGKA
========================================================= */

function formatNumber(value) {

    if (value === null || value === undefined || value === "") {
        return "-";
    }

    if (value === 0) {
        return "-";
    }

    return Number(value).toLocaleString("id-ID");
}


/* =========================================================
   FORMAT PERSENTASE
========================================================= */

function formatPercent(value) {

    if (!value || !isFinite(value)) {
        return "-";
    }

    return value
        .toFixed(2)
        .replace(".", ",") + "%";
}


/* =========================================================
   HITUNG TOTAL
========================================================= */

const total = {

    terimaTutup: data.reduce(
        (sum, row) => sum + row.terimaTutup,
        0
    ),

    realisasiBayar: data.reduce(
        (sum, row) => sum + row.realisasiBayar,
        0
    ),

    terimaBukaan: data.reduce(
        (sum, row) => sum + row.terimaBukaan,
        0
    ),

    realisasiBukaan: data.reduce(
        (sum, row) => sum + row.realisasiBukaan,
        0
    ),

    lunas: data.reduce(
        (sum, row) => sum + row.lunas,
        0
    ),

    rekBukaan: data.reduce(
        (sum, row) => sum + row.rekBukaan,
        0
    ),

    rek: data.reduce(
        (sum, row) => sum + row.rek,
        0
    ),

    bukaan: data.reduce(
        (sum, row) => sum + row.bukaan,
        0
    )
};


/* =========================================================
   TOTAL REALISASI KATEGORI
========================================================= */

const kategori = [
    "AM",
    "PPP",
    "BPD",
    "TB",
    "PK",
    "PGL",
    "RBK",
    "MTA",
    "Batal",
    "EXP",
    "Penangguhan"
];


const totalKategori = {};

kategori.forEach(kategoriNama => {

    totalKategori[kategoriNama] =
        data.reduce(
            (sum, row) =>
                sum + (Number(row[kategoriNama]) || 0),
            0
        );

});


/* =========================================================
   UPDATE KPI
========================================================= */
document.getElementById("lunasValue").textContent =
    formatNumber(total.realisasiBayar);

document.querySelector(
    ".kpi-card.blue .kpi-value"
).textContent =
    formatNumber(total.terimaTutup);


document.querySelector(
    ".kpi-card.green .kpi-value"
).textContent =
    formatNumber(total.realisasiBayar);


document.querySelector(
    ".kpi-card.green .kpi-percent"
).textContent =
    formatPercent(
        (total.realisasiBayar /
            total.terimaTutup) * 100
    );


document.querySelector(
    ".kpi-card.orange .kpi-value"
).textContent =
    formatNumber(total.terimaBukaan);


document.querySelector(
    ".kpi-card.red .kpi-value"
).textContent =
    formatNumber(total.realisasiBukaan);


document.querySelector(
    ".kpi-card.red .kpi-percent"
).textContent =
    formatPercent(
        (total.realisasiBukaan /
            total.terimaBukaan) * 100
    );


document.querySelector(
    ".kpi-card.purple .kpi-value"
).textContent =
    formatNumber(total.realisasiBayar);
document.getElementById(
    "rekBukaanValue"
).textContent =
    formatNumber(total.rekBukaan);

/* =========================================================
   TABEL
========================================================= */

const tableBody =
    document.getElementById("dataTable");


data.forEach((row, index) => {

    const persenTutup =
        (row.realisasiBayar /
            row.terimaTutup) * 100;


    const persenBukaan =
        (row.realisasiBukaan /
            row.terimaBukaan) * 100;


    const tr =
        document.createElement("tr");


    tr.innerHTML = `

        <td>${index + 1}</td>

        <td>${row.bulan}</td>

        <td>${formatNumber(row.terimaTutup)}</td>

        <td>${formatNumber(row.realisasiBayar)}</td>

        <td>${formatPercent(persenTutup)}</td>

        <td>${formatNumber(row.terimaBukaan)}</td>

        <td>${formatNumber(row.realisasiBukaan)}</td>

        <td>${formatPercent(persenBukaan)}</td>

        <td>${formatNumber(row.lunas)}</td>

        <td>${formatNumber(row.rekBukaan)}</td>

        <td>${formatNumber(row.rek)}</td>

        <td>${formatNumber(row.bukaan)}</td>

        <td>${formatNumber(row.AM)}</td>

        <td>${formatNumber(row.PPP)}</td>

        <td>${formatNumber(row.BPD)}</td>

        <td>${formatNumber(row.TB)}</td>

        <td>${formatNumber(row.PK)}</td>

        <td>${formatNumber(row.PGL)}</td>

        <td>${formatNumber(row.RBK)}</td>

        <td>${formatNumber(row.MTA)}</td>

        <td>${formatNumber(row.Batal)}</td>

        <td>${formatNumber(row.EXP)}</td>

        <td>${formatNumber(row.Penangguhan)}</td>

    `;

    tableBody.appendChild(tr);

});


/* =========================================================
   BULAN YANG BELUM ADA DATA
========================================================= */




/* =========================================================
   TOTAL TABLE
========================================================= */

const totalRow =
    document.getElementById("totalRow");


totalRow.innerHTML = `

<tr>

    <td colspan="2">
        TOTAL (Jan - Aug 2026)
    </td>

    <td>
        ${formatNumber(total.terimaTutup)}
    </td>

    <td>
        ${formatNumber(total.realisasiBayar)}
    </td>

    <td>
        ${formatPercent(
            (total.realisasiBayar /
                total.terimaTutup) * 100
        )}
    </td>

    <td>
        ${formatNumber(total.terimaBukaan)}
    </td>

    <td>
        ${formatNumber(total.realisasiBukaan)}
    </td>

    <td>
        ${formatPercent(
            (total.realisasiBukaan /
                total.terimaBukaan) * 100
        )}
    </td>

    <td>
        ${formatNumber(total.lunas)}
    </td>

    <td>
        ${formatNumber(total.rekBukaan)}
    </td>

    <td>
        ${formatNumber(total.rek)}
    </td>

    <td>
        ${formatNumber(total.bukaan)}
    </td>

    <td>${formatNumber(totalKategori.AM)}</td>
    <td>${formatNumber(totalKategori.PPP)}</td>
    <td>${formatNumber(totalKategori.BPD)}</td>
    <td>${formatNumber(totalKategori.TB)}</td>
    <td>${formatNumber(totalKategori.PK)}</td>
    <td>${formatNumber(totalKategori.PGL)}</td>
    <td>${formatNumber(totalKategori.RBK)}</td>
    <td>${formatNumber(totalKategori.MTA)}</td>
    <td>${formatNumber(totalKategori.Batal)}</td>
    <td>${formatNumber(totalKategori.EXP)}</td>
    <td>${formatNumber(totalKategori.Penangguhan)}</td>

</tr>

`;


/* =========================================================
   TREND CHART
========================================================= */
const trendCanvas =
    document.getElementById("trendChart");


new Chart(
    trendCanvas,
    {

        type: "bar",

        data: {

            labels: data.map(row =>
                row.bulan.replace(" 2026", "")
            ),

            datasets: [

                {
                    label: "Tutup Dinas (Terima)",

                    data: data.map(row =>
                        row.terimaTutup
                    ),

                    backgroundColor: "#16a9ff",

                    borderRadius: 3,

                    yAxisID: "y"
                },

                {
                    label: "Realisasi Bayar",

                    data: data.map(row =>
                        row.realisasiBayar
                    ),

                    backgroundColor: "#00dc86",

                    borderRadius: 3,

                    yAxisID: "y"
                },

                {
                    label: "Bukaan Kembali (Terima)",

                    data: data.map(row =>
                        row.terimaBukaan
                    ),

                    backgroundColor: "#ff9f1c",

                    borderRadius: 3,

                    yAxisID: "yBukaan"
                },

               {
    label: "Realisasi Bukaan",

    data: data.map(row =>
        row.realisasiBukaan
    ),

    type: "line",

    borderColor: "#ff3157",

    backgroundColor: "#ff3157",

    borderWidth: 4,

    pointRadius: 5,

    pointHoverRadius: 7,

    order: 0,

    yAxisID: "yBukaan"
},

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                mode: "index",
                intersect: false
            },

            scales: {

                x: {

                    ticks: {
                        color: "#b9d5e3"
                    },

                    grid: {
                        color:
                            "rgba(50,100,125,0.25)"
                    }

                },

                y: {

                    beginAtZero: true,

                    position: "left",

                    title: {
                        display: true,
                        text: "Tutup Dinas",
                        color: "#16a9ff"
                    },

                    ticks: {
                        color: "#b9d5e3"
                    },

                    grid: {
                        color:
                            "rgba(50,100,125,0.25)"
                    }

                },
yBukaan: {

    beginAtZero: true,

    min: 0,

    max: 600,

    position: "right",

    title: {
        display: true,
        text: "Bukaan Kembali",
        color: "#ff9f1c",

        font: {
            size: 11,
            weight: "bold"
        }
    },

    ticks: {
        color: "#ff9f1c",
        stepSize: 100
    },

    grid: {
        drawOnChartArea: false
    }

},

            },

            plugins: {

               labels: {

    color: "#dceff7",

    font: {
        size: 10,
        weight: "bold"
    },

    boxWidth: 16,

    padding: 8,

    generateLabels(chart) {

        const labels =
            Chart
                .defaults
                .plugins
                .legend
                .labels
                .generateLabels(chart);

        const data =
            chart.data.datasets[0].data;

        const total =
            data.reduce(
                (sum, value) =>
                    sum + Number(value || 0),
                0
            );

        return labels.map(item => {

            const nilai =
                Number(data[item.index] || 0);

            const persen =
                total > 0
                    ? (nilai / total * 100).toFixed(2)
                    : "0.00";

            item.text =
                `${item.text}  ${persen}%`;

            return item;

        });

    }

}

            }

        }

    }
);



/* =========================================================
   REALISASI PER KATEGORI
========================================================= */

const categoryCanvas =
    document.getElementById("categoryChart");


const totalRealisasiKategori =
    Object.values(totalKategori)
        .reduce(
            (total, nilai) =>
                total + Number(nilai || 0),
            0
        );


const donutCenterText = {

    id: "donutCenterText",

    afterDraw(chart) {

        const {
            ctx
        } = chart;

        const meta =
            chart.getDatasetMeta(0);

        if (!meta.data.length) return;

        const x =
            meta.data[0].x;

        const y =
            meta.data[0].y;

        ctx.save();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font =
            "900 22px Arial";

        ctx.fillStyle =
            "#ffffff";

        ctx.shadowColor =
            "rgba(37, 215, 255, 0.45)";

        ctx.shadowBlur = 10;

        ctx.fillText(
            formatNumber(
                totalRealisasiKategori
            ),
            x,
            y - 5
        );

        ctx.shadowBlur = 0;

        ctx.font =
            "700 8px Arial";

        ctx.fillStyle =
            "#8eabb9";

        ctx.fillText(
            "REALISASI KATEGORI",
            x,
            y + 17
        );

        ctx.restore();

    }

};


new Chart(
    categoryCanvas,
    {

        type: "doughnut",

        data: {

            labels: kategori,

            datasets: [

                {

                    data:
                        kategori.map(
                            nama =>
                                totalKategori[nama]
                        ),

                    borderWidth: 1

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "62%",

            plugins: {

                legend: {

                    position: "right",

                    labels: {

                        color: "#dceff7",

                        font: {

                            size: 10,

                            weight: "bold"

                        },

                        boxWidth: 10,

                        padding: 6

                    }

                },

                tooltip: {

                    callbacks: {

                        label(context) {

                            const nilai =
                                Number(
                                    context.raw || 0
                                );

                            const total =
                                totalRealisasiKategori;

                            const persen =
                                total > 0
                                    ? (
                                        nilai /
                                        total *
                                        100
                                    ).toFixed(2)
                                    : 0;

                            return (
                                " " +
                                context.label +
                                ": " +
                                formatNumber(nilai) +
                                " (" +
                                persen +
                                "%)"
                            );

                        }

                    }

                }

            }

        },

        plugins: [
            donutCenterText
        ]

    }
);

/* =========================================================
   JAM REALTIME
========================================================= */

function updateClock() {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "id-ID",
            {
                hour12: false
            }
        );


    const clock =
        document.getElementById("clock");


    if (clock) {

        clock.textContent =
            time + " WIB";

    }

}


setInterval(
    updateClock,
    1000
);


/* =========================================================
   UPDATE FOOTER
========================================================= */

function updateLastUpdate() {

    const now =
        new Date();


    const tanggal =
        now.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    const waktu =
        now.toLocaleTimeString(
            "id-ID",
            {
                hour12: false
            }
        );


    const element =
        document.getElementById(
            "lastUpdate"
        );


    if (element) {

        element.textContent =
            `${tanggal} ${waktu} WIB`;

    }

}


updateClock();
updateLastUpdate();


/* =========================================================
   DEBUG INFO
========================================================= */

console.log(
    "Dashboard Tutup Dinas berhasil dimuat."
);

console.log(
    "Total Terima Tutup:",
    total.terimaTutup
);

console.log(
    "Total Realisasi Bayar:",
    total.realisasiBayar
);

console.log(
    "Total Terima Bukaan:",
    total.terimaBukaan
);

console.log(
    "Total Realisasi Bukaan:",
    total.realisasiBukaan
);
/* =========================================
   WELCOME SCREEN - SESSION
========================================= */

/* =========================================
   WELCOME SCREEN - SESSION
========================================= */

(function () {

    const welcomeScreen =
        document.getElementById("welcomeScreen");
const welcomeAudio =
    document.getElementById("welcomeAudio");
    const welcomeLine =
        document.querySelector(".welcome-line");

    if (!welcomeScreen) return;


    // Jika sesi ini sudah pernah menampilkan Welcome,
    // langsung sembunyikan
    if (
        sessionStorage.getItem("welcomeShown") === "true"
    ) {

        welcomeScreen.style.opacity = "0";
        welcomeScreen.style.visibility = "hidden";
        welcomeScreen.style.pointerEvents = "none";

        return;

    }


    // Tandai Welcome sudah tampil
    sessionStorage.setItem(
        "welcomeShown",
        "true"
    );


    // ================================
    // PROGRESS LOADING 0% → 100%
    // ================================

    let progress = 0;

    const progressTimer = setInterval(function () {

        progress++;

        if (welcomeLine) {
            welcomeLine.style.setProperty(
                "--welcome-progress",
                progress + "%"
            );
        }

        if (progress >= 100) {

    clearInterval(progressTimer);

    if (enterButton) {
        enterButton.classList.add("show");
    }

}

    }, 80);
const enterButton =
    document.getElementById("enterCommandCenter");

function hideWelcome() {
    window.location.href = "home.html";
}

if (enterButton) {

    enterButton.addEventListener("click", function () {

        enterButton.disabled = true;

        if (welcomeAudio) {

            welcomeAudio.currentTime = 0;

            welcomeAudio.play().then(function () {

                welcomeAudio.onended = function () {
                    hideWelcome();
                };

            }).catch(function (error) {

                console.log(
                    "Welcome audio tidak dapat diputar:",
                    error
                );

                hideWelcome();

            });

        } else {

            hideWelcome();

        }

    });

}

})();
