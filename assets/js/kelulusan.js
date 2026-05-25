// =========================
// FIREBASE
// =========================

import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


// =========================
// BASE URL (GITHUB PAGES)
// =========================

const BASE_URL = "https://SMPN20KONSEL.github.io/WEB.SMPN20KONSEL/";


// =========================
// ELEMENT
// =========================

const popup = document.getElementById("popupKelulusan");
const hasil = document.getElementById("hasil");
const openBtn = document.getElementById("openKelulusan");
const closeBtn = document.getElementById("closePopup");
const nomorInput = document.getElementById("nomorUjian");


// =========================
// FORMAT NOMOR UJIAN
// =========================

function formatNomor(no) {
  return String(no || "")
    .replace(/[^0-9]/g, "")
    .trim();
}


// =========================
// CEK KELULUSAN
// =========================

openBtn.addEventListener("click", async () => {

  const nomor = formatNomor(nomorInput.value);

  if (!nomor) {
    alert("Masukkan nomor ujian");
    return;
  }

  // LOADING
  hasil.innerHTML = `
    <div class="loading-kelulusan">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Mencari data siswa...</p>
    </div>
  `;

  popup.style.display = "flex";

  try {

    const snap = await getDocs(collection(db, "kelulusan"));

    let ditemukan = null;

    snap.forEach(doc => {

      const data = doc.data();

      const nomorDb = formatNomor(data.nomorUjian || "");

      if (nomorDb === nomor) {
        ditemukan = data;
      }

    });

    // =========================
    // JIKA DITEMUKAN
    // =========================

    if (ditemukan) {

      const statusClass =
        ditemukan.statusKelulusan
          ?.toLowerCase()
          .includes("lulus")
          ? "status-lulus"
          : "status-tidak";


      // =========================
      // FOTO SISWA (FIX FINAL)
      // =========================

      let fotoSiswa = `${BASE_URL}image/default-user.png`;

      if (ditemukan.nis) {

        fotoSiswa =
          `${BASE_URL}image/siswa/${ditemukan.nis}.jpg`;
      }


      // =========================
      // TAMPILKAN HASIL
      // =========================

      hasil.innerHTML = `
      <div class="hasil-card">

        <div class="hasil-top">

          <div class="hasil-foto">

            <img
              src="${fotoSiswa}"
              onerror="
                this.onerror=null;
                this.src='${BASE_URL}image/default-user.png';
              "
              alt="Foto Siswa"
            >

          </div>

          <div class="hasil-info">

            <h1 class="hasil-nama">
              ${ditemukan.nama || "-"}
            </h1>

            <div class="hasil-data">

              <div class="hasil-item">
                <span>NIS</span>
                <b>:</b>
                <strong>${ditemukan.nis || "-"}</strong>
              </div>

              <div class="hasil-item">
                <span>NISN</span>
                <b>:</b>
                <strong>${ditemukan.nisn || "-"}</strong>
              </div>

              <div class="hasil-item">
                <span>Kelas</span>
                <b>:</b>
                <strong>${ditemukan.kelas || "-"}</strong>
              </div>

              <div class="hasil-item">
                <span>Gender</span>
                <b>:</b>
                <strong>${ditemukan.gender || "-"}</strong>
              </div>

              <div class="hasil-item">
                <span>Nomor Ujian</span>
                <b>:</b>
                <strong>${ditemukan.nomorUjian || "-"}</strong>
              </div>

            </div>

          </div>

        </div>

        <div class="hasil-status ${statusClass}">
          ${ditemukan.status || "-"}
        </div>

      </div>
      `;

    }

    // =========================
    // TIDAK DITEMUKAN
    // =========================

    else {

      hasil.innerHTML = `
        <div class="tidak-ditemukan">

          <i class="fas fa-circle-xmark"></i>

          <h2>Data Tidak Ditemukan</h2>

          <p>Nomor ujian tidak terdaftar.</p>

        </div>
      `;

    }

  }

  // ERROR
  catch (err) {

    console.error(err);

    hasil.innerHTML = `
      <div class="tidak-ditemukan">

        <i class="fas fa-triangle-exclamation"></i>

        <h2>Terjadi Kesalahan</h2>

        <p>Gagal mengambil data dari Firebase.</p>

      </div>
    `;

  }

});


// =========================
// CLOSE POPUP
// =========================

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});


// =========================
// ENTER KEY
// =========================

nomorInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    openBtn.click();
  }
});
