/* =========================================
   GLOBAL AOS AUTO
   SMPN 20 KONAWE SELATAN
========================================= */

window.addEventListener("load",()=>{

  /* =========================================
     AOS MAP
  ========================================= */

  const aosGlobal = {

    /* =====================================
       HERO
    ===================================== */

    ".hero h1" : "fade-up",

    ".hero p" : "fade-up",

    ".hero-btn" : "zoom-in",

    ".hero-slider" : "fade",

    ".slide" : "fade",

    /* =====================================
       TITLE
    ===================================== */

    ".section-title" : "fade-up",

    /* =====================================
       ABOUT
    ===================================== */

    ".about img" : "fade-right",

    ".about-text" : "fade-left",

    ".intro-image" : "fade-right",

    ".intro-text" : "fade-left",

    ".sambutan-wrapper img" : "fade-right",

    ".sambutan-text" : "fade-left",

    /* =====================================
       CARD
    ===================================== */

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

    /* =====================================
       GRID
    ===================================== */

    ".grid > *" : "fade-up",

    ".card-container > *" : "fade-up",

    ".berita-container > *" : "fade-up",

    ".unggulan-container > *" : "zoom-in-up",

    ".fasilitas-container > *" : "fade-up",

    ".team > *" : "zoom-in",

    ".stats > *" : "zoom-in",

    ".gallery > *" : "zoom-in",

    ".news-container > *" : "fade-up",

    ".struktur-container > *" : "zoom-in-up",

    ".jabatan-bawah > *" : "zoom-in-up",

    ".video-wrapper" : "zoom-in",

    /* =====================================
       TIMELINE
    ===================================== */

    ".timeline-item:nth-child(odd)" : "fade-right",

    ".timeline-item:nth-child(even)" : "fade-left",

    ".timeline-content" : "fade-up",

    /* =====================================
       CONTACT
    ===================================== */

    ".contact-info p" : "fade-up",

    ".contact-box" : "fade-up",

    ".contact-form" : "fade-left",

    ".contact-map" : "fade-right",

    /* =====================================
       TABLE
    ===================================== */

    "table" : "fade-up",

    ".table-responsive" : "fade-up",

    /* =====================================
       BUTTON
    ===================================== */

    ".btn" : "fade-up",

    ".btn-baca" : "fade-up",

    ".login-btn" : "fade-up",

    /* =====================================
       FORM
    ===================================== */

    "form" : "fade-up",

    "input" : "fade-up",

    "textarea" : "fade-up",

    "select" : "fade-up"

  };

  /* =========================================
     AUTO GENERATE
  ========================================= */

  Object.entries(aosGlobal).forEach(

    ([selector,animation])=>{

      document
      .querySelectorAll(selector)
      .forEach((el,index)=>{

        /* SKIP */

        if(el.dataset.aos) return;

        /* SET ANIMATION */

        el.dataset.aos =
        animation;

        /* =================================
           HERO DELAY
        ================================= */

        if(selector === ".hero h1"){

          el.dataset.aosDelay = 200;

        }

        else if(selector === ".hero p"){

          el.dataset.aosDelay = 500;

        }

        else if(selector === ".hero-btn"){

          el.dataset.aosDelay = 800;

        }

        /* =================================
           DEFAULT DELAY
        ================================= */

        else{

          el.dataset.aosDelay =
          Math.min(index * 80,400);

        }

        /* DURATION */

        el.dataset.aosDuration =
        1000;

        /* EASING */

        el.dataset.aosEasing =
        "ease-out-cubic";

      });

    }

  );

  /* =========================================
     INIT
  ========================================= */

  AOS.init({

    once:true,

    offset:70,

    duration:1000,

    easing:"ease-out-cubic",

    mirror:false

  });

  /* =========================================
     REFRESH
  ========================================= */

  setTimeout(()=>{

    AOS.refreshHard();

  },500);

});

/* =========================================
   REFRESH AOS
========================================= */

window.refreshAOS = ()=>{

  setTimeout(()=>{

    AOS.refreshHard();

  },300);

};