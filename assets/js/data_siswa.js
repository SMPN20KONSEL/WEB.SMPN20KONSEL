import { db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* ================= ELEMENT ================= */
const dataSiswa = document.getElementById("dataSiswa");
const dataAlumni = document.getElementById("dataAlumni");

const totalSiswaStat = document.getElementById("totalSiswa");
const totalLaki = document.getElementById("siswaL");
const totalPerempuan = document.getElementById("siswaP");

const totalAlumni = document.getElementById("totalAlumni");
const alumniL = document.getElementById("alumniL");
const alumniP = document.getElementById("alumniP");

const filterKelas = document.getElementById("filterKelas");
const filterTahun = document.getElementById("filterTahun");

/* ================= GLOBAL DATA ================= */
let semuaData = [];
let semuaAlumni = [];

/* ================= FILTER STATE ================= */
let filterState = {
  kelas: "",
  tahun: ""
};

/* ================= NORMALISASI GENDER ================= */
function normalizeGender(g){
  const gender = String(g || "").toLowerCase().trim();

  if(["l","lk","laki-laki","laki laki"].includes(gender)) return "L";
  if(["p","pr","perempuan"].includes(gender)) return "P";

  return "-";
}

/* ================= STAT SISWA ================= */
function updateStatistikSiswa(data){
  let l = 0, p = 0;

  data.forEach(s => {
    const g = normalizeGender(s.gender);
    if(g === "L") l++;
    if(g === "P") p++;
  });

  totalSiswaStat.textContent = data.length;
  totalLaki.textContent = l;
  totalPerempuan.textContent = p;
}

/* ================= STAT ALUMNI ================= */
function updateStatistikAlumni(data){
  let l = 0, p = 0;

  data.forEach(a => {
    const g = normalizeGender(a.gender);
    if(g === "L") l++;
    if(g === "P") p++;
  });

  totalAlumni.textContent = data.length;
  alumniL.textContent = l;
  alumniP.textContent = p;
}

/* ================= FILTER FUNCTION ================= */
function applyFilter(){

  const siswaFiltered = semuaData.filter(s =>
    !filterState.kelas || s.kelas === filterState.kelas
  );

  const alumniFiltered = semuaAlumni.filter(a =>
    !filterState.tahun || String(a.tahunLulus) === String(filterState.tahun)
  );

  renderSiswa(siswaFiltered);
  renderAlumni(alumniFiltered);
}

/* ================= DROPDOWN KELAS ================= */
function setFilterKelas(data){
  if(!filterKelas) return;

  const selected = filterKelas.value;
  const set = new Set();

  data.forEach(s => {
    if(s.kelas) set.add(s.kelas);
  });

  const arr = [...set].sort((a,b)=>
    a.localeCompare(b, "id", { numeric: true })
  );

  filterKelas.innerHTML = `<option value="">Semua Kelas</option>`;

  arr.forEach(k => {
    filterKelas.innerHTML += `<option value="${k}">${k}</option>`;
  });

  filterKelas.value = selected;
}

/* ================= DROPDOWN TAHUN ================= */
function setFilterTahun(data){
  if(!filterTahun) return;

  const selected = filterTahun.value;
  const set = new Set();

  data.forEach(a=>{
    if(a.tahunLulus) set.add(a.tahunLulus);
  });

  const arr = [...set].sort((a,b)=>b-a);

  filterTahun.innerHTML = `<option value="">Semua Tahun Lulus</option>`;

  arr.forEach(t=>{
    filterTahun.innerHTML += `<option value="${t}">${t}</option>`;
  });

  filterTahun.value = selected;
}

/* ================= RENDER SISWA ================= */
function renderSiswa(data){

  if(!data.length){
    dataSiswa.innerHTML = `
      <div class="loading-box">
        <i class="fas fa-folder-open"></i>
        <p>Data siswa tidak ditemukan</p>
      </div>
    `;
    return;
  }

  data.sort((a, b) => {
    const kelasA = (a.kelas || "").toLowerCase();
    const kelasB = (b.kelas || "").toLowerCase();

    const namaA = (a.nama || "").toLowerCase();
    const namaB = (b.nama || "").toLowerCase();

    if (kelasA < kelasB) return -1;
    if (kelasA > kelasB) return 1;

    return namaA.localeCompare(namaB);
  });

  let html = "";

  data.forEach(s => {
    const gender = (s.gender || "").toLowerCase();

    let fotoDefault = "image/siswa/user.png";

    if(gender.includes("laki")) {
      fotoDefault = "image/siswa/userlaki.png";
    } else if(gender.includes("perempuan")) {
      fotoDefault = "image/siswa/usercewe.png";
    }

    html += `
      <div class="siswa-card">
        <div class="siswa-foto-box">
          <img src="${s.foto || fotoDefault}"
               onerror="this.src='image/siswa/user.png'">
        </div>

        <div class="siswa-content">
          <h3>${s.nama || "-"}</h3>
          <p>NIS: ${s.nis || "-"}</p>
          <p>Kelas: ${s.kelas || "-"}</p>
          <p>Gender: ${s.gender || "-"}</p>
        </div>
      </div>
    `;
  });

  dataSiswa.innerHTML = html;
}

/* ================= RENDER ALUMNI ================= */
function renderAlumni(data){

  if(!data.length){
    dataAlumni.innerHTML = `
      <div class="loading-box">
        <i class="fas fa-folder-open"></i>
        <p>Data alumni tidak ditemukan</p>
      </div>
    `;
    return;
  }

  data.sort((a, b) => {
    const tahunA = parseInt(a.tahunLulus) || 0;
    const tahunB = parseInt(b.tahunLulus) || 0;

    const namaA = (a.nama || "").toLowerCase();
    const namaB = (b.nama || "").toLowerCase();

    if (tahunA !== tahunB) return tahunB - tahunA;

    return namaA.localeCompare(namaB);
  });

  let html = "";

  data.forEach(a=>{
    const gender = (a.gender || "").toLowerCase();

    let fotoDefault = "image/siswa/user.png";

    if(gender.includes("laki")) {
      fotoDefault = "image/siswa/userlaki.png";
    } else if(gender.includes("perempuan")) {
      fotoDefault = "image/siswa/usercewe.png";
    }

    html += `
      <div class="siswa-card">
        <div class="siswa-foto-box">
          <img src="${a.foto || fotoDefault}"
               onerror="this.src='image/siswa/user.png'">
        </div>

        <div class="siswa-content">
          <h3>${a.nama || "-"}</h3>
          <p>NIS: ${a.nis || "-"}</p>
          <p>Lulus: ${a.tahunLulus || "-"}</p>
          <p>Gender: ${a.gender || "-"}</p>
        </div>
      </div>
    `;
  });

  dataAlumni.innerHTML = html;
}

/* ================= EVENT ================= */
filterKelas?.addEventListener("change", (e) => {
  filterState.kelas = e.target.value;
  applyFilter();
});

filterTahun?.addEventListener("change", (e) => {
  filterState.tahun = e.target.value;
  applyFilter();
});

/* ================= FIRESTORE ================= */
onSnapshot(query(collection(db,"siswa"), orderBy("nama")), snap=>{
  semuaData = snap.docs.map(d => d.data());

  setFilterKelas(semuaData);
  applyFilter();

  updateStatistikSiswa(semuaData);
});

onSnapshot(query(collection(db,"alumni"), orderBy("nama")), snap=>{
  semuaAlumni = snap.docs.map(d => d.data());

  setFilterTahun(semuaAlumni);
  applyFilter();

  updateStatistikAlumni(semuaAlumni);
});