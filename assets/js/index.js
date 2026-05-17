/* =========================================
   HERO SLIDER
========================================= */

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let currentSlide = 0;

/* =========================
   SHOW SLIDE
========================= */

function showSlide(index){

  slides.forEach(slide => {
    slide.classList.remove("active");
  });

  dots.forEach(dot => {
    dot.classList.remove("active");
  });

  slides[index].classList.add("active");
  dots[index].classList.add("active");

}

/* =========================
   NEXT
========================= */

function nextSlide(){

  currentSlide++;

  if(currentSlide >= slides.length){
    currentSlide = 0;
  }

  showSlide(currentSlide);

}

/* =========================
   PREV
========================= */

function prevSlide(){

  currentSlide--;

  if(currentSlide < 0){
    currentSlide = slides.length - 1;
  }

  showSlide(currentSlide);

}

/* =========================
   BUTTON EVENT
========================= */

nextBtn.addEventListener("click", nextSlide);

prevBtn.addEventListener("click", prevSlide);

/* =========================
   DOT CLICK
========================= */

dots.forEach((dot,index)=>{

  dot.addEventListener("click", ()=>{

    currentSlide = index;

    showSlide(currentSlide);

  });

});

/* =========================
   AUTO SLIDE
========================= */

setInterval(() => {

  nextSlide();

}, 5000);

/* =========================
   TOUCH SWIPE
========================= */

let startX = 0;
let endX = 0;

const slider = document.querySelector(".hero-slider");

slider.addEventListener("touchstart",(e)=>{

  startX = e.touches[0].clientX;

});

slider.addEventListener("touchend",(e)=>{

  endX = e.changedTouches[0].clientX;

  if(startX > endX + 50){

    nextSlide();

  }

  else if(startX < endX - 50){

    prevSlide();

  }

});

/* =========================================
   FIREBASE
========================================= */

import { db }
from "./firebase.js";

import {
  doc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* =========================================
   LOAD SPMB
========================================= */

async function loadPPDB(){

  try{

    const ref = doc(db,"website","ppdb");

    const snap = await getDoc(ref);

    /* =========================
       DATA TIDAK ADA
    ========================= */

    if(!snap.exists()){

      document.getElementById("spmbSection").style.display = "none";

      return;

    }

    const d = snap.data();

    /* =========================
       STATUS NONAKTIF
    ========================= */

    if(d.is_active !== true){

      document.getElementById("spmbSection").style.display = "none";

      return;

    }

    /* =========================
       TITLE
    ========================= */

    document.getElementById("spmbTitle").innerText =
    d.title || "-";

    /* =========================
       DESC
    ========================= */

    document.getElementById("spmbDesc").innerText =
    d.desc || "-";

    /* =========================
       TIMELINE
    ========================= */

    const jadwalBox =
    document.getElementById("jadwalBox");

    jadwalBox.innerHTML = "";

    if(d.timeline){

      d.timeline.forEach(item => {

        let icon = "fa-calendar-days";

        if(item.icon === "user"){
          icon = "fa-user-check";
        }

        if(item.icon === "bullhorn"){
          icon = "fa-bullhorn";
        }

        jadwalBox.innerHTML += `

          <div class="jadwal-item">

            <i class="fas ${icon}"></i>

            <div>

              <h3>${item.title}</h3>

              <p>${item.date}</p>

            </div>

          </div>

        `;

      });

    }

  }catch(err){

    console.error("PPDB Error:", err);

  }

}

loadPPDB();