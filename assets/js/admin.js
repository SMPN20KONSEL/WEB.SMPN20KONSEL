
const dropdowns =
document.querySelectorAll(".dropdown");

dropdowns.forEach(dropdown=>{

  const btn =
  dropdown.querySelector(".dropbtn");

  btn.addEventListener("click",()=>{

    dropdown.classList.toggle("active");

  });

});
