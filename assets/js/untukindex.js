import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


/* =========================
   ELEMENT
========================= */

const newsContainer =
document.getElementById("newsContainer");

const gallery =
document.getElementById("galleryContainer");


/* =========================
   RENDER BERITA INDEX (3 KOLOM)
========================= */

function renderBerita(data){

  newsContainer.innerHTML = "";

  if(data.length === 0){

    newsContainer.innerHTML = `
      <p style="text-align:center; grid-column:1/-1;">
        Belum ada berita
      </p>
    `;
    return;
  }

  const html = data.map((item)=>{

    const isi = Array.isArray(item.isi)
      ? item.isi[0] || ""
      : item.isi || "";

    return `
      <div class="berita-card" data-aos="fade-up">

        <div class="gambar-wrapper">

          <img
            src="${item.gambar1 || 'https://via.placeholder.com/600x400'}"
            alt="${item.judul || ''}"
            loading="lazy"
            onerror="this.src='https://via.placeholder.com/600x400?text=Berita'"
          />

          <span class="kategori">
            ${item.kategori || "BERITA"}
          </span>

        </div>

        <div class="berita-content">

          <h3>${item.judul || "-"}</h3>

          <p>
            ${isi.length > 120
              ? isi.substring(0, 120) + "..."
              : isi}
          </p>

          <a href="detail-berita.html?id=${item.id}" class="btn-baca">
            Baca Selengkapnya
          </a>

        </div>

      </div>
    `;

  }).join("");

  newsContainer.innerHTML = html;

  if(window.AOS){
    AOS.refresh();
  }
}


/* =========================
   LOAD BERITA (3 TERBARU)
========================= */

async function loadBerita(){

  newsContainer.innerHTML = `
    <p style="text-align:center; grid-column:1/-1;">
      Memuat berita...
    </p>
  `;

  try{

    const q = query(
      collection(db, "berita"),
      orderBy("createdAt", "desc"),
      limit(3) // 🔥 hanya 3 berita terbaru
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderBerita(data);

  }catch(error){

    console.log(error);

    newsContainer.innerHTML = `
      <p style="text-align:center; grid-column:1/-1;">
        Gagal memuat berita
      </p>
    `;
  }
}


/* =========================
   LOAD GALERI
========================= */

function loadGaleri(){

  if(!gallery) return;

  const photos = [

    "Gambar 1.jpg",
    "Gambar 2.jpg",
    "Gambar 3.jpg",
    "Gambar 4.jpg",
    "Gambar 5.jpg",

    "IMG-20250510-WA0005.jpg",
    "IMG-20250510-WA0006.jpg",
    "IMG-20250510-WA0007.jpg",

    "IMG-20250528-WA0005.jpg",

    "IMG-20250529-WA0002.jpg",
    "IMG-20250529-WA0004.jpg",
    "IMG-20250529-WA0005.jpg",
    "IMG-20250529-WA0006.jpg"

  ];

  for(let i = 1; i <= 20; i++){

    const number = String(i).padStart(4, "0");

    photos.push(`IMG-20250613-WA${number}.jpg`);
  }

  const fragment = document.createDocumentFragment();

  photos.forEach((photo)=>{

    const img = document.createElement("img");

    img.src = `Galeri/${photo}`;
    img.alt = "Kegiatan";
    img.loading = "lazy";

    img.setAttribute("data-aos", "zoom-in");

    img.onerror = function(){
      this.remove();
    };

    fragment.appendChild(img);

  });

  gallery.appendChild(fragment);
}


/* =========================
   INIT
========================= */

async function init(){

  await loadBerita();
  loadGaleri();

}

init();