/* =========================================
   GLOBAL AOS AUTO
   SMPN 20 KONAWE SELATAN
   OPTIMIZED VERSION
========================================= */

window.addEventListener("DOMContentLoaded",()=>{

  /* =========================================
     SELECTOR & ANIMATION
  ========================================= */

  const aosGlobal = {

    /* HERO */
    ".hero-content" : "zoom-in",

    ".hero-btn" : "fade-up",

    /* TITLE */
    ".section-title" : "fade-up",

    /* ABOUT */
    ".about img" : "fade-right",

    ".about-text" : "fade-left",

    ".intro-image" : "fade-right",

    ".intro-text" : "fade-left",

    ".sambutan-wrapper img" : "fade-right",

    ".sambutan-text" : "fade-left",

    /* CARD */
    ".card" : "fade-up",

    ".info-card" : "zoom-in-up",

    ".stat-card" : "zoom-in",

    ".berita-card" : "fade-up",

    ".news-card" : "fade-up",

    ".unggulan-card" : "zoom-in-up",

    ".fasilitas-card" : "fade-up",

    ".jurusan-card" : "fade-up",

    ".ekskul-card" : "zoom-in",

    ".guru-card" : "fade-up",

    ".team-card" : "zoom-in-up",

    ".program-card" : "fade-up",

    ".agenda-card" : "fade-up",

    ".galeri-card" : "zoom-in",

    ".pengumuman-card" : "fade-up",

    ".kelas-card" : "fade-up",

    ".mapel-card" : "fade-up",

    ".osis-card" : "zoom-in-up",

    ".service-card" : "fade-up",

    ".feature-card" : "fade-up",

    /* GRID */
    ".grid > *" : "fade-up",

    ".card-container > *" : "fade-up",

    ".berita-container > *" : "fade-up",

    ".unggulan-container > *" : "zoom-in-up",

    ".fasilitas-container > *" : "fade-up",

    ".team > *" : "zoom-in",

    ".stats > *" : "zoom-in",

    ".gallery > img" : "zoom-in",

    ".news-container > *" : "fade-up",

    ".struktur-container > *" : "zoom-in-up",

    ".jabatan-bawah > *" : "zoom-in-up",

    ".video-wrapper" : "zoom-in",

    /* TIMELINE */
    ".timeline-item:nth-child(odd)" : "fade-right",

    ".timeline-item:nth-child(even)" : "fade-left",

    /* CONTACT */
    ".contact-info p" : "fade-up",

    ".contact-box" : "fade-up",

    ".contact-form" : "fade-left",

    ".contact-map" : "fade-right",

    /* TABLE */
    ".table-responsive" : "fade-up",

    /* BUTTON */
    ".btn" : "fade-up",

    ".btn-baca" : "fade-up",

    ".login-btn" : "fade-up"

  };

  /* =========================================
     AUTO GENERATE
  ========================================= */

  for(const selector in aosGlobal){

    const elements =
    document.querySelectorAll(selector);

    elements.forEach((el,index)=>{

      /* skip jika sudah ada */
      if(el.dataset.aos) return;

      /* animasi */
      el.dataset.aos =
      aosGlobal[selector];

      /* delay smooth */
      el.dataset.aosDelay =
      Math.min(index * 80, 400);

      /* durasi lebih ringan */
      el.dataset.aosDuration =
      700;

      /* easing */
      el.dataset.aosEasing =
      "ease-out-cubic";

    });

  }

  /* =========================================
     INIT AOS
  ========================================= */

  AOS.init({

    once:true,

    offset:60,

    duration:700,

    easing:"ease-out-cubic",

    mirror:false,

    throttleDelay:99,

    debounceDelay:50,

    disable:false,

    startEvent:"DOMContentLoaded"

  });

});

/* =========================================
   REFRESH AOS
========================================= */

window.refreshAOS = ()=>{

  requestAnimationFrame(()=>{

    AOS.refresh();

  });

};