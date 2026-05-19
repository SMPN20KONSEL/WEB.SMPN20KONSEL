/* ================= HEADER ================= */

fetch("./components/header.html")

.then(res => res.text())

.then(data => {

  document.getElementById("header").innerHTML = data;

  /* ================= NAVBAR MOBILE ================= */

  const toggle =
  document.querySelector(".nav-toggle");

  const navLinks =
  document.querySelector(".nav-links");

  if(toggle){

    toggle.addEventListener("click", () => {

      navLinks.classList.toggle("active");

    });

  }

  /* ================= DROPDOWN ================= */

  const dropdowns =
  document.querySelectorAll(".dropdown");

  dropdowns.forEach(drop => {

    const btn =
    drop.querySelector(".dropbtn");

    btn.addEventListener("click", function(e){

      e.preventDefault();

      /* tutup dropdown lain */

      dropdowns.forEach(other => {

        if(other !== drop){

          other.classList.remove("active");

        }

      });

      /* toggle sekarang */

      drop.classList.toggle("active");

    });

  });

  /* ================= KLIK LUAR ================= */

  document.addEventListener("click", function(e){

    dropdowns.forEach(drop => {

      if(!drop.contains(e.target)){

        drop.classList.remove("active");

      }

    });

  });

});

/* ================= FOOTER ================= */

fetch("./components/footer.html")

.then(res => res.text())

.then(data => {

  document.getElementById("footer").innerHTML = data;

});