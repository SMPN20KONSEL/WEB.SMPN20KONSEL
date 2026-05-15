
import { db } from "./firebase.js";

import {
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const fotoKepala = document.getElementById("fotoKepala");
const nama = document.getElementById("nama");
const hp = document.getElementById("hp");

const docRef = doc(
  db,
  "jabatan",
  "wakil-kepala-sekolah-bidang-sarana-dan-prasarana"
);

onSnapshot(docRef, (docSnap) => {

  if(docSnap.exists()){

    const data = docSnap.data();

    fotoKepala.src =
      data.foto || "image/default.png";

    nama.textContent =
      data.nama || "-";

    hp.textContent =
      data.nohp || "-";

  } else {

    nama.textContent = "Data tidak ditemukan";

  }

});
