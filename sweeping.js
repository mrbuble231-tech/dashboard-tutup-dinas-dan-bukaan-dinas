const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSl-54_yoSLzhScnnqobxltHP6ix37y2L_ThNjXic5eqGKd0N5Ule916jxr9ISKQtnGR_RkAVXsxW1O/pub?gid=0&single=true&output=csv";


function parseNumber(value) {

    if (!value) return 0;

    let text = String(value)
        .trim()
        .replace(/"/g, "")
        .replace(/\./g, "")
        .replace(/%/g, "")
        .replace(/,/g, ".");

    return Number(text) || 0;
}


function parseCSVLine(line) {

    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {

        const char = line[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        }

        else if (char === "," && !insideQuotes) {
            result.push(current.trim());
            current = "";
        }

        else {
            current += char;
        }
    }

    result.push(current.trim());

    return result;
}


function normalizeRow(row) {

    if (
        row.length >= 17 &&
        /^\d+$/.test(row[10]) &&
        /^\d+%$/.test(row[11])
    ) {

        row[10] = row[10] + "," + row[11];

        row.splice(11, 1);
    }

    return row;
}


async function loadSweepingData() {

    try {

        const response = await fetch(SHEET_URL);

        if (!response.ok) {
            throw new Error(
                "Gagal mengambil data Google Sheets"
            );
        }

        const csv = await response.text();

        const rows = csv
            .trim()
            .split(/\r?\n/)
            .map(parseCSVLine)
            .map(normalizeRow);


        const data = rows
            .filter(row => {

                const bulan =
                    String(row[0] || "").trim();

                return bulan.match(
                    /^(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember) 2026$/i
                );

            })
            .map(row => ({

                bulan: row[0],

                pelangganBayar:
                    parseNumber(row[1]),

                perbaikan:
                    parseNumber(row[2]),

                denda:
                    parseNumber(row[3]),

                tambahanAir:
                    parseNumber(row[4]),

                targetTambahanAir:
                    parseNumber(row[5]),

                total:
                    parseNumber(row[6]),

                target:
                    parseNumber(row[7]),

                kurang:
                    parseNumber(row[8]),

                lebih:
                    parseNumber(row[9]),

                persen:
                    parseNumber(row[10]),

                kegiatan:
                    parseNumber(row[11]),

                terbayar:
                    parseNumber(row[12]),

                belumTerbayar:
                    parseNumber(row[13]),

                kubikasi:
                    parseNumber(row[14]),

                targetKubikasi:
                    parseNumber(row[15])

            }));


        return data;

    }

    catch (error) {

        console.error(
            "ERROR GOOGLE SHEETS:",
            error
        );

        return [];

    }

}


/* =========================================================
   FORMAT ANGKA
   ========================================================= */

function formatNumber(value) {

    return new Intl.NumberFormat("id-ID")
        .format(value || 0);

}


function formatRupiah(value) {

    return "Rp " + formatNumber(value);

}


function formatPercent(value) {

    return value.toLocaleString(
        "id-ID",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + "%";

}


/* =========================================================
   HITUNG TOTAL
   ========================================================= */

function calculateSummary(data) {

    return {

        pelangganBayar:
            data.reduce(
                (sum, row) =>
                    sum + row.pelangganBayar,
                0
            ),

        tambahanAir:
            data.reduce(
                (sum, row) =>
                    sum + row.tambahanAir,
                0
            ),

        targetTambahanAir:
            data.reduce(
                (sum, row) =>
                    sum + row.targetTambahanAir,
                0
            ),

        total:
            data.reduce(
                (sum, row) =>
                    sum + row.total,
                0
            ),

        target:
            data.reduce(
                (sum, row) =>
                    sum + row.target,
                0
            ),

        kegiatan:
            data.reduce(
                (sum, row) =>
                    sum + row.kegiatan,
                0
            ),

        terbayar:
            data.reduce(
                (sum, row) =>
                    sum + row.terbayar,
                0
            ),

        belumTerbayar:
            data.reduce(
                (sum, row) =>
                    sum + row.belumTerbayar,
                0
            ),

        kubikasi:
            data.reduce(
                (sum, row) =>
                    sum + row.kubikasi,
                0
            ),

        targetKubikasi:
            data.reduce(
                (sum, row) =>
                    sum + row.targetKubikasi,
                0
            )

    };

}


/* =========================================================
   TAMPILKAN KPI
   ========================================================= */

function renderDashboard(data) {

    const total = calculateSummary(data);


    const totalAchievement =
        total.target > 0
            ? (total.total / total.target) * 100
            : 0;


    const tambahanAchievement =
        total.targetTambahanAir > 0
            ? (
                total.tambahanAir /
                total.targetTambahanAir
            ) * 100
            : 0;


    const kubikasiAchievement =
        total.targetKubikasi > 0
            ? (
                total.kubikasi /
                total.targetKubikasi
            ) * 100
            : 0;


    document.getElementById("totalValue")
        .textContent =
        formatRupiah(total.total);


    document.getElementById("targetValue")
        .textContent =
        formatRupiah(total.target);


    document.getElementById("totalAchievement")
        .textContent =
        formatPercent(totalAchievement);


    document.getElementById("tambahanValue")
        .textContent =
        formatRupiah(total.tambahanAir);


    document.getElementById("targetTambahanValue")
        .textContent =
        formatRupiah(total.targetTambahanAir);


    document.getElementById("tambahanAchievement")
        .textContent =
        formatPercent(tambahanAchievement);


    document.getElementById("kubikasiValue")
        .textContent =
        formatNumber(total.kubikasi) + " m³";


    document.getElementById("targetKubikasiValue")
        .textContent =
        formatNumber(total.targetKubikasi) + " m³";


    document.getElementById("kubikasiAchievement")
        .textContent =
        formatPercent(kubikasiAchievement);


    document.getElementById("pelangganValue")
        .textContent =
        formatNumber(total.pelangganBayar);


    document.getElementById("kegiatanValue")
        .textContent =
        formatNumber(total.kegiatan);


    document.getElementById("terbayarValue")
        .textContent =
        formatNumber(total.terbayar);


    document.getElementById("belumTerbayarValue")
        .textContent =
        formatNumber(total.belumTerbayar);


    console.log(
        "RINGKASAN SWEEPING:",
        total
    );

}


/* =========================================================
   START
   ========================================================= */
function renderTrendChart(data) {

function renderTambahanAirTrendChart(data) {

    const canvas =
        document.getElementById("tambahanAirTrendChart");

    if (!canvas) return;

    const chartData =
        data.filter(row => row.tambahanAir !== 0);

    const labels =
        chartData.map(row => row.bulan);

    let cumulative = 0;

    const actualData =
        chartData.map(row => {
            cumulative += row.tambahanAir;
            return cumulative;
        });

    const target =
    Math.max(
        ...data.map(row => row.targetTambahanAir),
        0
    );

    const targetData =
        chartData.map(() => target);

    new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "TAMBAHAN AIR",
                    data: actualData,

                    borderColor: "#25d7ff",
                    backgroundColor:
                        "rgba(37, 215, 255, 0.12)",

                    borderWidth: 2,
                    tension: 0.35,

                    pointRadius: 4,
                    pointHoverRadius: 6,

                    fill: true
                },

                {
                    label: "TARGET TAMBAHAN AIR",
                    data: targetData,

                    borderColor: "#ffffff",
                    backgroundColor:
                        "rgba(255, 255, 255, 0.05)",

                    borderWidth: 2,
                    borderDash: [6, 6],

                    tension: 0.35,

                    pointRadius: 3,
                    pointHoverRadius: 5,

                    fill: false
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

            plugins: {

                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return (
                                context.dataset.label +
                                ": Rp " +
                                new Intl.NumberFormat("id-ID")
                                    .format(context.raw)
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {
                        color: "#91a7b7"
                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                },

                y: {

                    ticks: {

                        color: "#91a7b7",

                        callback: function(value) {

                            return "Rp " +
                                new Intl.NumberFormat(
                                    "id-ID",
                                    {
                                        notation: "compact"
                                    }
                                ).format(value);

                        }

                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                }

            }

        }

    });
}
function renderTambahanAirAchievementChart(data) {

    const canvas =
        document.getElementById("tambahanAirAchievementChart");

    if (!canvas) return;

    const chartData =
        data.filter(row => row.tambahanAir !== 0);

    const labels =
        chartData.map(row => row.bulan);

    let cumulative = 0;

    const achievementData =
        chartData.map(row => {

            cumulative += row.tambahanAir;

           const target =
    Math.max(
        ...data.map(row => row.targetTambahanAir),
        0
    );

if (!target) {
    return 0;
}

return (
    cumulative /
    target
) * 100;

        });

    new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "PENCAPAIAN",

                    data: achievementData,

                    borderColor: "#25d7ff",

                    backgroundColor:
                        "rgba(37, 215, 255, 0.12)",

                    borderWidth: 2,

                    tension: 0.35,

                    pointRadius: 4,

                    pointHoverRadius: 6,

                    fill: true
                },

                {
                    label: "TARGET 100%",

                    data: chartData.map(() => 100),

                    borderColor: "#ffffff",

                    borderDash: [6, 6],

                    borderWidth: 2,

                    pointRadius: 3,

                    fill: false
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

            plugins: {

                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return (
                                context.dataset.label +
                                ": " +
                                new Intl.NumberFormat(
                                    "id-ID",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                ).format(context.raw) +
                                "%"
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {
                        color: "#91a7b7"
                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#91a7b7",

                        callback: function(value) {
                            return value + "%";
                        }

                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                }

            }

        }

    });
}
function renderKubikasiTrendChart(data) {

    const canvas =
        document.getElementById("kubikasiTrendChart");

    if (!canvas) return;

    const chartData =
        data.filter(row => row.kubikasi !== 0);

    const labels =
        chartData.map(row => row.bulan);

    let cumulative = 0;

    const actualData =
        chartData.map(row => {

            cumulative += row.kubikasi;

            return cumulative;
        });

    const target =
        Math.max(
            ...data.map(row => row.targetKubikasi),
            0
        );

    const targetData =
        chartData.map(() => target);

    new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "KUBIKASI PEMAKAIAN",

                    data: actualData,

                    borderColor: "#25d7ff",

                    backgroundColor:
                        "rgba(37, 215, 255, 0.12)",

                    borderWidth: 2,

                    tension: 0.35,

                    pointRadius: 4,

                    pointHoverRadius: 6,

                    fill: true
                },

                {
                    label: "TARGET KUBIKASI",

                    data: targetData,

                    borderColor: "#ffffff",

                    backgroundColor:
                        "rgba(255, 255, 255, 0.05)",

                    borderWidth: 2,

                    borderDash: [6, 6],

                    tension: 0.35,

                    pointRadius: 3,

                    pointHoverRadius: 5,

                    fill: false
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

            plugins: {

                legend: {

                    labels: {
                        color: "#ffffff"
                    }

                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return (
                                context.dataset.label +
                                ": " +
                                new Intl.NumberFormat(
                                    "id-ID"
                                ).format(context.raw) +
                                " m³"
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {
                        color: "#91a7b7"
                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#91a7b7",

                        callback: function(value) {

                            return new Intl.NumberFormat(
                                "id-ID",
                                {
                                    notation: "compact"
                                }
                            ).format(value) + " m³";

                        }

                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                }

            }

        }

    });
}
    const canvas =
        document.getElementById("sweepingTrendChart");

    if (!canvas) return;

    const chartData =
        data.filter(row => row.total !== 0);

    const labels =
        chartData.map(row => row.bulan);

    const totalData =
        chartData.map(row => row.total);

    const targetData =
        chartData.map(row => row.target);

    new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "TOTAL",
                    data: totalData,

                    borderColor: "#25d7ff",
                    backgroundColor:
                        "rgba(37, 215, 255, 0.12)",

                    borderWidth: 2,
                    tension: 0.35,

                    pointRadius: 4,
                    pointHoverRadius: 6,

                    fill: true
                },

                {
                    label: "TARGET",
                    data: targetData,

                    borderColor: "#ffffff",
                    backgroundColor:
                        "rgba(255, 255, 255, 0.05)",

                    borderWidth: 2,
                    borderDash: [6, 6],

                    tension: 0.35,

                    pointRadius: 3,
                    pointHoverRadius: 5,

                    fill: false
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

            plugins: {

                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return (
                                context.dataset.label +
                                ": Rp " +
                                new Intl.NumberFormat("id-ID")
                                    .format(context.raw)
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {
                        color: "#91a7b7"
                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                },

                y: {

                    ticks: {

                        color: "#91a7b7",

                        callback: function(value) {

                            return "Rp " +
                                new Intl.NumberFormat(
                                    "id-ID",
                                    {
                                        notation: "compact"
                                    }
                                ).format(value);

                        }

                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                }

            }

        }

    });
}
function renderTambahanAirTrendChart(data) {

    const canvas =
        document.getElementById("tambahanAirTrendChart");

    if (!canvas) return;

    const chartData =
        data.filter(row => row.tambahanAir !== 0);

    const labels =
        chartData.map(row => row.bulan);

    let cumulative = 0;

    const actualData =
        chartData.map(row => {
            cumulative += row.tambahanAir;
            return cumulative;
        });

    const target =
        Math.max(
            ...data.map(row => row.targetTambahanAir),
            0
        );

    const targetData =
        chartData.map(() => target);

    new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "TAMBAHAN AIR",
                    data: actualData,

                    borderColor: "#25d7ff",
                    backgroundColor:
                        "rgba(37, 215, 255, 0.12)",

                    borderWidth: 2,
                    tension: 0.35,

                    pointRadius: 4,
                    pointHoverRadius: 6,

                    fill: true
                },

                {
                    label: "TARGET TAMBAHAN AIR",
                    data: targetData,

                    borderColor: "#ffffff",
                    backgroundColor:
                        "rgba(255, 255, 255, 0.05)",

                    borderWidth: 2,
                    borderDash: [6, 6],

                    tension: 0.35,

                    pointRadius: 3,
                    pointHoverRadius: 5,

                    fill: false
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

            plugins: {

                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return (
                                context.dataset.label +
                                ": Rp " +
                                new Intl.NumberFormat("id-ID")
                                    .format(context.raw)
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {
                        color: "#91a7b7"
                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                },

                y: {

                    ticks: {

                        color: "#91a7b7",

                        callback: function(value) {

                            return "Rp " +
                                new Intl.NumberFormat(
                                    "id-ID",
                                    {
                                        notation: "compact"
                                    }
                                ).format(value);

                        }

                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                }

            }

        }

    });
}
async function initSweeping() {

    const data =
        await loadSweepingData();

    if (!data.length) {

        console.error(
            "Data Sweeping kosong."
        );

        return;
    }

    console.log(
        "DATA SWEEPING TERBACA:",
        data
    );

    renderDashboard(data);

}
/* =========================================================
   TABEL DATA BULANAN
   ========================================================= */

function renderSweepingTable(data) {

    const tableBody =
        document.getElementById("sweepingTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    data.forEach(row => {

        const tr =
            document.createElement("tr");

        /*
           Cek apakah bulan mempunyai data.
           September–Desember yang masih kosong
           akan ditampilkan sebagai "-".
        */

        const hasData =
            row.pelangganBayar !== 0 ||
            row.perbaikan !== 0 ||
            row.denda !== 0 ||
            row.tambahanAir !== 0 ||
            row.total !== 0 ||
            row.kegiatan !== 0 ||
            row.kubikasi !== 0;


        function valueNumber(value) {

            if (!hasData) return "-";

            return formatNumber(value);
        }


        function valueRupiah(value) {

            if (!hasData) return "-";

            return "Rp " + formatNumber(value);
        }


        function valuePercent(value) {

            if (!hasData) return "-";

            return formatPercent(value);
        }


        tr.innerHTML = `

            <td>${row.bulan}</td>

            <td>${valueNumber(row.pelangganBayar)}</td>

            <td>${valueRupiah(row.perbaikan)}</td>

            <td>${valueRupiah(row.denda)}</td>

            <td>${valueRupiah(row.tambahanAir)}</td>

            <td>-</td>

            <td>${valueRupiah(row.total)}</td>

            <td>${valueRupiah(row.target)}</td>

            <td>${valueRupiah(row.kurang)}</td>

            <td>${valueRupiah(row.lebih)}</td>

            <td>${valuePercent(row.persen)}</td>

            <td>${valueNumber(row.kegiatan)}</td>

            <td>${valueNumber(row.terbayar)}</td>

            <td>${valueNumber(row.belumTerbayar)}</td>

            <<td>${row.kubikasi === 0 || !hasData ? "-" : formatNumber(row.kubikasi) + " m³"}</td>

            <td>-</td>

        `;

        tableBody.appendChild(tr);

    });

}


/* =========================================================
   START
   ========================================================= */
function renderTambahanAirAchievementChart(data) {

    const canvas =
        document.getElementById("tambahanAirAchievementChart");

    if (!canvas) return;

    const chartData =
        data.filter(row => row.tambahanAir !== 0);

    const labels =
        chartData.map(row => row.bulan);

    const target =
        Math.max(
            ...data.map(row => row.targetTambahanAir),
            0
        );

    let cumulative = 0;

    const achievementData =
        chartData.map(row => {

            cumulative += row.tambahanAir;

            if (!target) {
                return 0;
            }

            return (cumulative / target) * 100;
        });

    new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "PENCAPAIAN",

                    data: achievementData,

                    borderColor: "#25d7ff",

                    backgroundColor:
                        "rgba(37, 215, 255, 0.12)",

                    borderWidth: 2,

                    tension: 0.35,

                    pointRadius: 4,

                    pointHoverRadius: 6,

                    fill: true
                },

                {
                    label: "TARGET 100%",

                    data: chartData.map(() => 100),

                    borderColor: "#ffffff",

                    borderDash: [6, 6],

                    borderWidth: 2,

                    pointRadius: 3,

                    fill: false
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

            plugins: {

                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return (
                                context.dataset.label +
                                ": " +
                                new Intl.NumberFormat(
                                    "id-ID",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                ).format(context.raw) +
                                "%"
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {
                        color: "#91a7b7"
                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#91a7b7",

                        callback: function(value) {
                            return value + "%";
                        }

                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                }

            }

        }

    });
}
function renderKubikasiTrendChart(data) {

    const canvas =
        document.getElementById("kubikasiTrendChart");

    if (!canvas) return;

    const chartData =
        data.filter(row => row.kubikasi !== 0);

    const labels =
        chartData.map(row => row.bulan);

    let cumulative = 0;

    const actualData =
        chartData.map(row => {

            cumulative += row.kubikasi;

            return cumulative;
        });

    const target =
        Math.max(
            ...data.map(row => row.targetKubikasi),
            0
        );

    const targetData =
        chartData.map(() => target);

    new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "KUBIKASI PEMAKAIAN",

                    data: actualData,

                    borderColor: "#25d7ff",

                    backgroundColor:
                        "rgba(37, 215, 255, 0.12)",

                    borderWidth: 2,

                    tension: 0.35,

                    pointRadius: 4,

                    pointHoverRadius: 6,

                    fill: true
                },

                {
                    label: "TARGET KUBIKASI",

                    data: targetData,

                    borderColor: "#ffffff",

                    backgroundColor:
                        "rgba(255, 255, 255, 0.05)",

                    borderWidth: 2,

                    borderDash: [6, 6],

                    tension: 0.35,

                    pointRadius: 3,

                    pointHoverRadius: 5,

                    fill: false
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

            plugins: {

                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return (
                                context.dataset.label +
                                ": " +
                                new Intl.NumberFormat("id-ID")
                                    .format(context.raw) +
                                " m³"
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {
                        color: "#91a7b7"
                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#91a7b7",

                        callback: function(value) {

                            return new Intl.NumberFormat(
                                "id-ID",
                                {
                                    notation: "compact"
                                }
                            ).format(value) + " m³";

                        }

                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                }

            }

        }

    });
}
function renderKubikasiAchievementChart(data) {

    const canvas =
        document.getElementById("kubikasiAchievementChart");

    if (!canvas) return;

    const chartData =
        data.filter(row => row.kubikasi !== 0);

    const labels =
        chartData.map(row => row.bulan);

    const target =
        Math.max(
            ...data.map(row => row.targetKubikasi),
            0
        );

    let cumulative = 0;

    const achievementData =
        chartData.map(row => {

            cumulative += row.kubikasi;

            if (!target) {
                return 0;
            }

            return (cumulative / target) * 100;
        });

    new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "PENCAPAIAN",

                    data: achievementData,

                    borderColor: "#25d7ff",

                    backgroundColor:
                        "rgba(37, 215, 255, 0.12)",

                    borderWidth: 2,

                    tension: 0.35,

                    pointRadius: 4,

                    pointHoverRadius: 6,

                    fill: true
                },

                {
                    label: "TARGET 100%",

                    data: chartData.map(() => 100),

                    borderColor: "#ffffff",

                    borderDash: [6, 6],

                    borderWidth: 2,

                    pointRadius: 3,

                    fill: false
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

            plugins: {

                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return (
                                context.dataset.label +
                                ": " +
                                new Intl.NumberFormat(
                                    "id-ID",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                ).format(context.raw) +
                                "%"
                            );

                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {
                        color: "#91a7b7"
                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#91a7b7",

                        callback: function(value) {

                            return new Intl.NumberFormat(
                                "id-ID",
                                {
                                    notation: "compact"
                                }
                            ).format(value) + "%";

                        }

                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.06)"
                    }

                }

            }

        }

    });
}
async function initSweeping() {
    

    const data =
        await loadSweepingData();

    if (!data.length) {

        console.error(
            "Data Sweeping kosong."
        );

        return;
    }

    console.log(
        "DATA SWEEPING TERBACA:",
        data
    );

 renderDashboard(data);
renderSweepingTable(data);
renderTrendChart(data);
renderTambahanAirTrendChart(data);
renderTambahanAirAchievementChart(data);
renderKubikasiTrendChart(data);
renderKubikasiAchievementChart(data);
}


initSweeping();

