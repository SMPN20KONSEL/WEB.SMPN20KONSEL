import { db } from "./firebase.js";

import {
  collection,
  onSnapshot
}
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

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

/* =========================================
   RENDER SISWA
========================================= */

function renderSiswa(data){

  if(data.length === 0){

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

  /* ================= GROUP KELAS ================= */

  let kelompokKelas = {};

  data.forEach((siswa)=>{

    const kelas =
    siswa.kelas || "Tanpa Kelas";

    if(!kelompokKelas[kelas]){

      kelompokKelas[kelas] = [];

    }

    kelompokKelas[kelas].push(siswa);

  });

  /* ================= SORT ================= */

  const urutanKelas =
  Object.keys(kelompokKelas)
  .sort();

  /* ================= HTML ================= */

  let html = "";

  urutanKelas.forEach((kelas)=>{

    html += `

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

    `;

    kelompokKelas[kelas]
    .forEach((siswa)=>{

      html += `

      <div class="siswa-card">

        <!-- FOTO -->
<div class="siswa-foto-box">
  <img
    src="${siswa.foto || `../image/siswa/${siswa.nis}.jpg`}"
    class="siswa-foto"
    onerror="
      this.onerror=null;
      this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    "
  >
</div>
        <!-- CONTENT -->

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
              ${siswa.jk || "-"}
            </span>

          </div>

          <div class="siswa-info">

            <i class="fas fa-mosque"></i>

            <span>
              Agama :
              ${siswa.agama || "-"}
            </span>

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
   UPDATE STATISTIK
========================================= */

function updateStatistik(data){

  const jumlahSiswa =
  data.length;

  const jumlahLaki =
  data.filter(
    s => s.jk === "Laki-laki"
  ).length;

  const jumlahPerempuan =
  data.filter(
    s => s.jk === "Perempuan"
  ).length;

  /* ================= SET ================= */

  if(totalSiswaStat){

    totalSiswaStat.textContent =
    jumlahSiswa;

  }

  if(footerTotalSiswa){

    footerTotalSiswa.textContent =
    jumlahSiswa;

  }

  if(totalLaki){

    totalLaki.textContent =
    jumlahLaki;

  }

  if(totalPerempuan){

    totalPerempuan.textContent =
    jumlahPerempuan;

  }

}

/* =========================================
   FILTER
========================================= */

function filterData(){

  const keyword =
  searchInput.value
  .toLowerCase();

  const kelas =
  filterKelas.value;

  const hasil =
  semuaData.filter((siswa)=>{

    const cocokNama =
    (siswa.nama || "")
    .toLowerCase()
    .includes(keyword);

    const cocokKelas =
    kelas === ""
    || siswa.kelas === kelas;

    return (
      cocokNama &&
      cocokKelas
    );

  });

  renderSiswa(hasil);

  updateStatistik(hasil);

}

/* =========================================
   REALTIME FIRESTORE
========================================= */

onSnapshot(
  collection(db, "siswa"),
  (snap)=>{

    semuaData = [];

    snap.forEach((doc)=>{

      semuaData.push({

        id: doc.id,

        ...doc.data()

      });

    });

    /* ================= SORT NAMA ================= */

    semuaData.sort((a,b)=>
      (a.nama || "")
      .localeCompare(b.nama || "")
    );

    renderSiswa(semuaData);

    updateStatistik(semuaData);

    console.log(
      "Realtime siswa aktif"
    );

  },
  (err)=>{

    console.error(
      "Gagal memuat data siswa:",
      err
    );

  }
);

/* =========================================
   EVENT
========================================= */

searchInput.addEventListener(
  "input",
  filterData
);

filterKelas.addEventListener(
  "change",
  filterData
);
