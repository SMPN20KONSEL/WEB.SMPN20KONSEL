/* =========================================================
   INDEX.JS
   1. Hero slider (tombol, dots, auto-slide, swipe)
   2. Load data SPMB dari Firebase (import dinamis, supaya
      kalau Firebase gagal dimuat, slider tetap jalan)
========================================================= */

/* =========================================================
   HERO SLIDER
========================================================= */

const slider   = document.querySelector(".hero-slider");
const slides   = document.querySelectorAll(".slide");
const dots     = document.querySelectorAll(".dot");
const nextBtn  = document.querySelector(".next");
const prevBtn  = document.querySelector(".prev");

const AUTO_DELAY = 5000;

let currentSlide = 0;
let timer = null;

/* ---------- Tampilkan slide ---------- */

function showSlide(index){

  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  if(slides[index]) slides[index].classList.add("active");
  if(dots[index]) dots[index].classList.add("active");

}

/* ---------- Auto slide (bisa di-restart) ---------- */

function startAuto(){
  stopAuto();
  if(slides.length > 1){
    timer = setInterval(nextSlide, AUTO_DELAY);
  }
}

function stopAuto(){
  if(timer){
    clearInterval(timer);
    timer = null;
  }
}

/* ---------- Next / Prev ---------- */

function nextSlide(){
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide(){
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

/* ---------- Event: tombol ---------- */

if(slides.length){

  if(nextBtn){
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAuto();
    });
  }

  if(prevBtn){
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAuto();
    });
  }

  /* ---------- Event: dots ---------- */

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
      startAuto();
    });
  });

  /* ---------- Swipe (sentuh) ---------- */

  if(slider){

    let startX = 0;
    let startY = 0;

    slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive:true });

    slider.addEventListener("touchend", (e) => {

      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      // hanya dianggap swipe kalau gerakan horizontal dominan
      if(Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)){
        if(dx < 0){
          nextSlide();
        }else{
          prevSlide();
        }
        startAuto();
      }

    }, { passive:true });

  }

  /* ---------- Hemat baterai: berhenti saat tab tidak aktif ---------- */

  document.addEventListener("visibilitychange", () => {
    if(document.hidden){
      stopAuto();
    }else{
      startAuto();
    }
  });

  showSlide(currentSlide);
  startAuto();

}

/* =========================================================
   LOAD SPMB (FIREBASE)
========================================================= */

function hideSpmb(){
  const section = document.getElementById("spmbSection");
  if(section) section.style.display = "none";
}

async function loadPPDB(){

  try{

    const { db } = await import("./firebase.js");

    const { doc, getDoc } = await import(
      "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js"
    );

    const snap = await getDoc(doc(db, "website", "ppdb"));

    /* ---------- Data tidak ada ---------- */

    if(!snap.exists()){
      hideSpmb();
      return;
    }

    const d = snap.data();

    /* ---------- Status nonaktif ---------- */

    if(d.is_active !== true){
      hideSpmb();
      return;
    }

    /* ---------- Judul & deskripsi ---------- */

    const titleEl = document.getElementById("spmbTitle");
    const descEl  = document.getElementById("spmbDesc");

    if(titleEl) titleEl.textContent = d.title || "-";
    if(descEl)  descEl.textContent  = d.desc  || "-";

    /* ---------- Timeline ---------- */

    const jadwalBox = document.getElementById("jadwalBox");
    if(!jadwalBox) return;

    jadwalBox.textContent = "";

    if(Array.isArray(d.timeline)){

      const ICONS = {
        user: "fa-user-check",
        bullhorn: "fa-bullhorn"
      };

      d.timeline.forEach(item => {

        const iconClass = ICONS[item.icon] || "fa-calendar-days";

        const wrap = document.createElement("div");
        wrap.className = "jadwal-item";

        const icon = document.createElement("i");
        icon.className = "fas " + iconClass;

        const text = document.createElement("div");

        const h3 = document.createElement("h3");
        h3.textContent = item.title || "";

        const p = document.createElement("p");
        p.textContent = item.date || "";

        text.append(h3, p);
        wrap.append(icon, text);
        jadwalBox.appendChild(wrap);

      });

    }

  }catch(err){

    console.error("PPDB Error:", err);

  }

}

loadPPDB();