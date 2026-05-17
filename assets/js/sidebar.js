fetch("sidebar.html")

.then(response => response.text())

.then(data => {

  document.getElementById(
    "sidebar"
  ).innerHTML = data;

  /* ================= DROPDOWN ================= */

  const dropdowns =
  document.querySelectorAll(
    ".dropbtn"
  );

  dropdowns.forEach(btn => {

    btn.addEventListener(
      "click",
      function(){

        this.classList.toggle(
          "active"
        );

        const content =
        this.nextElementSibling;

        if(
          content.style.display
          === "block"
        ){

          content.style.display =
          "none";

        }else{

          content.style.display =
          "block";

        }

      }
    );

  });

});