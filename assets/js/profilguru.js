import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* ================= AOS ================= */

AOS.init({
  duration: 1000,
  once: true
});

/* ================= ELEMENT ================= */

const guruContainer = document.getElementById("guruContainer");

const totalGuru = document.getElementById("totalGuru");
const guruASN = document.getElementById("guruASN");
const guruP3KPW = document.getElementById("guruP3KPW");
const guruHonorer = document.getElementById("guruHonorer");

const searchInput = document.getElementById("searchInput");

/* ================= LOAD DATA ================= */

async function loadGuru() {

  guruContainer.innerHTML = `
    <h2 style="text-align:center;">Loading...</h2>
  `;

  try {

    const querySnapshot = await getDocs(collection(db, "guru"));

    guruContainer.innerHTML = "";

    totalGuru.innerHTML = querySnapshot.size;

    let asn = 0;
    let p3kpw = 0;
    let honorer = 0;

    querySnapshot.forEach((doc) => {

      const guru = doc.data();

      /* ================= HITUNG STATUS ================= */

      if (guru.statusKepegawaian === "ASN") {
        asn++;
      }

      if (
        guru.statusKepegawaian === "P3K" ||
        guru.statusKepegawaian === "PW"
      ) {
        p3kpw++;
      }

      if (guru.statusKepegawaian === "Honorer") {
        honorer++;
      }

      /* ================= CARD ================= */

      const foto = guru.foto || `image/guru/${guru.nip}.jpg`;

      guruContainer.innerHTML += `
  <div class="guru-card" data-aos="fade-up">

    <img 
      src="${guru.foto || `image/guru/${guru.nip}.jpg`}"
      onerror="this.src='image/guru/default.png'"
      alt="foto guru"
    >

    <div class="guru-info">

      <h3>${guru.nama || '-'}</h3>

      <p><i class="fa-solid fa-user-tie"></i> ${guru.jabatan || '-'}</p>

      <p><i class="fa-solid fa-book"></i> ${guru.mapel || '-'}</p>

      <p><i class="fa-solid fa-pray"></i> ${guru.agama || '-'}</p>

      <p><i class="fa-solid fa-envelope"></i> ${guru.email || '-'}</p>

    </div>

  </div>
`;
    });

    /* ================= UPDATE STATISTIK ================= */

    guruASN.innerHTML = asn;
    guruP3KPW.innerHTML = p3kpw;
    guruHonorer.innerHTML = honorer;

    AOS.refresh();

  } catch (error) {

    console.log(error);

    guruContainer.innerHTML = `
      <h2 style="color:red;text-align:center;">
        ${error.message}
      </h2>
    `;
  }
}

/* ================= SEARCH ================= */

searchInput.addEventListener("keyup", function () {

  const value = this.value.toLowerCase();

  const cards = document.querySelectorAll(".guru-card");

  cards.forEach(card => {

    card.style.display =
      card.textContent.toLowerCase().includes(value)
        ? "block"
        : "none";

  });

});

/* ================= RUN ================= */

loadGuru();