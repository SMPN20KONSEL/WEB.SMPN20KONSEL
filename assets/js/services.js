import { db } from "./firebase.js";
import {
  collection, getDocs, addDoc, deleteDoc,
  doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* ================= GURU ================= */
export async function getGuru(){
  const snap = await getDocs(collection(db,"guru"));
  return snap.docs.map(d => ({id:d.id, ...d.data()}));
}

export async function addGuru(data){
  return await addDoc(collection(db,"guru"), data);
}

export async function deleteGuru(id){
  return await deleteDoc(doc(db,"guru",id));
}

/* ================= SISWA ================= */
export async function getSiswa(){
  const snap = await getDocs(collection(db,"siswa"));
  return snap.docs.map(d => ({id:d.id, ...d.data()}));
}

export async function addSiswa(data){
  return await addDoc(collection(db,"siswa"), data);
}

export async function deleteSiswa(id){
  return await deleteDoc(doc(db,"siswa",id));
}

/* ================= STATISTIK ================= */
export async function getStatistik(){
  const snap = await getDoc(doc(db,"website","statistik"));
  return snap.exists() ? snap.data() : null;
}

export async function setStatistik(data){
  return await setDoc(doc(db,"website","statistik"), data);
}