// =========================
// FIREBASE
// =========================

import { db } from "./firebase.js";

import {
  collection,
  getDocs
}
from
"https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


// =========================
// BASE URL
// =========================

const BASE_URL =
"https://SMPN20KONSEL.github.io/WEB.SMPN20KONSEL/";


// =========================
// ELEMENT
// =========================

const popup =
document.getElementById(
"popupKelulusan"
);

const hasil =
document.getElementById(
"hasil"
);

const openBtn =
document.getElementById(
"openKelulusan"
);

const closeBtn =
document.getElementById(
"closePopup"
);

const nomorInput =
document.getElementById(
"nomorUjian"
);


// =========================
// FORMAT NOMOR UJIAN
// =========================

function formatNomor(no){

  return String(no || "")

  .replace(/[^0-9]/g,"")

  .trim();

}


// =========================
// OPEN POPUP
// =========================

function openPopup(){

  popup.classList.add(
    "show"
  );

}


// =========================
// CLOSE POPUP
// =========================

function closePopupFunc(){

  popup.classList.remove(
    "show"
  );

}


// =========================
// LOADING
// =========================

function tampilLoading(){

  hasil.innerHTML = `

    <div class="loading-kelulusan">

      <i class="fas fa-spinner fa-spin"></i>

      <p>
        Mencari data siswa...
      </p>

    </div>

  `;

}


// =========================
// HASIL DITEMUKAN
// =========================

function tampilHasil(data){

  const statusText =
  data.status || "-";

  const isLulus =
  statusText
  .toLowerCase()
  .includes("lulus");

  const statusClass =
  isLulus
  ? "status-lulus"
  : "status-tidak";

  let fotoSiswa =
  `${BASE_URL}image/default-user.png`;

  if(data.nis){

    fotoSiswa =
    `${BASE_URL}image/siswa/${data.nis}.jpg`;

  }

  hasil.innerHTML = `

    <div class="hasil-card">

      <div class="hasil-top">

        <!-- FOTO -->

        <div class="hasil-foto">

          <img
            src="${fotoSiswa}"

            alt="Foto Siswa"

            onerror="
              this.onerror=null;
              this.src='${BASE_URL}image/default-user.png';
            "
          >

        </div>

        <!-- INFO -->

        <div class="hasil-info">

          <h1 class="hasil-nama">
            ${data.nama || "-"}
          </h1>

          <div class="hasil-data">

            <div class="hasil-item">

              <span>NIS</span>

              <b>:</b>

              <strong>
                ${data.nis || "-"}
              </strong>

            </div>

            <div class="hasil-item">

              <span>NISN</span>

              <b>:</b>

              <strong>
                ${data.nisn || "-"}
              </strong>

            </div>

            <div class="hasil-item">

              <span>Kelas</span>

              <b>:</b>

              <strong>
                ${data.kelas || "-"}
              </strong>

            </div>

            <div class="hasil-item">

              <span>Gender</span>

              <b>:</b>

              <strong>
                ${data.gender || "-"}
              </strong>

            </div>

            <div class="hasil-item">

              <span>Nomor Ujian</span>

              <b>:</b>

              <strong>
                ${data.nomorUjian || "-"}
              </strong>

            </div>

          </div>

        </div>

      </div>

      <!-- STATUS -->

      <div class="
      hasil-status
      ${statusClass}
      ">

        ${statusText}

      </div>

    </div>

  `;

}


// =========================
// DATA TIDAK DITEMUKAN
// =========================

function tampilTidakDitemukan(){

  hasil.innerHTML = `

    <div class="tidak-ditemukan">

      <i class="fas fa-circle-xmark"></i>

      <h2>
        Data Tidak Ditemukan
      </h2>

      <p>
        Nomor ujian tidak terdaftar.
      </p>

    </div>

  `;

}


// =========================
// ERROR
// =========================

function tampilError(){

  hasil.innerHTML = `

    <div class="tidak-ditemukan">

      <i class="fas fa-triangle-exclamation"></i>

      <h2>
        Terjadi Kesalahan
      </h2>

      <p>
        Gagal mengambil data dari Firebase.
      </p>

    </div>

  `;

}


// =========================
// CEK KELULUSAN
// =========================

openBtn.addEventListener(

"click",

async ()=>{

  const nomor =
  formatNomor(
    nomorInput.value
  );

  if(!nomor){

    alert(
      "Masukkan nomor ujian"
    );

    nomorInput.focus();

    return;

  }

  openPopup();

  tampilLoading();

  try{

    const snap =
    await getDocs(
      collection(
        db,
        "kelulusan"
      )
    );

    let ditemukan =
    null;

    snap.forEach((doc)=>{

      const data =
      doc.data();

      const nomorDb =
      formatNomor(
        data.nomorUjian
      );

      if(
        nomorDb === nomor
      ){

        ditemukan =
        data;

      }

    });

    if(ditemukan){

      tampilHasil(
        ditemukan
      );

    }else{

      tampilTidakDitemukan();

    }

  }catch(err){

    console.error(err);

    tampilError();

  }

}

);


// =========================
// CLOSE EVENT
// =========================

closeBtn.addEventListener(

"click",

closePopupFunc

);

popup.addEventListener(

"click",

(e)=>{

  if(e.target === popup){

    closePopupFunc();

  }

}

);


// =========================
// ENTER KEY
// =========================

nomorInput.addEventListener(

"keypress",

(e)=>{

  if(e.key === "Enter"){

    openBtn.click();

  }

}

);