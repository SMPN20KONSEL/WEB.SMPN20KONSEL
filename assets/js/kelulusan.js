import { db } from "./firebase.js";

import {
  doc,
  onSnapshot,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


// =========================
// BASE URL
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
// WAKTU PENGUMUMAN
// =========================

let waktuBuka = null;


// =========================
// BULAN INDONESIA MAP (FIX PENTING)
// =========================

const bulanMap = {
  "Januari": 0,
  "Februari": 1,
  "Maret": 2,
  "April": 3,
  "Mei": 4,
  "Juni": 5,
  "Juli": 6,
  "Agustus": 7,
  "September": 8,
  "Oktober": 9,
  "November": 10,
  "Desember": 11
};


// =========================
// FIREBASE REALTIME SETTING
// =========================

const ref = doc(db, "website", "kelulusan");

onSnapshot(ref, (snap) => {

  if (!snap.exists()) return;

  const d = snap.data();

  const section = document.getElementById("kelulusanSection");

  // hide/show section
  if (d.aktif === false) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";

  // UI update
  document.getElementById("v_label").innerText = d.label || "-";
  document.getElementById("v_title").innerHTML = (d.title || "-").replace(/\n/g, "<br>");
  document.getElementById("v_desc").innerText = d.desc || "-";
  document.getElementById("v_tanggal").innerText = d.tanggal_pengumuman || "-";
  document.getElementById("v_jam").innerText = d.jam_pengumuman || "-";
  document.getElementById("v_image").src = d.image || "image/guru.jpeg";
  document.getElementById("v_welcome_title").innerText = d.welcome_title || "-";
  document.getElementById("v_welcome_desc").innerText = d.welcome_desc || "-";

  // =========================
  // FIX PARSING WAKTU (INI KUNCI)
  // =========================

  if (d.tanggal_pengumuman && d.jam_pengumuman) {

    const [day, monthText, year] = d.tanggal_pengumuman.split(" ");
    const month = bulanMap[monthText];

    const jamBersih = d.jam_pengumuman.replace("WITA", "").trim();
    const [hour, minute] = jamBersih.split(":").map(Number);

    waktuBuka = new Date(
      Number(year),
      month,
      Number(day),
      hour,
      minute,
      0
    ).getTime();
  }

});


// =========================
// CEK AKSES WAKTU
// =========================

function bolehAkses() {
  if (!waktuBuka) return false;
  return Date.now() >= waktuBuka;
}


// =========================
// FORMAT NOMOR
// =========================

function formatNomor(no) {
  return String(no || "").replace(/[^0-9]/g, "").trim();
}


// =========================
// CEK KELULUSAN
// =========================

openBtn.addEventListener("click", async () => {

  // 🔒 LOCK WAKTU
  if (!bolehAkses()) {
    showLockModal(); // modal dari file terpisah
    return;
  }

  const nomor = formatNomor(nomorInput.value);

  if (!nomor) {
    alert("Masukkan nomor ujian");
    return;
  }

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

    if (ditemukan) {

      const statusClass =
        (ditemukan.status || "")
          .toLowerCase()
          .includes("lulus")
          ? "status-lulus"
          : "status-tidak";

      let fotoSiswa = `${BASE_URL}image/default-user.png`;

      if (ditemukan.nis) {
        fotoSiswa = `${BASE_URL}image/siswa/${ditemukan.nis}.jpg`;
      }

      hasil.innerHTML = `
        <div class="hasil-card">

          <div class="hasil-top">

            <div class="hasil-foto">
              <img src="${fotoSiswa}"
                onerror="this.src='${BASE_URL}image/default-user.png'">
            </div>

            <div class="hasil-info">

              <h1>${ditemukan.nama || "-"}</h1>

              <div class="hasil-data">
                <div><span>NIS</span><b>${ditemukan.nis || "-"}</b></div>
                <div><span>NISN</span><b>${ditemukan.nisn || "-"}</b></div>
                <div><span>Kelas</span><b>${ditemukan.kelas || "-"}</b></div>
                <div><span>Gender</span><b>${ditemukan.gender || "-"}</b></div>
                <div><span>Nomor Ujian</span><b>${ditemukan.nomorUjian || "-"}</b></div>
              </div>

            </div>

          </div>

          <div class="hasil-status ${statusClass}">
            ${ditemukan.status || "-"}
          </div>

        </div>
      `;

    } else {

      hasil.innerHTML = `
        <div class="tidak-ditemukan">
          <i class="fas fa-circle-xmark"></i>
          <h2>Data Tidak Ditemukan</h2>
        </div>
      `;

    }

  } catch (err) {

    console.log(err);

    hasil.innerHTML = `
      <div class="tidak-ditemukan">
        <i class="fas fa-triangle-exclamation"></i>
        <h2>Gagal mengambil data</h2>
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


// =========================
// MODAL LOADER
// =========================

function loadModal() {

  fetch("./components/modal-lock.html")
    .then(res => res.text())
    .then(html => {

      document.getElementById("modal-container").innerHTML = html;

      initModal();

    });
}

function initModal() {

  const modalLock = document.getElementById("modalLock");
  const closeModalBtn = document.getElementById("closeModalLock");

  if (!modalLock || !closeModalBtn) return;

  window.showLockModal = function () {
    modalLock.style.display = "flex";
  };

  window.hideLockModal = function () {
    modalLock.style.display = "none";
  };

  closeModalBtn.addEventListener("click", hideLockModal);

  modalLock.addEventListener("click", (e) => {
    if (e.target === modalLock) hideLockModal();
  });
}


// =========================
// START
// =========================

window.addEventListener("DOMContentLoaded", loadModal);