
    // DARK MODE

    function toggleMode(){
      document.body.classList.toggle("light");
    }

    // FAQ

    const faq = document.querySelectorAll(".faq");

    faq.forEach(item=>{

      item.addEventListener("click", ()=>{
        item.classList.toggle("active");
      });

    });

