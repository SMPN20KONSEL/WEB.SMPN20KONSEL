
import { db } from "./firebase.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* =====================================================
   TAHUN PELAJARAN
===================================================== */

const sekarang = new Date();

const tahun =
sekarang.getFullYear();

const mulai =
sekarang.getMonth() >= 6
? tahun
: tahun - 1;

const selesai =
mulai + 1;

document.getElementById("tahunPelajaran").innerText =
`TAHUN PELAJARAN ${mulai}/${selesai}`;

/* =====================================================
   REKAP TENAGA GURU
===================================================== */

const tbodyTenaga =
document.getElementById("tbodyTenaga");

onSnapshot(collection(db, "guru"), (snap) => {

  let kepalaSekolah = 0;
  let guruMapel = 0;
  let tendik = 0;

  snap.forEach((d) => {

    const g =
    d.data();

    const jabatan =
    (g.jabatan || "").toLowerCase();

    if (
      jabatan.includes("kepala sekolah")
    ) {

      kepalaSekolah++;

    }

    else if (
      jabatan.includes("guru")
    ) {

      guruMapel++;

    }

    else {

      tendik++;

    }

  });

  const total =
  kepalaSekolah +
  guruMapel +
  tendik;

  tbodyTenaga.innerHTML = `

    <tr>
      <td>1</td>
      <td>Kepala Sekolah</td>
      <td>${kepalaSekolah}</td>
    </tr>

    <tr>
      <td>2</td>
      <td>Guru Mata Pelajaran</td>
      <td>${guruMapel}</td>
    </tr>

    <tr>
      <td>3</td>
      <td>Tenaga Kependidikan</td>
      <td>${tendik}</td>
    </tr>

    <tr>
      <th colspan="2">JUMLAH</th>
      <th>${total}</th>
    </tr>

  `;

});

/* =====================================================
   DATA SISWA
===================================================== */
/* =====================================================
   DATA SISWA
===================================================== */

const tbodySiswa =
document.getElementById("tbodySiswa");

onSnapshot(collection(db, "siswa"), (snap) => {

  let dataKelas = {};

  snap.forEach((doc) => {

    const s = doc.data();

    const kelas =
    s.kelas || "-";

const gender =
(s.gender || "").toLowerCase();

    if (!dataKelas[kelas]) {

      dataKelas[kelas] = {
        laki: 0,
        perempuan: 0
      };

    }

    /* ================= GENDER ================= */

    if (gender === "laki-laki") {
      dataKelas[kelas].laki++;
    }

    if (gender === "perempuan") {
      dataKelas[kelas].perempuan++;
    }

  });

  /* =====================================================
     JIKA DATA KOSONG
  ===================================================== */

  if (Object.keys(dataKelas).length === 0) {

    tbodySiswa.innerHTML = `
      <tr>
        <td colspan="5">
          Belum ada data siswa
        </td>
      </tr>
    `;

    return;

  }

  let html = "";

  let no = 1;

  let totalL = 0;
  let totalP = 0;

  /* =====================================================
     SORT KELAS
  ===================================================== */

  const urutanKelas =
  Object.keys(dataKelas).sort((a, b) => {

    const urutan = {
      "VII": 1,
      "VIII": 2,
      "IX": 3
    };

    const aMain =
    a.split(" ")[0].toUpperCase();

    const bMain =
    b.split(" ")[0].toUpperCase();

    if (
      urutan[aMain] !==
      urutan[bMain]
    ) {

      return (
        urutan[aMain] -
        urutan[bMain]
      );

    }

    return a.localeCompare(
      b,
      "id",
      { numeric: true }
    );

  });

  /* =====================================================
     LOOP DATA
  ===================================================== */

  urutanKelas.forEach((kelas) => {

    const k =
    dataKelas[kelas];

    const jumlah =
    k.laki + k.perempuan;

    totalL += k.laki;
    totalP += k.perempuan;

    html += `
      <tr>
        <td>${no++}</td>
        <td>${kelas}</td>
        <td>${k.laki}</td>
        <td>${k.perempuan}</td>
        <td>${jumlah}</td>
      </tr>
    `;

  });

  /* =====================================================
     TOTAL
  ===================================================== */

  const total =
  totalL + totalP;

  html += `
    <tr class="total-row">
      <th colspan="2">JML</th>
      <th>${totalL}</th>
      <th>${totalP}</th>
      <th>${total}</th>
    </tr>
  `;

  tbodySiswa.innerHTML = html;

});

/* =====================================================
   DATA ALUMNI BERDASARKAN TAHUN LULUS
===================================================== */

const tbodyAlumni =
document.getElementById("tbodyAlumni");

onSnapshot(collection(db, "alumni"), (snap) => {

  let dataTahun = {};

  snap.forEach((doc) => {

    const a = doc.data();

    const tahun =
    a.tahunLulus || "-";

    const gender =
    (a.gender || "").toLowerCase();

    if (!dataTahun[tahun]) {

      dataTahun[tahun] = {
        laki: 0,
        perempuan: 0
      };

    }

    if (
      gender === "laki-laki" ||
      gender === "laki laki" ||
      gender === "l"
    ) {
      dataTahun[tahun].laki++;
    }

    if (
      gender === "perempuan" ||
      gender === "p"
    ) {
      dataTahun[tahun].perempuan++;
    }

  });

  if (Object.keys(dataTahun).length === 0) {

    tbodyAlumni.innerHTML = `
      <tr>
        <td colspan="5">
          Belum ada data alumni
        </td>
      </tr>
    `;

    return;
  }

  let html = "";
  let no = 1;

  let totalL = 0;
  let totalP = 0;

  /* ================= URUTKAN TAHUN ================= */

  const urutanTahun =
  Object.keys(dataTahun)
  .sort((a, b) => b - a);

  /* ================= LOOP DATA ================= */

  urutanTahun.forEach((tahun) => {

    const t =
    dataTahun[tahun];

    const jumlah =
    t.laki + t.perempuan;

    totalL += t.laki;
    totalP += t.perempuan;

    html += `
      <tr>
        <td>${no++}</td>
        <td>${tahun}</td>
        <td>${t.laki}</td>
        <td>${t.perempuan}</td>
        <td>${jumlah}</td>
      </tr>
    `;

  });

  /* ================= TOTAL ================= */

  const total =
  totalL + totalP;

  html += `
    <tr class="total-row">
      <th colspan="2">JML</th>
      <th>${totalL}</th>
      <th>${totalP}</th>
      <th>${total}</th>
    </tr>
  `;

  tbodyAlumni.innerHTML = html;

});