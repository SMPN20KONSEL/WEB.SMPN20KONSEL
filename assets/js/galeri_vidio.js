/* =========================
   IMPORT FIREBASE
========================= */
import { db }
from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
}
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


/* =========================
   ELEMENT
========================= */
const judulVideo =
document.getElementById("judulVideo");

const linkVideo =
document.getElementById("linkVideo");

const deskripsiVideo =
document.getElementById("deskripsiVideo");

const btnSimpan =
document.getElementById("btnSimpan");

const tbodyVideo =
document.getElementById("tbodyVideo");


/* =========================
   UBAH LINK YOUTUBE
========================= */
function convertYoutube(url){

  try{

    /* SHORT LINK */
    if(url.includes("youtu.be/")){

      const id =
      url.split("youtu.be/")[1];

      return `
      https://www.youtube.com/embed/${id}
      `;

    }

    /* LINK BIASA */
    if(url.includes("watch?v=")){

      const id =
      url.split("watch?v=")[1]
      .split("&")[0];

      return `
      https://www.youtube.com/embed/${id}
      `;

    }

    return url;

  }catch{

    return url;

  }

}


/* =========================
   SIMPAN VIDEO
========================= */
btnSimpan.addEventListener("click", async()=>{

  const judul =
  judulVideo.value.trim();

  const link =
  linkVideo.value.trim();

  const deskripsi =
  deskripsiVideo.value.trim();

  if(!judul || !link){

    alert("Lengkapi data");

    return;

  }

  try{

    await addDoc(

      collection(db,"video_sekolah"),

      {
        judul: judul,

        link:
        convertYoutube(link),

        deskripsi: deskripsi,

        tipe: "youtube",

        createdAt:
        Date.now()
      }

    );

    alert("Video berhasil disimpan");

    judulVideo.value = "";
    linkVideo.value = "";
    deskripsiVideo.value = "";

    loadVideo();

  }catch(err){

    console.log(err);

    alert("Gagal simpan");

  }

});


/* =========================
   LOAD VIDEO
========================= */
async function loadVideo(){

  tbodyVideo.innerHTML = "";

  const snap =
  await getDocs(
    collection(db,"video_sekolah")
  );

  let no = 1;

  snap.forEach((docu)=>{

    const d =
    docu.data();

    tbodyVideo.innerHTML += `
      <tr>

        <td>${no++}</td>

        <td>${d.judul}</td>

        <td>
          <a
            href="${d.link}"
            target="_blank"
            class="link-video">

            Lihat Video

          </a>
        </td>

        <td>

          <button
            class="btn-hapus"
            onclick="hapusVideo('${docu.id}')">

            <i class="fa-solid fa-trash"></i>
            Hapus

          </button>

        </td>

      </tr>
    `;

  });

}


/* =========================
   HAPUS VIDEO
========================= */
window.hapusVideo =
async(id)=>{

  const yakin =
  confirm("Hapus video?");

  if(!yakin) return;

  try{

    await deleteDoc(
      doc(db,"video_sekolah",id)
    );

    loadVideo();

  }catch(err){

    console.log(err);

  }

};


/* =========================
   START
========================= */
loadVideo();