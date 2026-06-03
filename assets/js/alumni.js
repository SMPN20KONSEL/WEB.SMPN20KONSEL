import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* =========================
   FOTO PATH
========================= */

const FOTO = "../image/siswa/";

/* =========================
   FORMAT GENDER (FIX)
========================= */

function formatGender(g){

  if(!g) return "-";

  g = String(g).trim().toUpperCase();

  if(
    g === "L" ||
    g === "LK" ||
    g === "LAKI-LAKI" ||
    g === "LAKI LAKI"
  ){
    return "Laki-laki";
  }

  if(
    g === "P" ||
    g === "PR" ||
    g === "PEREMPUAN"
  ){
    return "Perempuan";
  }

  return g;
}

/* =========================
   LOAD ALUMNI
========================= */

async function loadAlumni(){

  const snap = await getDocs(collection(db,"alumni"));

  let html = "";

  snap.forEach(d=>{

    const a = d.data();

    html += `
    <tr>

      <td>
        <img class="foto"
        src="${FOTO}${a.nis}.jpg"
        onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'">
      </td>

      <td>${a.nis || "-"}</td>
      <td>${a.nama || "-"}</td>
      <td>${a.gender || "-"}</td>
      <td>${a.kelas || "-"}</td>
      <td>${a.tahunLulus || "-"}</td>

    </tr>
    `;

  });

  document.getElementById("alumniTable").innerHTML =
  html || `<tr><td colspan="6">Belum ada data alumni</td></tr>`;

}

loadAlumni();

/* =========================
   TAMBAH ALUMNI MANUAL (FIX GENDER)
========================= */

window.tambahAlumniManual = async () => {

  const nis = document.getElementById("nis").value.trim();
  const nama = document.getElementById("nama").value.trim();
  const gender = document.getElementById("gender").value;
  const kelas = document.getElementById("kelas").value.trim();
  const tahun = document.getElementById("tahun").value.trim();

  if(!nis || !nama){
    alert("NIS dan Nama wajib diisi");
    return;
  }

  try{

    await setDoc(doc(db,"alumni",nis),{

      nis,
      nama,
      gender: formatGender(gender),
      kelas: kelas || "-",
      tahunLulus: tahun || "-",
      status:"alumni"

    });

    alert("Alumni berhasil ditambahkan");

    document.getElementById("nis").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("gender").value = "";
    document.getElementById("kelas").value = "";
    document.getElementById("tahun").value = "";

    loadAlumni();

  }catch(err){
    console.error(err);
    alert("Gagal menambah alumni");
  }

};

/* =========================
   IMPORT ALUMNI EXCEL (FIX GENDER)
========================= */

window.importAlumniExcel = async () => {

  const file = document.getElementById("fileAlumni").files[0];

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

    for(const r of rows){

      if(!r.nis) continue;

      await setDoc(doc(db,"alumni",String(r.nis)),{

        nis: String(r.nis),
        nama: r.nama || "-",
        gender: formatGender(r.gender),
        kelas: r.kelas || "-",
        tahunLulus: r.tahunLulus || "-",
        status:"alumni"

      });

      total++;

    }

    alert(`Import sukses (${total}) alumni`);

    document.getElementById("fileAlumni").value = "";

    loadAlumni();

  }catch(err){
    console.error(err);
    alert("Gagal import Excel");
  }

};

/* =========================
   EXPORT EXCEL
========================= */

window.exportAlumni = async () => {

  const snap = await getDocs(collection(db,"alumni"));

  const data = [];

  snap.forEach(d=>{

    const a = d.data();

    data.push({
      nis: a.nis,
      nama: a.nama,
      gender: a.gender,
      kelas: a.kelas,
      tahunLulus: a.tahunLulus
    });

  });

  const ws = XLSX.utils.json_to_sheet(data);

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb,ws,"Alumni");

  XLSX.writeFile(wb,"data-alumni.xlsx");

};