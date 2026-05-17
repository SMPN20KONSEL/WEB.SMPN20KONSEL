fetch("./components/header.html")
  .then(res => res.text())
  .then(data => {

    document.getElementById("header").innerHTML = data;

    // NAVBAR MOBILE
    const toggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if(toggle){
      toggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
      });
    }

  });

fetch("./components/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });