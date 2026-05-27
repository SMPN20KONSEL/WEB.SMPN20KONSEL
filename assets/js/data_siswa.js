/* =========================================
   IMPORT FIREBASE
========================================= */

import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* =========================================
   ELEMENT
========================================= */

const dataSiswa =
document.getElementById("dataSiswa");

const totalSiswaStat =
document.getElementById("totalSiswaStat");

const footerTotalSiswa =
document.getElementById("footerTotalSiswa");

const totalLaki =
document.getElementById("totalLaki");

const totalPerempuan =
document.getElementById("totalPerempuan");

const searchInput =
document.getElementById("searchInput");

const filterKelas =
document.getElementById("filterKelas");

/* =========================================
   DATA GLOBAL
========================================= */

let semuaData = [];
let renderTimeout = null;

/* =========================================
   UPDATE STATISTIK
========================================= */

function updateStatistik(data) {

  let jumlahLaki = 0;
  let jumlahPerempuan = 0;

  data.forEach((siswa) => {

    const gender =
    (siswa.gender || "")
    .toLowerCase();

    if (gender === "laki-laki") {

      jumlahLaki++;

    } else if (gender === "perempuan") {

      jumlahPerempuan++;

    }

  });

  const jumlahSiswa =
  data.length;

  if (totalSiswaStat) {

    totalSiswaStat.textContent =
    jumlahSiswa;

  }

  if (footerTotalSiswa) {

    footerTotalSiswa.textContent =
    jumlahSiswa;

  }

  if (totalLaki) {

    totalLaki.textContent =
    jumlahLaki;

  }

  if (totalPerempuan) {

    totalPerempuan.textContent =
    jumlahPerempuan;

  }

}

/* =========================================
   RENDER SISWA
========================================= */

function renderSiswa(data) {

  /* =========================
     DATA KOSONG
  ========================= */

  if (!data.length) {

    dataSiswa.innerHTML = `

      <div class="loading-box">

        <i class="fas fa-folder-open"></i>

        <p>
          Data siswa tidak ditemukan
        </p>

      </div>

    `;

    return;

  }

  /* =========================
     GROUP BERDASARKAN KELAS
  ========================= */

  const kelompokKelas = {};

  data.forEach((siswa) => {

    const kelas =
    siswa.kelas || "Tanpa Kelas";

    if (!kelompokKelas[kelas]) {

      kelompokKelas[kelas] = [];

    }

    kelompokKelas[kelas].push(siswa);

  });

  /* =========================
     SORTING KELAS
  ========================= */

  const romawiMap = {

    "VII": 7,
    "VIII": 8,
    "IX": 9

  };

  const urutanKelas =
  Object.keys(kelompokKelas)
  .sort((a, b) => {

    const romawiA =
    a.split(" ")[0];

    const romawiB =
    b.split(" ")[0];

    const angkaA =
    romawiMap[romawiA] || 0;

    const angkaB =
    romawiMap[romawiB] || 0;

    if (angkaA !== angkaB) {

      return angkaA - angkaB;

    }

    return a.localeCompare(
      b,
      undefined,
      {
        numeric: true,
        sensitivity: "base"
      }
    );

  });

  /* =========================
     GENERATE HTML
  ========================= */

  const html = [];

  urutanKelas.forEach((kelas) => {

    html.push(`

      <div class="kelas-section">

        <div class="kelas-header">

          <h2>

            <i class="fas fa-school"></i>

            Kelas ${kelas}

          </h2>

          <span>
            ${kelompokKelas[kelas].length} Siswa
          </span>

        </div>

        <div class="siswa-grid">

    `);

    kelompokKelas[kelas].forEach((siswa) => {

      html.push(`

        <div class="siswa-card">

          <div class="siswa-foto-box">

            <img
              src="${
                siswa.foto ||
                `image/siswa/${(siswa.nis || "").trim()}.jpg`
              }"

              onerror="
                this.onerror=null;
                this.src='image/siswa/user.png'
              "

              alt="Foto Siswa"
            />

          </div>

          <div class="siswa-content">

            <h3>
              ${siswa.nama || "-"}
            </h3>

            <div class="siswa-info">

              <i class="fas fa-id-card"></i>

              <span>
                NIS :
                ${siswa.nis || "-"}
              </span>

            </div>

            <div class="siswa-info">

              <i class="fas fa-layer-group"></i>

              <span>
                Kelas :
                ${siswa.kelas || "-"}
              </span>

            </div>

            <div class="siswa-info">

              <i class="fas fa-user"></i>

              <span>
                Gender :
                ${siswa.gender || "-"}
              </span>

            </div>

          </div>

        </div>

      `);

    });

    html.push(`

        </div>

      </div>

    `);

  });

  /* =========================
     SEKALI RENDER
  ========================= */

  dataSiswa.innerHTML =
  html.join("");

}

/* =========================================
   FILTER DATA
========================================= */

function filterData() {

  const keyword =
  (searchInput?.value || "")
  .toLowerCase()
  .trim();

  const kelas =
  filterKelas?.value || "";

  const hasil =
  semuaData.filter((siswa) => {

    const nama =
    (siswa.nama || "")
    .toLowerCase();

    const nis =
    (siswa.nis || "")
    .toString()
    .toLowerCase();

    const cocokKeyword =

      nama.includes(keyword) ||

      nis.includes(keyword);

    const cocokKelas =

      !kelas ||

      siswa.kelas === kelas;

    return (

      cocokKeyword &&
      cocokKelas

    );

  });

  renderSiswa(hasil);

  updateStatistik(hasil);

}

/* =========================================
   DEBOUNCE SEARCH
========================================= */

function debounceFilter() {

  clearTimeout(renderTimeout);

  renderTimeout =
  setTimeout(() => {

    filterData();

  }, 300);

}

/* =========================================
   REALTIME FIRESTORE
========================================= */

const q = query(

  collection(db, "siswa"),
  orderBy("nama")

);

onSnapshot(

  q,

  (snapshot) => {

    const dataBaru = [];

    snapshot.forEach((doc) => {

      dataBaru.push({

        id: doc.id,

        ...doc.data()

      });

    });

    semuaData = dataBaru;

    filterData();

    console.log(
      "Realtime siswa aktif:",
      semuaData.length
    );

  },

  (error) => {

    console.error(
      "Gagal memuat data siswa:",
      error
    );

    dataSiswa.innerHTML = `

      <div class="loading-box">

        <i class="fas fa-triangle-exclamation"></i>

        <p>
          Gagal mengambil data siswa
        </p>

      </div>

    `;

  }

);

/* =========================================
   EVENT LISTENER
========================================= */

if (searchInput) {

  searchInput.addEventListener(
    "input",
    debounceFilter
  );

}

if (filterKelas) {

  filterKelas.addEventListener(
    "change",
    filterData
  );

}