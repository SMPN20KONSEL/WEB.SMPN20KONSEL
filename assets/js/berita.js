/* =========================
   IMPORT FIREBASE
========================= */

import { db }
from "./firebase.js";

import {

  collection,
  getDocs,
  query,
  orderBy

}
from
"https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* =========================
   ELEMENT
========================= */

const newsContainer =
document.getElementById(
  "newsContainer"
);

const searchInput =
document.getElementById(
  "searchInput"
);

const gallery =
document.getElementById(
  "galleryContainer"
);

/* =========================
   DATA BERITA
========================= */

let semuaBerita = [];

/* =========================
   DARK MODE
========================= */

function toggleMode(){

  document.body.classList.toggle(
    "light"
  );

}

/* =========================
   FORMAT TANGGAL
========================= */

function formatTanggal(tanggal){

  if(!tanggal) return "-";

  return new Date(tanggal)
  .toLocaleDateString(
    "id-ID",
    {

      day:"numeric",
      month:"long",
      year:"numeric"

    }
  );

}

/* =========================
   POTONG TEXT
========================= */

function potongText(
  text,
  panjang = 150
){

  if(!text) return "-";

  return text.length > panjang

  ? text.substring(0, panjang) + "..."

  : text;

}

/* =========================
   RENDER BERITA
========================= */

function renderBerita(dataBerita){

  newsContainer.innerHTML = "";

  if(dataBerita.length === 0){

    newsContainer.innerHTML = `

      <p class="empty-news">

        Berita tidak ditemukan

      </p>

    `;

    return;

  }

  const html =
  dataBerita.map((data)=>{

    /*
      ambil paragraf pertama
    */

    let isiPendek = "";

    if(
      Array.isArray(data.isi)
    ){

      isiPendek =
      data.isi[0] || "";

    }else{

      isiPendek =
      data.isi || "";

    }

    return `

      <div
      class="news-card"
      data-aos="fade-up">

        <!-- IMAGE -->

        <div class="news-image">

          <div class="news-category">

            ${data.kategori || "Berita"}

          </div>

          <img

          src="${data.gambar1 || ''}"

          loading="lazy"

          onerror="
          this.src='https://via.placeholder.com/600x400?text=Berita'
          ">

        </div>

        <!-- CONTENT -->

        <div class="news-content">

          <h3>

            ${data.judul || "-"}

          </h3>

          <p>

            ${potongText(
              isiPendek,
              150
            )}

          </p>

          <a href="
          detail-berita.html?id=${data.id}
          ">

            Baca Selengkapnya

          </a>

        </div>

      </div>

    `;

  }).join("");

  newsContainer.innerHTML = html;

  /* REFRESH AOS */

  if(window.AOS){

    AOS.refresh();

  }

}

/* =========================
   LOAD BERITA
========================= */

async function loadBerita(){

  newsContainer.innerHTML = `

    <p class="loading-news">

      Memuat berita...

    </p>

  `;

  try{

    const q = query(

      collection(
        db,
        "berita"
      ),

      orderBy(
        "createdAt",
        "desc"
      )

    );

    const snapshot =
    await getDocs(q);

    semuaBerita =
    snapshot.docs.map((doc)=>({

      id:doc.id,

      ...doc.data()

    }));

    renderBerita(
      semuaBerita
    );

  }catch(error){

    console.log(error);

    newsContainer.innerHTML = `

      <p class="error-news">

        Gagal memuat berita

      </p>

    `;

  }

}

/* =========================
   SEARCH BERITA
========================= */

if(searchInput){

  searchInput.addEventListener(

    "input",

    ()=>{

      const keyword =
      searchInput.value
      .toLowerCase();

      const hasil =
      semuaBerita.filter((item)=>{

        return (

          item.judul
          ?.toLowerCase()
          .includes(keyword)

          ||

          item.isi
          ?.toLowerCase()
          .includes(keyword)

          ||

          item.kategori
          ?.toLowerCase()
          .includes(keyword)

        );

      });

      renderBerita(hasil);

    }

  );

}

/* =========================
   FILTER KATEGORI
========================= */

const filterButtons =
document.querySelectorAll(
  ".filter-btn"
);

filterButtons.forEach((btn)=>{

  btn.addEventListener(

    "click",

    ()=>{

      filterButtons.forEach((b)=>{

        b.classList.remove(
          "active"
        );

      });

      btn.classList.add(
        "active"
      );

      const kategori =
      btn.innerText
      .toLowerCase();

      if(kategori === "semua"){

        renderBerita(
  semuaBerita.slice(0,6)
);

        return;

      }

      const hasil =
      semuaBerita.filter((item)=>{

        return item.kategori
        ?.toLowerCase()
        .includes(kategori);

      });

      renderBerita(hasil);

    }

  );

});

/* =========================
   LOAD GALERI
========================= */

function loadGaleri(){

  if(!gallery) return;

  /* FOTO MANUAL */

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

  /* FOTO OTOMATIS */

  for(let i = 1; i <= 84; i++){

    const number =
    String(i).padStart(
      4,
      "0"
    );

    photos.push(

      `IMG-20250613-WA${number}.jpg`

    );

  }

  const fragment =
  document.createDocumentFragment();

  photos.forEach((photo)=>{

    const img =
    document.createElement("img");

    img.src =
    `Galeri/${photo}`;

    img.alt =
    "Kegiatan";

    img.loading =
    "lazy";

    img.setAttribute(
      "data-aos",
      "zoom-in"
    );

    /* jika gambar tidak ada */

    img.onerror = function(){

      this.remove();

    };

    fragment.appendChild(img);

  });

  gallery.appendChild(
    fragment
  );

}

/* =========================
   BREAKING NEWS
========================= */

function autoBreakingNews(){

  const breakingTrack =
  document.querySelector(
    ".breaking-track"
  );

  if(
    !breakingTrack ||
    semuaBerita.length === 0
  ) return;

  breakingTrack.innerHTML =

  "🔥 Breaking News : " +

  semuaBerita
  .map((item)=>item.judul)
  .join(" • ");

}

/* =========================
   INIT
========================= */

async function init(){

  await loadBerita();

  loadGaleri();

  autoBreakingNews();

}

init();