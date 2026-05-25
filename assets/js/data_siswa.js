/* =========================================
   IMPORT FIREBASE
========================================= */

import { db } from "./firebase.js";

import {
  collection,
  onSnapshot
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

/* =========================================
   RENDER SISWA
========================================= */

function renderSiswa(data){

  /* ================= KOSONG ================= */

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

  /* ================= SORT KELAS ================= */

const romawiMap = {
  "VII": 7,
  "VIII": 8,
  "IX": 9
};

const urutanKelas =
Object.keys(kelompokKelas)
.sort((a,b)=>{

  // ambil kata pertama
  const romawiA =
  a.split(" ")[0];

  const romawiB =
  b.split(" ")[0];

  const angkaA =
  romawiMap[romawiA] || 0;

  const angkaB =
  romawiMap[romawiB] || 0;

  // urut kelas
  if(angkaA !== angkaB){

    return angkaA - angkaB;

  }

  // urut abjad
  return a.localeCompare(
    b,
    undefined,
    {
      numeric:true,
      sensitivity:"base"
    }
  );

});

  /* ================= HTML ================= */

  let html = "";

  urutanKelas.forEach((kelas)=>{

    html += `

    <div class="kelas-section">

      <!-- HEADER -->

      <div class="kelas-header">

        <h2>

          <i class="fas fa-school"></i>

          Kelas ${kelas}

        </h2>

        <span>
          ${kelompokKelas[kelas].length} Siswa
        </span>

      </div>

      <!-- GRID -->

      <div class="siswa-grid">

    `;

    /* ================= SISWA ================= */

    kelompokKelas[kelas]
    .forEach((siswa)=>{

      html += `

      <div class="siswa-card">

        <!-- FOTO -->

        <div class="siswa-foto-box">

          <img

            src="${
              siswa.foto ||
              `image/siswa/${siswa.nis}.jpg`
            }"
            class="siswa-foto" onerror="
            this.onerror=null;
            this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; "
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
              ${siswa.gender || "-"}
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
    s => s.gender === "Laki-laki"
  ).length;

  const jumlahPerempuan =
  data.filter(
    s => s.gender === "Perempuan"
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
