import { db } from "./firebase.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* ================= TEAM ================= */

const container =
document.getElementById("teamContainer");

/* ================= KONTAK ================= */

const kontakHumas =
document.getElementById("kontakHumas");

/* ================= REALTIME ================= */

onSnapshot(

  collection(db, "jabatan"),

  (snap) => {

    container.innerHTML = "";

    snap.forEach((docSnap) => {

      const data =
      docSnap.data();

      /* HANYA HUMAS */

      if(
        data.judul?.toLowerCase() !==
        "wakil kepala sekolah bidang humas"
      ){
        return;
      }

      /* FOTO DEFAULT */

      const foto =
        data.foto ||
        "image/default.png";

      /* TEAM CARD */

      container.innerHTML += `

        <div class="team-card">

          <img
            src="${foto}"
            alt="${data.nama}"
            onerror="this.src='image/default.png'"
          >

          <h3>
            ${data.nama || "-"}
          </h3>

          <p>
            ${data.jabatan || "-"}
          </p>

        </div>

      `;

      /* KONTAK HUMAS */

      if(kontakHumas){

        kontakHumas.innerHTML = `

          <i class="fas fa-phone"></i>
          ${data.nohp || "-"}

        `;

      }

    });

  }

);