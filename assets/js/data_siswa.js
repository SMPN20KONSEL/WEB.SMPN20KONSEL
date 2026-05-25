import { db } from "./firebase.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const dataSiswa = document.getElementById("dataSiswa");
const totalSiswaStat = document.getElementById("totalSiswaStat");
const footerTotalSiswa = document.getElementById("footerTotalSiswa");
const totalLaki = document.getElementById("totalLaki");
const totalPerempuan = document.getElementById("totalPerempuan");
const searchInput = document.getElementById("searchInput");
const filterKelas = document.getElementById("filterKelas");

/* =========================================
   BASE URL GITHUB PAGES
========================================= */

const BASE_URL = "https://SMPN20KONSEL.github.io/WEB.SMPN20KONSEL/";

/* =========================================
   FOTO BUILDER (FAST VERSION)
========================================= */

function getFotoUrl(nis) {
  if (!nis) {
    return `${BASE_URL}image/default-user.png`;
  }

  // urutan prioritas ekstensi (super lengkap)
  const exts = [
    "JPG", "jpg",
    "JPEG", "jpeg",
    "PNG", "png"
  ];

  // langsung pakai fallback chaining via onerror (tanpa async check)
  return `${BASE_URL}image/siswa/${nis}.JPG`;
}

/* =========================================
   DATA GLOBAL
========================================= */

let semuaData = [];

/* =========================================
   RENDER SISWA
========================================= */

function renderSiswa(data) {

  if (data.length === 0) {
    dataSiswa.innerHTML = `
      <div class="loading-box">
        <i class="fas fa-folder-open"></i>
        <p>Data siswa tidak ditemukan</p>
      </div>
    `;
    return;
  }

  let kelompokKelas = {};

  data.forEach((siswa) => {
    const kelas = siswa.kelas || "Tanpa Kelas";

    if (!kelompokKelas[kelas]) {
      kelompokKelas[kelas] = [];
    }

    kelompokKelas[kelas].push(siswa);
  });

  const romawiMap = { "VII": 7, "VIII": 8, "IX": 9 };

  const urutanKelas = Object.keys(kelompokKelas).sort((a, b) => {

    const romawiA = a.split(" ")[0];
    const romawiB = b.split(" ")[0];

    const angkaA = romawiMap[romawiA] || 0;
    const angkaB = romawiMap[romawiB] || 0;

    if (angkaA !== angkaB) return angkaA - angkaB;

    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base"
    });

  });

  let html = "";

  urutanKelas.forEach((kelas) => {

    html += `
      <div class="kelas-section">

        <div class="kelas-header">
          <h2>
            <i class="fas fa-school"></i>
            Kelas ${kelas}
          </h2>
          <span>${kelompokKelas[kelas].length} Siswa</span>
        </div>

        <div class="siswa-grid">
    `;

    kelompokKelas[kelas].forEach((siswa) => {

      html += `
        <div class="siswa-card">

          <div class="siswa-foto-box">

            <img
              class="siswa-foto"
              src="${getFotoUrl(siswa.nis)}"
              onerror="
                this.onerror=null;
                this.src='${BASE_URL}image/siswa/${siswa.nis}.jpg';
              "
              onload="
                if(this.naturalWidth === 0){
                  this.src='${BASE_URL}image/siswa/${siswa.nis}.jpeg';
                }
              "
            >

          </div>

          <div class="siswa-content">

            <h3>${siswa.nama || "-"}</h3>

            <div class="siswa-info">
              <i class="fas fa-id-card"></i>
              <span>NIS : ${siswa.nis || "-"}</span>
            </div>

            <div class="siswa-info">
              <i class="fas fa-layer-group"></i>
              <span>Kelas : ${siswa.kelas || "-"}</span>
            </div>

            <div class="siswa-info">
              <i class="fas fa-user"></i>
              <span>Gender : ${siswa.gender || "-"}</span>
            </div>

          </div>

        </div>
      `;

    });

    html += `
        </div>
      </div>
    `;

  });

  dataSiswa.innerHTML = html;
}

/* =========================================
   STATISTIK
========================================= */

function updateStatistik(data) {

  const jumlahSiswa = data.length;

  const jumlahLaki = data.filter(
    s => s.gender === "Laki-laki"
  ).length;

  const jumlahPerempuan = data.filter(
    s => s.gender === "Perempuan"
  ).length;

  totalSiswaStat.textContent = jumlahSiswa;
  footerTotalSiswa.textContent = jumlahSiswa;
  totalLaki.textContent = jumlahLaki;
  totalPerempuan.textContent = jumlahPerempuan;
}

/* =========================================
   FILTER
========================================= */

function filterData() {

  const keyword = searchInput.value.toLowerCase();
  const kelas = filterKelas.value;

  const hasil = semuaData.filter((siswa) => {

    const cocokNama = (siswa.nama || "")
      .toLowerCase()
      .includes(keyword);

    const cocokKelas =
      kelas === "" || siswa.kelas === kelas;

    return cocokNama && cocokKelas;

  });

  renderSiswa(hasil);
  updateStatistik(hasil);
}

/* =========================================
   REALTIME FIRESTORE
========================================= */

onSnapshot(collection(db, "siswa"), (snap) => {

  semuaData = [];

  snap.forEach((doc) => {
    semuaData.push({
      id: doc.id,
      ...doc.data()
    });
  });

  semuaData.sort((a, b) =>
    (a.nama || "").localeCompare(b.nama || "")
  );

  renderSiswa(semuaData);
  updateStatistik(semuaData);

  console.log("Realtime siswa aktif");

}, (err) => {
  console.error("Gagal memuat data siswa:", err);
});

/* =========================================
   EVENT
========================================= */

searchInput.addEventListener("input", filterData);
filterKelas.addEventListener("change", filterData);
