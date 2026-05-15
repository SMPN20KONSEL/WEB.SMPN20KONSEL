import { db } from "./firebase.js";

import {
  doc,
  onSnapshot
}
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* =========================================
   ELEMENT HTML
========================================= */

const judulSekolah =
document.getElementById("judulSekolah");

const alamatHeader =
document.getElementById("alamatHeader");

const namaSekolahText =
document.getElementById("namaSekolahText");

const npsnText =
document.getElementById("npsnText");

const alamatText =
document.getElementById("alamatText");

const kodeposText =
document.getElementById("kodeposText");

const desaText =
document.getElementById("desaText");

const kecamatanText =
document.getElementById("kecamatanText");

const kabupatenText =
document.getElementById("kabupatenText");

const provinsiText =
document.getElementById("provinsiText");

const statusText =
document.getElementById("statusText");

const waktuText =
document.getElementById("waktuText");

const jenjangText =
document.getElementById("jenjangText");

const naunganText =
document.getElementById("naunganText");

const skPendirianText =
document.getElementById("skPendirianText");

const tglPendirianText =
document.getElementById("tglPendirianText");

const skOperasionalText =
document.getElementById("skOperasionalText");

const tglOperasionalText =
document.getElementById("tglOperasionalText");

const akreditasiText =
document.getElementById("akreditasiText");

const skAkreditasiText =
document.getElementById("skAkreditasiText");

const tglAkreditasiText =
document.getElementById("tglAkreditasiText");

const isoText =
document.getElementById("isoText");

const sejarahText =
document.getElementById("sejarahText");

const visiText =
document.getElementById("visiText");

const misiText =
document.getElementById("misiText");

const tujuanText =
document.getElementById("tujuanText");

/* =========================================
   HELPER
========================================= */

const setText = (el, value) => {
  if(el){
    el.textContent = value || "-";
  }
};

const setHTML = (el, value) => {
  if(el){
    el.innerHTML = value || "-";
  }
};

/* =========================================
   REALTIME PROFIL
========================================= */

function loadProfilRealtime(){

  const ref =
  doc(db, "website", "profil");

  onSnapshot(ref, (snap)=>{

    if(!snap.exists()){

      console.warn(
        "Data profil tidak ditemukan"
      );

      return;
    }

    const d = snap.data();

    /* ================= HEADER ================= */

    setText(judulSekolah, d.nama);

    setText(
      alamatHeader,
      `${d.alamat || "-"}, ${d.kecamatan || ""}, ${d.kabupaten || ""}`
    );

    /* ================= IDENTITAS ================= */

    setText(namaSekolahText, d.nama);
    setText(npsnText, d.npsn);
    setText(alamatText, d.alamat);
    setText(kodeposText, d.kodepos);
    setText(desaText, d.desa);
    setText(kecamatanText, d.kecamatan);
    setText(kabupatenText, d.kabupaten);
    setText(provinsiText, d.provinsi);
    setText(statusText, d.status);
    setText(waktuText, d.waktu);
    setText(jenjangText, d.jenjang);

    /* ================= DOKUMEN ================= */

    setText(naunganText, d.naungan);
    setText(skPendirianText, d.sk_pendirian);
    setText(tglPendirianText, d.tgl_pendirian);
    setText(skOperasionalText, d.sk_operasional);
    setText(tglOperasionalText, d.tgl_operasional);
    setText(akreditasiText, d.akreditasi);
    setText(skAkreditasiText, d.sk_akreditasi);
    setText(tglAkreditasiText, d.tgl_akreditasi);
    setText(isoText, d.iso);

    /* ================= SEJARAH ================= */

    setHTML(
      sejarahText,
      (d.sejarah || "-")
      .replace(/\n/g,"<br><br>")
    );

    /* ================= VISI ================= */

    setHTML(
      visiText,
      `
      <div class="visi-box">
        <i class="fas fa-bullseye"></i>
        <span>${d.visi || "-"}</span>
      </div>
      `
    );

    /* ================= MISI ================= */

    const misiList =
    (d.misi || "")
    .split("\n")
    .filter(item => item.trim() !== "")
    .map(item => `
      <li>
        <i class="fas fa-check-circle"></i>
        ${item}
      </li>
    `)
    .join("");

    setHTML(
      misiText,
      `<ul class="misi-list">${misiList}</ul>`
    );

    /* ================= TUJUAN ================= */

    setHTML(
      tujuanText,
      (d.tujuan || "-")
      .replace(/\n/g,"<br><br>")
    );

    console.log(
      "Realtime profil aktif"
    );

  }, (err)=>{

    console.error(
      "Gagal realtime profil:",
      err
    );

  });

}

/* =========================================
   LOAD
========================================= */

loadProfilRealtime();