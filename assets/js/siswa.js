import { db } from "./firebase.js";

import {
  collection,
  setDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* =========================
   FOTO BASE
========================= */

const FOTO_BASE = "../image/siswa/";

/* =========================
   TAMBAH SISWA
========================= */

window.tambahSiswa = async () => {

  const nis = document.getElementById("nis").value.trim();
  const nama = document.getElementById("nama").value.trim();
  const gender = document.getElementById("gender").value;
  const kelas = document.getElementById("kelas").value.trim();

  if(!nis || !nama || !gender || !kelas){
    alert("Lengkapi semua data");
    return;
  }

  try{

    await setDoc(doc(db,"siswa",nis),{
      nis,
      nama,
      gender,
      kelas,
      status:"aktif",
      createdAt:new Date()
    });

    alert("Siswa berhasil ditambahkan");

    document.getElementById("nis").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("kelas").value = "";
    document.getElementById("gender").value = "";

  }catch(err){
    console.error(err);
    alert("Gagal menambah siswa");
  }
};

/* =========================
   HAPUS SISWA
========================= */

window.hapusSiswa = async (nis,nama) => {

  if(!confirm(`Hapus siswa ${nama}?`)) return;

  try{
    await deleteDoc(doc(db,"siswa",nis));
    alert("Siswa dihapus");
  }catch(err){
    console.error(err);
    alert("Gagal hapus");
  }

};

/* =========================
   FORMAT GENDER
========================= */

function formatGender(g){

  if(!g) return "-";

  g = String(g).toLowerCase();

  if(g.includes("l")) return "Laki-laki";
  if(g.includes("p")) return "Perempuan";

  return g;
}

/* =========================
   IMPORT XLSX
========================= */

window.importCSV = async () => {

  const file = document.getElementById("fileCSV").files[0];

  if(!file){
    alert("Pilih file Excel");
    return;
  }

  try{

    const data = await file.arrayBuffer();

    const workbook = XLSX.read(data,{type:"array"});

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet,{defval:""});

    let total = 0;

    for(const s of rows){

      if(!s.nis) continue;

      await setDoc(doc(db,"siswa",String(s.nis)),{
        nis:String(s.nis).trim(),
        nama:String(s.nama).trim(),
        gender:formatGender(s.gender),
        kelas:String(s.kelas).trim(),
        status:"aktif",
        createdAt:new Date()
      });

      total++;

    }

    alert(`Import sukses (${total})`);

    document.getElementById("fileCSV").value = "";

  }catch(err){
    console.error(err);
    alert("Import gagal");
  }

};

/* =========================
   TEMPLATE XLSX
========================= */

window.downloadTemplate = () => {

  const data = [
    {nis:"24001",nama:"Ahmad",gender:"L",kelas:"7A"},
    {nis:"24002",nama:"Siti",gender:"P",kelas:"7A"}
  ];

  const ws = XLSX.utils.json_to_sheet(data);

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb,ws,"Siswa");

  XLSX.writeFile(wb,"template-siswa.xlsx");

};

/* =========================
   LOAD KELAS
========================= */

async function loadKelas(){

  const snap = await getDocs(collection(db,"siswa"));

  const setKelas = new Set();

  snap.forEach(d=>{
    const s = d.data();
    if(s.kelas) setKelas.add(s.kelas);
  });

  const list = [...setKelas].sort();

  const a = document.getElementById("kelasAsal");
  const b = document.getElementById("kelasLulus");

  list.forEach(k=>{
    a.innerHTML += `<option value="${k}">${k}</option>`;
    b.innerHTML += `<option value="${k}">${k}</option>`;
  });

}

loadKelas();

/* =========================
   LOAD SISWA PER KELAS
========================= */

async function loadSiswaKelas(kelas,target){

  const snap = await getDocs(collection(db,"siswa"));

  let html = "";

  snap.forEach(d=>{

    const s = d.data();

    if(s.kelas === kelas){
      html += `<option value="${s.nis}">${s.nama}</option>`;
    }

  });

  document.getElementById(target).innerHTML = html;

}

/* =========================
   EVENT KELAS
========================= */

document.getElementById("kelasAsal")
.addEventListener("change",(e)=>{
  loadSiswaKelas(e.target.value,"siswaTidakNaik");
});

document.getElementById("kelasLulus")
.addEventListener("change",(e)=>{
  loadSiswaKelas(e.target.value,"siswaTidakLulus");
});

/* =========================
   NEXT KELAS
========================= */

function nextKelas(kelas){

  const num = parseInt(kelas.match(/\d+/)?.[0] || 0);
  const text = kelas.replace(/\d+/g,"");

  return (num + 1) + text;

}

/* =========================
   NAIK KELAS MASSAL
========================= */

window.naikKelasMassal = async () => {

  const kelas = document.getElementById("kelasAsal").value;

  if(!kelas){
    alert("Pilih kelas");
    return;
  }

  const tidakNaik = [...document
    .getElementById("siswaTidakNaik")
    .selectedOptions]
    .map(o=>o.value);

  const snap = await getDocs(collection(db,"siswa"));

  let total = 0;

  for(const d of snap.docs){

    const s = d.data();

    if(s.kelas !== kelas) continue;

    if(tidakNaik.includes(s.nis)) continue;

    await updateDoc(doc(db,"siswa",s.nis),{
      kelas: nextKelas(s.kelas)
    });

    total++;

  }

  alert(`${total} siswa naik kelas`);

};

/* =========================
   LULUSKAN (ALUMNI)
========================= */

window.luluskanSiswa = async () => {

  const kelas = document.getElementById("kelasLulus").value;

  if(!kelas){
    alert("Pilih kelas");
    return;
  }

  const tidakLulus = [...document
    .getElementById("siswaTidakLulus")
    .selectedOptions]
    .map(o=>o.value);

  const snap = await getDocs(collection(db,"siswa"));

  let total = 0;

  const tahun = new Date().getFullYear();

  for(const d of snap.docs){

    const s = d.data();

    if(s.kelas !== kelas) continue;

    if(tidakLulus.includes(s.nis)) continue;

    // pindah ke alumni
    await setDoc(doc(db,"alumni",s.nis),{
      ...s,
      tahunLulus: tahun,
      status:"lulus"
    });

    // hapus dari siswa
    await deleteDoc(doc(db,"siswa",s.nis));

    total++;

  }

  alert(`${total} siswa lulus`);

};

/* =========================
   REALTIME TABLE
========================= */

const q = query(collection(db,"siswa"),orderBy("nis"));

onSnapshot(q,(snap)=>{

  let html = "";

  snap.forEach(d=>{

    const s = d.data();

    html += `
    <tr>

      <td>
        <img class="foto"
        src="${FOTO_BASE}${s.nis}.jpg"
        onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'">
      </td>

      <td>${s.nis}</td>
      <td>${s.nama}</td>
      <td>${s.gender}</td>
      <td>${s.kelas}</td>

      <td>
        <span class="badge ${s.status}">
          ${s.status}
        </span>
      </td>

      <td>
        <button class="btn-hapus"
        onclick="hapusSiswa('${s.nis}','${s.nama}')">
        Hapus
        </button>
      </td>

    </tr>
    `;

  });

  document.getElementById("dataSiswa").innerHTML =
  html || `<tr><td colspan="7">Tidak ada data</td></tr>`;

});