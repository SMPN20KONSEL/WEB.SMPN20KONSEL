import { db } from "./firebase.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


// =======================
// TOTAL SISWA
// =======================

onSnapshot(collection(db, "siswa"), (snap) => {
  document.getElementById("totalSiswa").textContent =
    snap.size;
});


// =======================
// TOTAL GURU
// =======================
onSnapshot(collection(db, "guru"), (snap) => {
  const total = snap.size;

  const elTop = document.getElementById("totalGuru");
  const elFooter = document.getElementById("totalGuruFooter");

  if (elTop) elTop.textContent = total;
  if (elFooter) elFooter.textContent = total;
});


// =======================
// NAVBAR MOBILE
// =======================

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

console.log("Website SMPN 20 Konsel berjalan");