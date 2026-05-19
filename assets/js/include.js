fetch("./components/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    setTimeout(() => {

      // ================= HAMBURGER =================
      const toggle = document.querySelector(".app-toggle");
      const menu = document.querySelector(".app-menu");

      if(toggle && menu){
        toggle.addEventListener("click", () => {
          menu.classList.toggle("active");
        });
      }

      // ================= DROPDOWN =================
      const dropdowns = document.querySelectorAll(".app-dropdown");

      dropdowns.forEach(drop => {
        const btn = drop.querySelector(".app-dropbtn");

        if(btn){
          btn.addEventListener("click", (e) => {
            e.stopPropagation();

            dropdowns.forEach(d => {
              if(d !== drop) d.classList.remove("active");
            });

            drop.classList.toggle("active");
          });
        }
      });

      // ================= CLICK OUTSIDE =================
      document.addEventListener("click", () => {
        dropdowns.forEach(d => d.classList.remove("active"));
      });

    }, 50);
  });

/* ================= FOOTER ================= */

fetch("./components/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });