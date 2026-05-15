import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const guruSelect = document.getElementById("guruSelect");
const preview = document.getElementById("preview");
const output = document.getElementById("output");

let guruList = [];
let selectedGuru = null;


// ================= LOAD GURU =================
async function loadGuru() {

  const snap = await getDocs(collection(db, "guru"));

  guruList = []; // reset biar tidak dobel

  snap.forEach(doc => {

    const data = doc.data();

    guruList.push({
      uid: doc.id,   // 🔥 penting: ambil UID
      nip: data.nip,
      nama: data.nama,
      foto: data.foto
    });

    const option = document.createElement("option");
    option.value = data.nip;
    option.textContent = data.nama;

    guruSelect.appendChild(option);
  });

}

loadGuru();


// ================= SELECT GURU =================
guruSelect.addEventListener("change", () => {

  const nip = guruSelect.value;

  selectedGuru = guruList.find(g =>
    String(g.nip) === String(nip)
  );

  console.log("Selected Guru:", selectedGuru);

  if (selectedGuru) {
    preview.innerHTML = `
      <img src="${selectedGuru.foto}">
      <h3>${selectedGuru.nama}</h3>
    `;
  } else {
    preview.innerHTML = "<p>Guru tidak ditemukan</p>";
  }

});


// ================= SIMPAN =================
window.simpan = async function () {

  const koleksi = document.getElementById("koleksi").value.trim();
  const jabatan = document.getElementById("jabatan").value.trim();

  if (!koleksi || !jabatan || !selectedGuru) {
    alert("Lengkapi data!");
    return;
  }

  await addDoc(collection(db, koleksi), {
    uid: selectedGuru.uid,   // 🔥 simpan uid juga
    nip: selectedGuru.nip,
    nama: selectedGuru.nama,
    foto: selectedGuru.foto,
    jabatan: jabatan
  });

  alert("Data berhasil disimpan!");

};


// ================= RENDER DATA =================
function renderData(koleksi) {

  onSnapshot(collection(db, koleksi), (snap) => {

    let html = `
      <div class="section-title">${koleksi.toUpperCase()}</div>
      <table>
        <tr>
          <th>Foto</th>
          <th>Nama</th>
          <th>Jabatan</th>
        </tr>
    `;

    snap.forEach(doc => {

      const d = doc.data();

      html += `
        <tr>
          <td><img src="${d.foto}" width="50"></td>
          <td>${d.nama}</td>
          <td>${d.jabatan}</td>
        </tr>
      `;
    });

    html += `</table>`;

    output.innerHTML = html; // 🔥 FIX PENTING

  });

}


// ================= AUTO LOAD =================
setTimeout(() => {
  renderData("humas");
  renderData("kurikulum");
  renderData("kesiswaan");
}, 500);