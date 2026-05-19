
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

const tbodySiswa =
document.getElementById("tbodySiswa");

onSnapshot(collection(db, "siswa"), (snap) => {

  let dataKelas = {};

  snap.forEach((doc) => {

    const s = doc.data();

    const kelas =
    s.kelas || "-";

    const jk =
    (s.jk || "").toLowerCase();

    const agama =
    (s.agama || "").toLowerCase();

    if (!dataKelas[kelas]) {

      dataKelas[kelas] = {

        laki: 0,
        perempuan: 0,

        islam: 0,
        hindu: 0,

        wali:
        s.wali || "-"

      };

    }

    /* ================= GENDER ================= */

    if (jk === "laki-laki") {
      dataKelas[kelas].laki++;
    }

    if (jk === "perempuan") {
      dataKelas[kelas].perempuan++;
    }

    /* ================= AGAMA ================= */

    if (agama === "islam") {
      dataKelas[kelas].islam++;
    }

    if (agama === "hindu") {
      dataKelas[kelas].hindu++;
    }

  });

  let html = "";

  let no = 1;

  let totalL = 0;
  let totalP = 0;

  let totalIslam = 0;
  let totalHindu = 0;

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

    return a.localeCompare(b);

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

    totalIslam += k.islam;
    totalHindu += k.hindu;

    html += `

      <tr>

        <td>${no++}</td>

        <td>${kelas}</td>

        <td>${k.laki}</td>

        <td>${k.perempuan}</td>

        <td>${jumlah}</td>

        <td>${k.islam}</td>

        <td>${k.hindu}</td>

        <td>${jumlah}</td>

        <td>${k.wali}</td>

      </tr>

    `;

  });

  /* =====================================================
     TOTAL
  ===================================================== */

  const total =
  totalL + totalP;

  html += `

    <tr>

      <th colspan="2">JML</th>

      <th>${totalL}</th>

      <th>${totalP}</th>

      <th>${total}</th>

      <th>${totalIslam}</th>

      <th>${totalHindu}</th>

      <th>${total}</th>

      <th></th>

    </tr>

  `;

  tbodySiswa.innerHTML = html;

});

