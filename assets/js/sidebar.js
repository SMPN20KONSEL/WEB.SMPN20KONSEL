// =========================
// LOAD SIDEBAR
// =========================

fetch("sidebar.html")

.then(response => response.text())

.then(data => {

  // tampilkan sidebar
  document.getElementById(
    "sidebar"
  ).innerHTML = data;


  // =========================
  // DROPDOWN MENU
  // =========================

  const dropdowns =
  document.querySelectorAll(
    ".dropdown"
  );

  dropdowns.forEach(drop => {

    const btn =
    drop.querySelector(
      ".dropbtn"
    );

    btn.addEventListener(
      "click",
      () => {

        // tutup dropdown lain
        dropdowns.forEach(item => {

          if(item !== drop){
            item.classList.remove(
              "active"
            );
          }

        });

        // toggle dropdown aktif
        drop.classList.toggle(
          "active"
        );

      }
    );

  });


  // =========================
  // TOGGLE SIDEBAR MOBILE
  // =========================

  const menuToggle =
  document.getElementById(
    "menuToggle"
  );

  const sidebar =
  document.querySelector(
    ".sidebar"
  );

  if(menuToggle){

    menuToggle.addEventListener(
      "click",
      () => {

        sidebar.classList.toggle(
          "active"
        );

      }
    );

  }

})

.catch(error => {

  console.log(
    "Sidebar gagal dimuat:",
    error
  );

});
