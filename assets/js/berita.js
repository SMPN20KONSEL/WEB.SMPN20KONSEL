
    // DARK MODE

    function toggleMode(){
      document.body.classList.toggle("light");
    }

    // SEARCH BERITA

    const searchInput = document.getElementById("searchInput");
    const newsCards = document.querySelectorAll(".news-card");

    searchInput.addEventListener("keyup", function(){

      let value = this.value.toLowerCase();

      newsCards.forEach(card => {

        let text = card.innerText.toLowerCase();

        if(text.includes(value)){
          card.style.display = "block";
        }else{
          card.style.display = "none";
        }

      });

    });
