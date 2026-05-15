const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if(navToggle){

  navToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

  });

}

function toggleMenu(){
  document.querySelector(".menu").classList.toggle("active");
}
window.addEventListener("load",()=>{

  const loader =
  document.getElementById("loader");

  loader.style.opacity = "0";

  setTimeout(()=>{
    loader.style.display = "none";
  },500);

});

const btn =
document.getElementById("scrollTopBtn");

window.addEventListener("scroll",()=>{

  btn.style.display =
  window.scrollY > 300
  ? "block"
  : "none";

});

btn.onclick = ()=>{

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

};

const cards =
document.querySelectorAll(".card-section");

const observer =
new IntersectionObserver(entries=>{

  entries.forEach(entry=>{

    if(entry.isIntersecting){

      entry.target.classList.add("show");

    }

  });

},{
  threshold:0.1
});

cards.forEach(card=>{
  observer.observe(card);
});
