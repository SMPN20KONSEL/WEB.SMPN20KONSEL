import { db } from "./firebase.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* ================= BASE URL ================= */

const BASE_URL =
window.location.hostname === "localhost"
  ? "./"
  : "/WEB.SMPN20KONSEL/";

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

      /* FOTO BERDASARKAN NIP */

      const foto =
      `${BASE_URL}image/guru/${data.nip}.jpg`;

      /* TEAM CARD */

      container.innerHTML += `

        <div class="team-card">

          <img
            src="${foto}"
            alt="${data.nama || '-'}"
            onerror="this.src='${BASE_URL}image/default.png'"
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