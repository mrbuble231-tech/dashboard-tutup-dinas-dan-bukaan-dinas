let lastAlarmId =
localStorage.getItem("lastAlarmId") || "";
let zonaChart;
let bulanMax = "-";
let bulanMin = "-";
let maxKasus = 0;
let minKasus = 0;
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTTAgE1S935-2P6AUUddelLeHJBOcUgrzAROMQAzu1AyGhm6SVRncEcuplPqxnvdFKsZDEcIOqyhwbv/pub?output=csv";
const TREND_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTTAgE1S935-2P6AUUddelLeHJBOcUgrzAROMQAzu1AyGhm6SVRncEcuplPqxnvdFKsZDEcIOqyhwbv/pub?gid=1078006060&single=true&output=csv";
const trendCtx =
document.getElementById("trendChart")
.getContext("2d");
const trendChartRH = new Chart(trendCtx, {

    data: {

        labels: [],

        datasets: [

        {
            type: "bar",

            label: "Meter Hilang",

            data: [],

            backgroundColor: [
                "#00ffcc",
                "#00e6b8",
                "#00d4aa",
                "#00c49a",
                "#00b38a",
                "#00a57d"
            ],

            borderRadius: 8
        },

        {
            type: "line",

            label: "Trend",

            data: [],

            borderColor: "#ffffff",

            backgroundColor: "#ffffff",

            borderWidth: 3,

            tension: 0.3,

            fill: false
        }

        ]
    },

    options: {
        responsive: true,

        plugins: {
            legend: {
                labels: {
                    color: "white"
                }
            }
        },

        scales: {

            x: {
                ticks: {
                    color: "white"
                }
            },

            y: {
                beginAtZero: true,
                ticks: {
                    color: "white"
                }
            }

        }
    }

});
const ctx = document.getElementById('zonaChart');

zonaChart = new Chart(ctx,{
    type:'bar',
    data:{
        labels:['Zona 1','Zona 2','Zona 3','Zona 4','Zona 5'],
        datasets:[{
            label:'Meter Hilang',
            data:[0,0,0,0,0],

            backgroundColor:[
                '#8b5cf6',
                '#f59e0b',
                '#3b82f6',
                '#ef4444',
                '#22c55e'
            ],

            borderRadius:8
        }]
    },

    options:{
        responsive:true,
        maintainAspectRatio:false
    }
});
async function loadDashboardData() {

try {

const response = await fetch(SHEET_URL + "&t=" + Date.now());

if (!response.ok) {
    throw new Error("Gagal mengambil data Google Sheet");
}

const csv = await response.text();
    const rows = csv.trim().split("\n");
    const header = rows[0];

const dataRows = rows.slice(1);

dataRows.sort((a,b)=>{

    const aCols = a.split(",");
    const bCols = b.split(",");

    const aDate = aCols[0].split("/");
    const bDate = bCols[0].split("/");

    const dateA = new Date(
        aDate[2],
        aDate[1]-1,
        aDate[0]
    );

    const dateB = new Date(
        bDate[2],
        bDate[1]-1,
        bDate[0]
    );

    return dateB - dateA;

});

rows.length = 0;

rows.push(header);

rows.push(...dataRows);

    let zona1 = 0;
    let zona2 = 0;
    let zona3 = 0;
    let zona4 = 0;
    let zona5 = 0;

    let total = rows.length - 1;
    const currentRowCount = total;
    let alarmList = [];
let zonaAktif = {};

    for(let i=1;i<rows.length;i++){

        const cols = rows[i].split(",");

        const zona = cols[1]?.trim().toUpperCase();

        if(zona === "ZONA 1") zona1++;
        if(zona === "ZONA 2") zona2++;
        if(zona === "ZONA 3") zona3++;
        if(zona === "ZONA 4") zona4++;
        if(zona === "ZONA 5") zona5++;
    }

 const totalBox = document.querySelector(".big-number");

animateValue(totalBox,0,total,1200);

   document.getElementById("z1").textContent = zona1;
document.getElementById("z2").textContent = zona2;
document.getElementById("z3").textContent = zona3;
document.getElementById("z4").textContent = zona4;
document.getElementById("z5").textContent = zona5;

// SMART MAP BADGE
document.getElementById("badgeZ1").textContent = zona1;
document.getElementById("badgeZ2").textContent = zona2;
document.getElementById("badgeZ3").textContent = zona3;
document.getElementById("badgeZ4").textContent = zona4;
document.getElementById("badgeZ5").textContent = zona5;
  
for(let i=1;i<rows.length;i++){

    const cols = rows[i].split(",");

    const zona = cols[1]?.trim().toUpperCase();
    const status = cols[7]?.trim().toUpperCase();

    if(status === "PROSES" || status === "BARU"){

        zonaAktif[zona] =
        (zonaAktif[zona] || 0) + 1;
    }
}
let hotZona = "-";
let jumlahKasus = 0;

for(let zona in zonaAktif){

    if(zonaAktif[zona] > jumlahKasus){

        jumlahKasus = zonaAktif[zona];
        hotZona = zona;
    }
}

document.getElementById("hotZoneNama")
.textContent = hotZona;

document.getElementById("hotZoneJumlah")
.textContent = jumlahKasus + " Kasus Aktif";
const hotCard =
document.querySelector(".hotzone-card");

if(jumlahKasus > 0){

    hotCard.classList.add("hot-alert");

}else{

    hotCard.classList.remove("hot-alert");
}
zonaChart.data.datasets[0].data = [
    
    zona1,
    zona2,
    zona3,
    zona4,
    zona5
];
let level = "🟢 NORMAL";

const levelCard =
document.querySelector(".level-card");

levelCard.classList.remove(
    "level-normal",
    "level-waspada",
    "level-siaga",
    "level-kritis"
);

if(jumlahKasus >= 5){

    level = "🔴 KRITIS";
    levelCard.classList.add("level-kritis");

}
else if(jumlahKasus >= 3){

    level = "🟠 SIAGA";
    levelCard.classList.add("level-siaga");

}
else if(jumlahKasus >= 1){

    level = "🟡 WASPADA";
    levelCard.classList.add("level-waspada");

}
else{

    levelCard.classList.add("level-normal");
}

document.getElementById("levelAlarm")
.textContent = level;

document.getElementById("levelInfo")
.textContent =
jumlahKasus + " Kasus Aktif";


for(let i=1;i<rows.length;i++){

    const cols = rows[i].split(",");

    const status = cols[7]?.trim().toUpperCase();

    if(status === "PROSES" || status === "BARU"){

        alarmList.push({

            pelanggan: cols[3],
            nomor: cols[2],
            zona: cols[1],
            alamat: cols[5],
            telepon: cols[4],
            golongan: cols[6],
            tanggal: cols[0],
            status: cols[7]

        });

    }

}
if(alarmList.length > 0){

    console.log(alarmList);

    const popupData = alarmList[0];
    let html = "";

alarmList.slice(0,5).forEach(item=>{
html += `

<div class="alarm-item">

    <div class="alarm-name">
        👤 ${item.pelanggan}
    </div>

    <div class="alarm-zona">
        📍 ${item.zona}
    </div>

    <div class="alarm-date">
        🗓 ${item.tanggal}
    </div>

</div>

`;

});

if(alarmList.length > 5){

html += `

<div class="alarm-more">

+ ${alarmList.length-5} laporan lainnya...

</div>

`;

}

    document.getElementById("alarmStatus").innerHTML =
    "🔴 ALARM AKTIF";

    document.getElementById("alarmStatus")
    .classList.remove("normal");

    document.getElementById("alarmStatus")
    .classList.add("active");

    document.getElementById("alarmContainer").innerHTML = html;

}
else{

    document.getElementById("alarmStatus").innerHTML =
    "🟢 NORMAL";

    document.getElementById("alarmStatus")
    .classList.remove("active");

    document.getElementById("alarmStatus")
    .classList.add("normal");

    document.getElementById("alarmContainer").innerHTML = "";

}
if (alarmList.length > 0) {

    const popupData = alarmList[0];
    const alarmId = popupData.nomor + "_" + popupData.tanggal;

if (alarmId !== lastAlarmId) {

    if (audioUnlocked) {

        showEmergencyAlarm(popupData);

        lastAlarmId = alarmId;
        localStorage.setItem("lastAlarmId", alarmId);

    } else {

        console.log("⏳ Alarm menunggu aktivasi audio");

        pendingAlarm = {
            popupData,
            alarmId
        };

    }

}
}
const tableBody = document.getElementById("latestTable");

tableBody.innerHTML = "";

let tampil = 0;

for(let i = rows.length - 1; i >= 1; i--){

    if(tampil >= 10) break;

    const cols = rows[i].split(",");

    const tanggal = cols[0] || "";
const zona = cols[1] || "";
const pelanggan = cols[2] || "";
const nama = cols[3] || "";
const telepon = cols[4] || "";
const golongan = cols[6] || "";
const status = cols[7] || "";
let statusClass = "";

if(status.toUpperCase() === "PROSES"){
    statusClass = "status-proses";
}
else if(status.toUpperCase() === "SELESAI"){
    statusClass = "status-selesai";
}
else if(status.toUpperCase() === "BARU"){
    statusClass = "status-baru";
}

tableBody.innerHTML += `
<tr>
    <td>${tanggal}</td>
    <td>${zona}</td>
    <td>${pelanggan}</td>
    <td>${nama}</td>
    <td>${telepon}</td>
    <td>${golongan}</td>
    <td class="${statusClass}">
    ${status}
</td>
</tr>
`;

    tampil++;
}


zonaChart.update();

// Simpan jumlah baris terakhir
document.getElementById("runningText").innerHTML = `
🚨 <b>METER HILANG AKTIF :</b> ${alarmList.length} KASUS
&nbsp;&nbsp;◆&nbsp;&nbsp;
🔥 <b>HOT ZONE :</b> ${hotZona} (${jumlahKasus} KASUS)
&nbsp;&nbsp;◆&nbsp;&nbsp;
🚦 <b>LEVEL :</b> ${level}
&nbsp;&nbsp;◆&nbsp;&nbsp;
🏆 <b>BULAN TERTINGGI :</b> ${bulanMax}
&nbsp;&nbsp;◆&nbsp;&nbsp;
📉 <b>BULAN TERENDAH :</b> ${bulanMin}
`;

console.log("🔄 DATA DASHBOARD DIPERBARUI");

} catch (error) {

    console.error("❌ GAGAL UPDATE DASHBOARD:", error);

}

}
fetch(TREND_URL)
.then(response => response.text())
.then(csv => {

    const rows = csv.trim().split("\n");

    const bulan = [];
    const kasus = [];

    for(let i=1;i<rows.length;i++){

        const cols = rows[i].split(",");

        bulan.push(cols[0]);

        kasus.push(
            parseInt(cols[1]) || 0
        );
    }

    trendChartRH.data.labels = bulan;

    trendChartRH.data.datasets[0].data = kasus;
    trendChartRH.data.datasets[1].data = kasus;

    trendChartRH.update();
maxKasus = Math.max(...kasus);
minKasus = Math.min(...kasus);

bulanMax =
bulan[kasus.indexOf(maxKasus)];

bulanMin =
bulan[kasus.indexOf(minKasus)];

document.getElementById("bulanTertinggi")
.textContent = bulanMax;

document.getElementById("nilaiTertinggi")
.textContent = maxKasus + " Kasus";

document.getElementById("bulanTerendah")
.textContent = bulanMin;
 document.getElementById("nilaiTerendah")
.textContent = minKasus + " Kasus";
});
// ===============================
// RHINOCEROS COUNT UP ANIMATION
// ===============================

function animateValue(element,start,end,duration=1200){

    const range = end-start;

    const startTime = performance.now();

    function update(now){

        const progress =
        Math.min((now-startTime)/duration,1);

        const eased =
        1-Math.pow(1-progress,3);

        element.textContent =
        Math.floor(
            start+(range*eased)
        ).toLocaleString("id-ID");

        if(progress<1){

            requestAnimationFrame(update);

        }else{

            element.classList.add("animate");

            setTimeout(()=>{

                element.classList.remove("animate");

            },800);

        }

    }

    requestAnimationFrame(update);

}
function updateClock(){

    const now = new Date();

    const jam = now.toLocaleTimeString('id-ID');

    const tanggal = now.toLocaleDateString('id-ID', {
        day:'2-digit',
        month:'long',
        year:'numeric'
    });

    document.getElementById("jam").textContent =
        jam + " WIB";

    document.getElementById("tanggal").textContent =
        tanggal;
}


let audioUnlocked = false;
let pendingAlarm = null;

document.addEventListener("click", async () => {

    const sound = document.getElementById("alarmSound");

    try {

        sound.volume = 1;

        await sound.play();

        sound.pause();
        sound.currentTime = 0;

        audioUnlocked = true;

        console.log("🔊 SISTEM AUDIO AKTIF");

   if (pendingAlarm) {

    showEmergencyAlarm(
        pendingAlarm.popupData
    );

    lastAlarmId =
        pendingAlarm.alarmId;

    localStorage.setItem(
        "lastAlarmId",
        pendingAlarm.alarmId
    );

    pendingAlarm = null;

}

    } catch (error) {

        console.error(
            "Gagal mengaktifkan audio:",
            error
        );

    }

}, { once: true });


function showEmergencyAlarm(popupData) {

    const sound =
        document.getElementById("alarmSound");

    document.getElementById("popupNama").textContent =
        popupData.pelanggan;

    document.getElementById("popupZona").textContent =
        "📍 " + popupData.zona;

    document.getElementById("popupTanggal").textContent =
        "📅 " + popupData.tanggal;

    document.getElementById("emergencyPopup").style.display =
        "flex";

    sound.pause();
    sound.currentTime = 0;
    sound.volume = 1;

    sound.play()
        .then(() => {

            console.log("🚨 ALARM BERBUNYI");

        })
        .catch(error => {

            console.error(
                "❌ ALARM GAGAL:",
                error
            );

        });

    setTimeout(() => {

        document.getElementById("emergencyPopup").style.display =
            "none";

        sound.pause();
        sound.currentTime = 0;

    }, 10000);
}
// ===============================
// LIVE WEATHER SURABAYA
// ===============================

async function updateWeather(){

    try{

        const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=-7.2575&longitude=112.7521&current=temperature_2m,weather_code"
        );

        const data = await res.json();

        const suhu = data.current.temperature_2m;
        const code = data.current.weather_code;

        let icon = "🌤";
        let text = "Cerah";

        if(code >= 51){
            icon = "🌧";
            text = "Hujan";
        }
        else if(code >= 3){
            icon = "☁️";
            text = "Berawan";
        }

        document.getElementById("weatherIcon").textContent = icon;

        document.getElementById("weatherText").textContent =
            `${text} | ${suhu}°C`;

        const now = new Date();

        document.getElementById("lastUpdate").textContent =
            "🔄 Update " +
            now.toLocaleTimeString("id-ID");

    }
    catch(err){

        document.getElementById("weatherText").textContent =
            "Cuaca tidak tersedia";

        console.log(err);

    }

}
// ======================================
// START APPLICATION
// ======================================


updateWeather();
function updateSystemStatus(){

    document.getElementById("systemStatus").textContent =
        "🟢 SYSTEM NORMAL";

    document.getElementById("sheetStatus").textContent =
        "📡 Google Sheet Online";

    document.getElementById("weatherStatus").textContent =
        "🌤 Cuaca Online";

    document.getElementById("refreshStatus").textContent =
        "🔄 Auto Refresh : 30 Detik";

}
updateClock();

setInterval(updateClock,1000);
function testSound() {
 const sound = document.getElementById("alarmSound");

sound.pause();
sound.currentTime = 0;
sound.volume = 1;

sound.play()
    .then(() => {
        console.log("🚨 ALARM BERBUNYI");
    })
    .catch(error => {
        console.error("❌ ALARM GAGAL:", error);
    });
}
updateSystemStatus();

setInterval(updateWeather,900000);
loadDashboardData();
setInterval(loadDashboardData, 30000);
