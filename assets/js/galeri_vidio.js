/* =========================
   IMPORT FIREBASE
========================= */
import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


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
   AMBIL YOUTUBE ID
========================= */
function getYoutubeId(url) {

  try {

    const parsed = new URL(url);

    const hostname =
      parsed.hostname.toLowerCase();

    const pathname =
      parsed.pathname;


    /* =========================
       youtu.be/VIDEO_ID
    ========================== */
    if (
      hostname === "youtu.be" ||
      hostname === "www.youtu.be"
    ) {

      return pathname
        .replace(/^\/+/, "")
        .split("/")[0]
        .split("?")[0];

    }


    /* =========================
       youtube.com/shorts/VIDEO_ID
    ========================== */
    if (
      pathname.startsWith("/shorts/")
    ) {

      return pathname
        .split("/")[2]
        ?.split("?")[0]
        ?.split("/")[0] || null;

    }


    /* =========================
       youtube.com/watch?v=VIDEO_ID
    ========================== */
    if (
      pathname === "/watch"
    ) {

      return parsed.searchParams.get("v");

    }


    /* =========================
       youtube.com/embed/VIDEO_ID
    ========================== */
    if (
      pathname.startsWith("/embed/")
    ) {

      return pathname
        .split("/")[2]
        ?.split("?")[0]
        ?.split("/")[0] || null;

    }


    /* =========================
       youtube.com/live/VIDEO_ID
    ========================== */
    if (
      pathname.startsWith("/live/")
    ) {

      return pathname
        .split("/")[2]
        ?.split("?")[0]
        ?.split("/")[0] || null;

    }


    return null;

  } catch (error) {

    console.error(
      "Gagal membaca URL YouTube:",
      error
    );

    return null;

  }

}


/* =========================
   UBAH LINK MENJADI EMBED
========================= */
function convertYoutube(url) {

  const youtubeId =
    getYoutubeId(url);

  if (!youtubeId) {

    return url;

  }

  return (
    `https://www.youtube.com/embed/${youtubeId}`
  );

}


/* =========================
   BUAT URL THUMBNAIL
========================= */
function getYoutubeThumbnail(url) {

  const youtubeId =
    getYoutubeId(url);

  if (!youtubeId) {

    return "";

  }

  return (
    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
  );

}


/* =========================
   VALIDASI LINK YOUTUBE
========================= */
function isYoutubeUrl(url) {

  return !!getYoutubeId(url);

}


/* =========================
   SIMPAN VIDEO
========================= */
btnSimpan.addEventListener(
  "click",
  async () => {

    const judul =
      judulVideo.value.trim();

    const link =
      linkVideo.value.trim();

    const deskripsi =
      deskripsiVideo.value.trim();


    /* =========================
       VALIDASI DATA
    ========================== */

    if (!judul || !link) {

      alert(
        "Lengkapi judul dan link video."
      );

      return;

    }


    /* =========================
       VALIDASI YOUTUBE
    ========================== */

    if (!isYoutubeUrl(link)) {

      alert(
        "Link YouTube tidak valid.\n\n" +
        "Gunakan salah satu format:\n" +
        "https://www.youtube.com/watch?v=ID\n" +
        "https://youtu.be/ID\n" +
        "https://www.youtube.com/shorts/ID"
      );

      return;

    }


    try {

      /* =========================
         DATA YOUTUBE
      ========================== */

      const youtubeId =
        getYoutubeId(link);

      const embedUrl =
        convertYoutube(link);

      const thumbnail =
        getYoutubeThumbnail(link);


      /* =========================
         SIMPAN FIRESTORE
      ========================== */

      await addDoc(

        collection(
          db,
          "video_sekolah"
        ),

        {

          judul:
            judul,

          link:
            embedUrl,

          thumbnail:
            thumbnail,

          youtubeId:
            youtubeId,

          deskripsi:
            deskripsi,

          type:
            "youtube",

          createdAt:
            Date.now()

        }

      );


      /* =========================
         BERHASIL
      ========================== */

      alert(
        "Video berhasil disimpan."
      );


      /* =========================
         KOSONGKAN FORM
      ========================== */

      judulVideo.value = "";

      linkVideo.value = "";

      deskripsiVideo.value = "";


      /* =========================
         MUAT ULANG DATA
      ========================== */

      loadVideo();


    } catch (error) {

      console.error(
        "Gagal menyimpan video:",
        error
      );

      alert(
        "Gagal menyimpan video.\n" +
        "Periksa koneksi dan Firebase."
      );

    }

  }
);


/* =========================
   LOAD VIDEO
========================= */
async function loadVideo() {

  tbodyVideo.innerHTML = "";

  try {

    const snap =
      await getDocs(
        collection(
          db,
          "video_sekolah"
        )
      );


    let no = 1;


    snap.forEach(
      (docu) => {

        const d =
          docu.data();


        /*
         * Data lama mungkin memakai
         * "tipe", sedangkan data baru
         * memakai "type".
         *
         * Kita baca keduanya agar
         * data lama tidak rusak.
         */

        const videoType =
          d.type ||
          d.tipe ||
          "youtube";


        tbodyVideo.innerHTML += `

          <tr>

            <td>
              ${no++}
            </td>

            <td>
              ${escapeHtml(
                d.judul || "-"
              )}
            </td>

            <td>

              <a
                href="${escapeAttribute(
                  d.link || "#"
                )}"
                target="_blank"
                rel="noopener noreferrer"
                class="link-video"
              >

                Lihat Video

              </a>

            </td>

            <td>

              <button
                class="btn-hapus"
                onclick="hapusVideo('${docu.id}')"
              >

                <i
                  class="fa-solid fa-trash"
                ></i>

                Hapus

              </button>

            </td>

          </tr>

        `;

      }
    );


  } catch (error) {

    console.error(
      "Gagal memuat video:",
      error
    );

    tbodyVideo.innerHTML = `

      <tr>

        <td
          colspan="4"
          style="text-align:center;"
        >

          Gagal memuat data video.

        </td>

      </tr>

    `;

  }

}


/* =========================
   HAPUS VIDEO
========================= */
window.hapusVideo =
async (id) => {

  const yakin =
    confirm(
      "Hapus video ini?"
    );


  if (!yakin) {

    return;

  }


  try {

    await deleteDoc(
      doc(
        db,
        "video_sekolah",
        id
      )
    );


    alert(
      "Video berhasil dihapus."
    );


    loadVideo();


  } catch (error) {

    console.error(
      "Gagal menghapus video:",
      error
    );

    alert(
      "Gagal menghapus video."
    );

  }

};


/* =========================
   ESCAPE HTML
   Mencegah judul/deskripsi
   merusak tabel HTML
========================= */
function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================
   ESCAPE ATTRIBUTE
========================= */
function escapeAttribute(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

}


/* =========================
   START
========================= */
loadVideo();
