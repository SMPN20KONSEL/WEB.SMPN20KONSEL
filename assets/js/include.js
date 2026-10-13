/* =========================================================
   INCLUDE.JS
   Memuat header & footer, lalu mengaktifkan menu HP + dropdown
========================================================= */

function loadComponent(id, url, done){

  const el = document.getElementById(id);
  if(!el) return;

  fetch(url)
    .then(res => {
      if(!res.ok) throw new Error(res.status);
      return res.text();
    })
    .then(html => {
      el.innerHTML = html;
      if(done) done();
    })
    .catch(err => {
      console.error("Gagal memuat " + url, err);
    });

}

loadComponent("header", "./components/header.html", initHeader);
loadComponent("footer", "./components/footer.html");

/* ================= HEADER ================= */

function initHeader(){

  const header    = document.querySelector(".app-header");
  const toggle    = document.querySelector(".app-toggle");
  const menu      = document.querySelector(".app-menu");
  const dropdowns = document.querySelectorAll(".app-dropdown");

  /* ---------- Simpan tinggi header ke CSS variable ---------- */

  function setHeaderHeight(){
    if(!header) return;
    document.documentElement.style.setProperty(
      "--header-h",
      header.offsetHeight + "px"
    );
  }

  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);
  window.addEventListener("load", setHeaderHeight);

  /* ---------- Helper ---------- */

  const closeDropdowns = () => {
    dropdowns.forEach(d => d.classList.remove("active"));
  };

  const closeMenu = () => {
    if(!menu) return;
    menu.classList.remove("active");
    if(toggle) toggle.setAttribute("aria-expanded", "false");
  };

  /* ---------- Hamburger ---------- */

  if(toggle && menu){

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", menu.id || "appMenu");
    if(!menu.id) menu.id = "appMenu";

    // Kalau bukan <button>, buat tetap bisa dipakai keyboard
    if(toggle.tagName !== "BUTTON"){
      toggle.setAttribute("role", "button");
      toggle.setAttribute("tabindex", "0");
      toggle.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === " "){
          e.preventDefault();
          toggle.click();
        }
      });
    }

    if(!toggle.getAttribute("aria-label")){
      toggle.setAttribute("aria-label", "Buka menu");
    }

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = menu.classList.toggle("active");
      toggle.setAttribute("aria-expanded", String(open));
      if(!open) closeDropdowns();
    });

  }

  /* ---------- Dropdown ---------- */

  dropdowns.forEach(drop => {

    const btn = drop.querySelector(".app-dropbtn");
    if(!btn) return;

    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", (e) => {

      e.stopPropagation();

      dropdowns.forEach(d => {
        if(d !== drop){
          d.classList.remove("active");
          const b = d.querySelector(".app-dropbtn");
          if(b) b.setAttribute("aria-expanded", "false");
        }
      });

      const open = drop.classList.toggle("active");
      btn.setAttribute("aria-expanded", String(open));

    });

  });

  /* ---------- Klik link di dalam menu -> tutup menu ---------- */

  if(menu){
    menu.addEventListener("click", (e) => {
      if(e.target.closest("a")){
        closeDropdowns();
        closeMenu();
      }
    });
  }

  /* ---------- Klik di luar -> tutup ---------- */

  document.addEventListener("click", (e) => {

    if(!e.target.closest(".app-dropdown")){
      closeDropdowns();
    }

    if(menu && !e.target.closest(".app-menu") && !e.target.closest(".app-toggle")){
      closeMenu();
    }

  });

  /* ---------- Tombol Esc -> tutup ---------- */

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
      closeDropdowns();
      closeMenu();
    }
  });

  /* ---------- Layar kembali lebar -> reset menu ---------- */

  window.addEventListener("resize", () => {
    if(window.innerWidth > 992){
      closeDropdowns();
      closeMenu();
    }
  });

}