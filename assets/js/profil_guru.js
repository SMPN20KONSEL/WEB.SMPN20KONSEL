
import { db }
from "./firebase.js";
import {
  getFirestore,
  collection,
  getDocs
}
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* ================= CONFIG FIREBASE ================= */

/* ================= ELEMENT ================= */

const guruContainer =
document.getElementById("guruContainer");

const totalGuru =
document.getElementById("totalGuru");

const guruASN =
document.getElementById("guruASN");

const guruP3KPW =
document.getElementById("guruP3KPW");

const guruHonorer =
document.getElementById("guruHonorer");

const searchInput =
document.getElementById("searchInput");

/* ================= LOAD DATA ================= */

async function loadGuru() {

  guruContainer.innerHTML = `
    <h2 style="text-align:center;">
      Memuat data...
    </h2>
  `;

  try {

    console.log("Ambil data guru...");

    const snapshot =
    await getDocs(
      collection(db, "guru")
    );

    console.log(
      "Jumlah data:",
      snapshot.size
    );

    guruContainer.innerHTML = "";

    totalGuru.innerHTML =
    snapshot.size;

    let asn = 0;
    let p3kpw = 0;
    let honorer = 0;

    snapshot.forEach((doc) => {

      const guru =
      doc.data();

      console.log(guru);

      /* ================= STATUS ================= */

      const status =
      (guru.statusKepegawaian || "")
      .toUpperCase();

      if (status === "ASN") {
        asn++;
      }

      if (
        status === "P3K" ||
        status === "PW"
      ) {
        p3kpw++;
      }

      if (
        status === "HONORER"
      ) {
        honorer++;
      }

      /* ================= FOTO ================= */

      const foto =
      guru.foto ||
      "image/guru/user.png";

      /* ================= CARD ================= */

      guruContainer.innerHTML += `

        <div class="guru-card">

          <img
           <img 
  src="${guru.foto || `image/guru/${guru.nip.trim()}.jpg`}"
  onerror="this.onerror=null;this.src='image/guru/user.png'"
  alt="foto guru"
>
          <div class="guru-info">

            <h3>
              ${guru.nama || "-"}
            </h3>

            <p>
              <i class="fa-solid fa-book"></i>
              ${guru.mapel || "-"}
            </p>

            <p>
              <i class="fa-solid fa-user-tie"></i>
              ${guru.jabatan || "-"}
            </p>

            <p>
              <i class="fa-solid fa-id-card"></i>
              ${guru.nip || "-"}
            </p>

            <p>
              <i class="fa-solid fa-briefcase"></i>
              ${guru.statusKepegawaian || "-"}
            </p>

          </div>

        </div>

      `;
    });

    /* ================= UPDATE STAT ================= */

    guruASN.innerHTML =
    asn;

    guruP3KPW.innerHTML =
    p3kpw;

    guruHonorer.innerHTML =
    honorer;

  } catch (err) {

    console.error(err);

    guruContainer.innerHTML = `

      <h2 style="
        color:red;
        text-align:center;
      ">
        ${err.message}
      </h2>

    `;
  }
}

/* ================= SEARCH ================= */

searchInput.addEventListener(
  "keyup",
  function () {

    const value =
    this.value.toLowerCase();

    const cards =
    document.querySelectorAll(
      ".guru-card"
    );

    cards.forEach((card) => {

      const text =
      card.textContent
      .toLowerCase();

      if (
        text.includes(value)
      ) {

        card.style.display =
        "block";

      } else {

        card.style.display =
        "none";

      }
    });
  }
);

/* ================= RUN ================= */

loadGuru();
