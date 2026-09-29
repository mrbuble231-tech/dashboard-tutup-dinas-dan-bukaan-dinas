/* =========================================================
   DASHBOARD TUTUP DINAS & BUKAAN KEMBALI TD
   SCRIPT - TAHAP 1C
========================================================= */


/* =========================================================
   DATA MASTER
   Sumber: Laporan Rekapitulasi Tutup Dinas
   Januari - Agustus 2026
========================================================= */

const data = [
    {
        bulan: "Januari 2026",
        terimaTutup: 4238,
        realisasiBayar: 3550,
        terimaBukaan: 433,
        realisasiBukaan: 433,

        lunas: 0,
        rekBukaan: 3550,
        rek: 0,
        bukaan: 0,

        AM: 303,
        PPP: 232,
        BPD: 0,
        TB: 31,
        PK: 16,
        PGL: 103,
        RBK: 3,
        MTA: 0,
        Batal: 0,
        EXP: 0,
        Penangguhan: 0
    },

    {
        bulan: "Februari 2026",
        terimaTutup: 4133,
        realisasiBayar: 3476,
        terimaBukaan: 372,
        realisasiBukaan: 372,

        lunas: 0,
        rekBukaan: 3476,
        rek: 0,
        bukaan: 0,

        AM: 275,
        PPP: 211,
        BPD: 0,
        TB: 38,
        PK: 14,
        PGL: 116,
        RBK: 3,
        MTA: 0,
        Batal: 0,
        EXP: 0,
        Penangguhan: 0
    },

    {
        bulan: "Maret 2026",
        terimaTutup: 4529,
        realisasiBayar: 3747,
        terimaBukaan: 318,
        realisasiBukaan: 318,

        lunas: 0,
        rekBukaan: 3747,
        rek: 0,
        bukaan: 0,

        AM: 287,
        PPP: 239,
        BPD: 0,
        TB: 60,
        PK: 28,
        PGL: 167,
        RBK: 1,
        MTA: 0,
        Batal: 0,
        EXP: 0,
        Penangguhan: 0
    },

    {
        bulan: "April 2026",
        terimaTutup: 4434,
        realisasiBayar: 3809,
        terimaBukaan: 519,
        realisasiBukaan: 519,

        lunas: 0,
        rekBukaan: 3809,
        rek: 0,
        bukaan: 0,

        AM: 342,
        PPP: 214,
        BPD: 0,
        TB: 11,
        PK: 6,
        PGL: 21,
        RBK: 0,
        MTA: 0,
        Batal: 0,
        EXP: 0,
        Penangguhan: 31
    },

    {
        bulan: "Mei 2026",
        terimaTutup: 3696,
        realisasiBayar: 3078,
        terimaBukaan: 421,
        realisasiBukaan: 421,

        lunas: 0,
        rekBukaan: 3078,
        rek: 0,
        bukaan: 0,

        AM: 312,
        PPP: 225,
        BPD: 0,
        TB: 14,
        PK: 6,
        PGL: 51,
        RBK: 0,
        MTA: 0,
        Batal: 0,
        EXP: 0,
        Penangguhan: 14
    },

    {
        bulan: "Juni 2026",
        terimaTutup: 4249,
        realisasiBayar: 4111,
        terimaBukaan: 489,
        realisasiBukaan: 489,

        lunas: 0,
        rekBukaan: 3996,
        rek: 0,
        bukaan: 0,

        AM: 385,
        PPP: 237,
        BPD: 0,
        TB: 60,
        PK: 22,
        PGL: 112,
        RBK: 6,
        MTA: 0,
        Batal: 0,
        EXP: 0,
        Penangguhan: 31
    },

    {
        bulan: "Juli 2026",
        terimaTutup: 4867,
        realisasiBayar: 4440,
        terimaBukaan: 546,
        realisasiBukaan: 546,

        lunas: 0,
        rekBukaan: 3792,
        rek: 0,
        bukaan: 0,

        AM: 450,
        PPP: 368,
        BPD: 0,
        TB: 148,
        PK: 12,
        PGL: 31,
        RBK: 29,
        MTA: 0,
        Batal: 0,
        EXP: 0,
        Penangguhan: 37
    },

    {
        bulan: "Agustus 2026",
        terimaTutup: 4428,
        realisasiBayar: 3785,
        terimaBukaan: 432,
        realisasiBukaan: 432,

        lunas: 0,
        rekBukaan: 3222,
        rek: 0,
        bukaan: 0,

        AM: 434,
        PPP: 255,
        BPD: 0,
        TB: 116,
        PK: 31,
        PGL: 76,
        RBK: 19,
        MTA: 0,
        Batal: 0,
        EXP: 198,
        Penangguhan: 77
    }
];


/* =========================================================
   DATA BULAN KOSONG
========================================================= */

const bulanKosong = [
    "September 2026",
    "Oktober 2026",
    "November 2026"
];


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

bulanKosong.forEach((bulan, index) => {

    const tr =
        document.createElement("tr");

    tr.innerHTML = `

        <td>${data.length + index + 1}</td>

        <td>${bulan}</td>

        <td>-</td>
        <td>-</td>
        <td>-</td>

        <td>-</td>
        <td>-</td>
        <td>-</td>

        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>

        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>

    `;

    tableBody.appendChild(tr);

});


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

                    borderWidth: 2,

                    pointRadius: 4,

                    pointHoverRadius: 6,

                    yAxisID: "yBukaan"
                }

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

                    position: "right",

                    title: {
                        display: true,
                        text: "Bukaan Kembali",
                        color: "#ff9f1c"
                    },

                    ticks: {
                        color: "#ff9f1c"
                    },

                    grid: {
                        drawOnChartArea: false
                    }

                }

            },

            plugins: {

                legend: {

                    labels: {

                        color: "#dceff7",

                        boxWidth: 16,

                        padding: 12

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
                            size: 9
                        },

                        boxWidth: 10,

                        padding: 5

                    }

                }

            }

        }

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
