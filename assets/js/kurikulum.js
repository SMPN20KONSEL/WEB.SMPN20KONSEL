
    
    import { db } from "./firebase.js";
    
    import {
      doc,
      onSnapshot
    } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
    
    const fotoKepala = document.getElementById("fotoKepala");
    const nama = document.getElementById("nama");
    const hp = document.getElementById("hp");
    
    const docRef = doc(
      db,
      "jabatan",
      "wakil-kepala-sekolah-bidang-kurikulum"
    );
    
    onSnapshot(docRef, (docSnap) => {
    
      if(docSnap.exists()){
    
        const data = docSnap.data();
    
        fotoKepala.src =
          data.foto || "image/default.png";
    
        nama.textContent =
          data.nama || "-";
    
        hp.textContent =
          data.nohp || "-";
    
      } else {
    
        nama.textContent = "Data tidak ditemukan";
    
      }
    
    });
    


/* ================= FAQ ================= */

const faqItems =
document.querySelectorAll(".faq");

faqItems.forEach((faq)=>{

  faq.addEventListener("click",()=>{

    faq.classList.toggle("active");

  });

});

/* ================= SLIDER PAUSE ================= */

const sliderTrack =
document.querySelector(".slide-track");

sliderTrack.addEventListener("mouseenter",()=>{

  sliderTrack.style.animationPlayState =
  "paused";

});

sliderTrack.addEventListener("mouseleave",()=>{

  sliderTrack.style.animationPlayState =
  "running";

});

/* ================= LIGHT MODE ================= */

const btn =
document.createElement("button");

btn.innerHTML =
'<i class="fas fa-moon"></i>';

btn.style.position = "fixed";
btn.style.right = "20px";
btn.style.bottom = "20px";
btn.style.width = "55px";
btn.style.height = "55px";
btn.style.borderRadius = "50%";
btn.style.border = "none";
btn.style.cursor = "pointer";
btn.style.background = "#ffd54f";
btn.style.color = "#071426";
btn.style.fontSize = "22px";
btn.style.zIndex = "999";

document.body.appendChild(btn);

btn.onclick = ()=>{

  document.body.classList.toggle("light");

  if(
    document.body.classList.contains("light")
  ){

    btn.innerHTML =
    '<i class="fas fa-sun"></i>';

  }else{

    btn.innerHTML =
    '<i class="fas fa-moon"></i>';

  }

};



