// ======================================================
// FIREBASE CONFIG
// ======================================================

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

import { getAnalytics }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { getStorage }
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-storage.js";


// ======================================================
// FIREBASE CONFIG
// ======================================================

const firebaseConfig = {

  apiKey: "AIzaSyDrA-asOH_xWMZXJhs1Pot5tliCcZDNwiQ",

  authDomain: "websmpn20konsel.firebaseapp.com",

  projectId: "websmpn20konsel",

  storageBucket: "websmpn20konsel.firebasestorage.app",

  messagingSenderId: "639851189896",

  appId: "1:639851189896:web:6ea2ee043e76650abd313d",

  measurementId: "G-LCZ45BWK75"
};


// ======================================================
// INIT FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);


// ======================================================
// EXPORT
// ======================================================

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);

export default app;