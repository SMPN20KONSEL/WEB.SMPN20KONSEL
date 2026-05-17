// assets/js/auth-guard.js

import { auth }
from "./firebase.js";

import {
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// cek status login
onAuthStateChanged(auth, (user) => {

  // belum login
  if (!user) {

    window.location.href =
    "../admin/login.html";

  } else {

    // tampilkan halaman
    document.body.style.display =
    "block";

  }

});