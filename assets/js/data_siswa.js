/* =========================================
   IMPORT FIREBASE
========================================= */

import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  query,
  orderBy
}
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* =========================================
   BASE URL
========================================= */

const BASE_URL =
"https://SMPN20KONSEL.github.io/WEB.SMPN20KONSEL/";

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
   FOTO DEFAULT
========================================= */

const FOTO_DEFAULT =
"https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

/* =========================================
   FORMAT FOTO
========================================= */

function getFotoSiswa(siswa){

  if(
    siswa.foto &&
    siswa.foto.trim() !== ""
  ){
    return siswa.foto;
  }

  return `${BASE_URL}image/siswa/${siswa.nis}.jpg`;

}

/* =========================================
   UPDATE STATISTIK
========================================= */

function updateStatistik(data){

  let jumlahLaki = 0;
  let jumlahPerempuan = 0;

  data.forEach((siswa)=>{

    const gender =
    (siswa.gender || "")
    .toLowerCase();

    if(gender === "laki-laki"){

      jumlahLaki++;

    }else if(gender === "perempuan"){

      jumlahPerempuan++;

    }

  });

  const jumlahSiswa =
  data.length;

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
   RENDER SISWA
========================================= */

function renderSiswa(data){

  /* ================= KOSONG ================= */

  if(!data.length){

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

  /* =========================================
     GROUP KELAS
  ========================================= */

  const kelompokKelas = {};

  for(const siswa of data){

    const kelas =
    siswa.kelas || "Tanpa Kelas";

    if(!kelompokKelas[kelas]){

      kelompokKelas[kelas] = [];

    }

    kelompokKelas[kelas].push(siswa);

  }

  /* =========================================
     SORT KELAS
  ========================================= */

  const romawiMap = {
    "VII": 7,
    "VIII": 8,
    "IX": 9
  };

  const urutanKelas =
  Object.keys(kelompokKelas)
  .sort((a,b)=>{

    const romawiA =
    a.split(" ")[0];

    const romawiB =
    b.split(" ")[0];

    const angkaA =
    romawiMap[romawiA] || 0;

    const angkaB =
    romawiMap[romawiB] || 0;

    if(angkaA !== angkaB){

      return angkaA - angkaB;

    }

    return a.localeCompare(
      b,
      undefined,
      {
        numeric:true,
        sensitivity:"base"
      }
    );

  });

  /* =========================================
     HTML RINGAN
  ========================================= */

  const html = [];

  for(const kelas of urutanKelas){

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

    for(const siswa of kelompokKelas[kelas]){

      html.push(`

        <div class="siswa-card">

          <div class="siswa-foto-box">

            <img
              src="${getFotoSiswa(siswa)}"
              class="siswa-foto"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
              onerror="
                this.onerror=null;
                this.src='${FOTO_DEFAULT}';
              "
            >

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

    }

    html.push(`

        </div>

      </div>

    `);

  }

  /* =========================================
     SEKALI RENDER
  ========================================= */

  dataSiswa.innerHTML =
  html.join("");

}

/* =========================================
   FILTER DATA
========================================= */

function filterData(){

  const keyword =
  (searchInput?.value || "")
  .toLowerCase()
  .trim();

  const kelas =
  filterKelas?.value || "";

  const hasil =
  semuaData.filter((siswa)=>{

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

function debounceFilter(){

  clearTimeout(renderTimeout);

  renderTimeout =
  setTimeout(()=>{

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

  (snapshot)=>{

    const dataBaru = [];

    snapshot.forEach((doc)=>{

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

  (error)=>{

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
   EVENT
========================================= */

if(searchInput){

  searchInput.addEventListener(
    "input",
    debounceFilter
  );

}

if(filterKelas){

  filterKelas.addEventListener(
    "change",
    filterData
  );

}