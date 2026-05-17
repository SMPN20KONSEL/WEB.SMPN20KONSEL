
import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


/* =========================
   EFEK HOVER CARD
========================= */
const cardHover =
document.querySelectorAll(".ekskul-card");

cardHover.forEach((card) => {

  card.addEventListener("mousemove", (e) => {

    const rect =
    card.getBoundingClientRect();

    const x =
    e.clientX - rect.left;

    const y =
    e.clientY - rect.top;

    card.style.background = `
      radial-gradient(
        circle at ${x}px ${y}px,
        rgba(0,180,255,.15),
        white 40%
      )
    `;

  });

  card.addEventListener("mouseleave", () => {

    card.style.background = "#fff";

  });

});


/* =========================
   SLIDER EKSKUL
========================= */
const track =
document.getElementById("ekskulTrack");

const cards =
document.querySelectorAll(".ekskul-card");

const nextBtn =
document.getElementById("nextBtn");

const prevBtn =
document.getElementById("prevBtn");

const dotsContainer =
document.getElementById("dots");

let index = 0;


/* =========================
   CEK CARD TAMPIL
========================= */
function getVisibleCards() {

  if (window.innerWidth <= 768) {
    return 1;
  }

  if (window.innerWidth <= 1100) {
    return 2;
  }

  return 4;

}


/* =========================
   BUAT DOTS
========================= */
function createDots() {

  dotsContainer.innerHTML = "";

  const visible =
  getVisibleCards();

  const totalSlides =
  cards.length - visible + 1;

  for (let i = 0; i < totalSlides; i++) {

    const dot =
    document.createElement("span");

    if (i === index) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => {

      index = i;

      updateSlider();

    });

    dotsContainer.appendChild(dot);

  }

}


/* =========================
   UPDATE SLIDER
========================= */
function updateSlider() {

  if (!cards.length) return;

  const gap = 25;

  const cardWidth =
  cards[0].offsetWidth + gap;

  track.style.transform =
  `translateX(-${index * cardWidth}px)`;

  const dots =
  document.querySelectorAll(".slider-dots span");

  dots.forEach((dot) => {

    dot.classList.remove("active");

  });

  if (dots[index]) {

    dots[index].classList.add("active");

  }

}


/* =========================
   BUTTON NEXT
========================= */
nextBtn?.addEventListener("click", () => {

  const visible =
  getVisibleCards();

  const maxIndex =
  cards.length - visible;

  if (index < maxIndex) {

    index++;

    updateSlider();

  }

});


/* =========================
   BUTTON PREV
========================= */
prevBtn?.addEventListener("click", () => {

  if (index > 0) {

    index--;

    updateSlider();

  }

});


/* =========================
   RESIZE
========================= */
window.addEventListener("resize", () => {

  index = 0;

  createDots();

  updateSlider();

});


/* =========================
   START SLIDER
========================= */
createDots();

updateSlider();


/* =========================
   TOTAL SISWA
========================= */
const jumlahSiswa =
document.getElementById("jumlahSiswa");

onSnapshot(
  collection(db, "siswa"),
  (snapshot) => {

    const totalSiswa =
    snapshot.size;

    jumlahSiswa.innerHTML =
    totalSiswa + "+";

  }
);


/* =========================
   ELEMENT PENGURUS
========================= */

/* Ketua */
const ketuaNama =
document.getElementById("ketuaNama");

const ketuaKelas =
document.getElementById("ketuaKelas");

const ketuaFoto =
document.getElementById("ketuaFoto");

/* Wakil */
const wakilNama =
document.getElementById("wakilNama");

const wakilKelas =
document.getElementById("wakilKelas");

const wakilFoto =
document.getElementById("wakilFoto");

/* Sekretaris */
const sekretarisNama =
document.getElementById("sekretarisNama");

const sekretarisKelas =
document.getElementById("sekretarisKelas");

const sekretarisFoto =
document.getElementById("sekretarisFoto");

/* Bendahara */
const bendaharaNama =
document.getElementById("bendaharaNama");

const bendaharaKelas =
document.getElementById("bendaharaKelas");

const bendaharaFoto =
document.getElementById("bendaharaFoto");

/* Total Bidang */
const totalBidang =
document.getElementById("totalBidang");

/* Masa Jabatan */
const masaJabatan =
document.getElementById("masaJabatan");


/* =========================
   SET DATA KOSONG
========================= */
function setKosong(nama, kelas, foto) {

  nama.innerText = "-";

  kelas.innerText = "-";

  foto.src = "image/siswa/user.png";

}


/* =========================
   LOAD DATA PENGURUS
========================= */
async function loadPengurus(
  docName,
  namaEl,
  kelasEl,
  fotoEl,
  isKetua = false
) {

  try {

    const snap =
    await getDoc(
      doc(db, "pengurus_osis", docName)
    );

    if (snap.exists()) {

      const d =
      snap.data();

      namaEl.innerText =
      d.nama || "-";

      kelasEl.innerText =
      d.kelas || "-";

      fotoEl.src =
      d.nis
      ? `image/siswa/${d.nis}.jpg`
      : "image/siswa/user.png";

      /* khusus ketua */
      if (isKetua) {

        masaJabatan.innerText =
        d.periode || "-";

      }

    } else {

      setKosong(
        namaEl,
        kelasEl,
        fotoEl
      );

    }

  } catch (err) {

    console.log(err);

    setKosong(
      namaEl,
      kelasEl,
      fotoEl
    );

  }

}


/* =========================
   LOAD TOTAL BIDANG
========================= */
async function loadBidangKerja() {

  try {

    const snap =
    await getDocs(
      collection(db, "pengurus_osis")
    );

    let total = 0;

    snap.forEach((docu) => {

      const d =
      docu.data();

      if (d.jabatan === "Bidang Kerja") {

        total++;

      }

    });

    totalBidang.innerText =
    total > 0
    ? total + " Siswa"
    : "-";

  } catch (err) {

    console.log(err);

    totalBidang.innerText = "-";

  }

}


/* =========================
   DEFAULT PERIODE
========================= */
masaJabatan.innerText = "-";


/* =========================
   JALANKAN SEMUA
========================= */
loadPengurus(
  "ketua_osis",
  ketuaNama,
  ketuaKelas,
  ketuaFoto,
  true
);

loadPengurus(
  "wakil_ketua",
  wakilNama,
  wakilKelas,
  wakilFoto
);

loadPengurus(
  "sekretaris",
  sekretarisNama,
  sekretarisKelas,
  sekretarisFoto
);

loadPengurus(
  "bendahara",
  bendaharaNama,
  bendaharaKelas,
  bendaharaFoto
);

loadBidangKerja();
