const langData = {
  GR: {
    // --- Πλοήγηση ---
    navHome: "ΑΡΧΙΚΗ",
    navGallery: "GALLERY",
    navAbout: "ΣΧΕΤΙΚΑ",
    navContact: "ΕΠΙΚΟΙΝΩΝΙΑ",

    // --- Αρχική σελίδα ---
    heroTitle: "Καλωσόρισες",
    heroSubtitle: "Δημιουργικά οπτικά, τέχνη και έμπνευση.",
    heroBtn: "Δες το Gallery",
    galleryTitle: "Gallery",
    galleryEmpty: "Δεν βρέθηκαν εικόνες στο Drive.",
    galleryError: "Σφάλμα κατά τη φόρτωση των εικόνων από το Google Drive.",

    // --- About σελίδα ---
    aboutTitle: "Σχετικά",
    aboutSubtitle: "Η τέχνη είναι τρόπος έκφρασης, παρατήρησης και σύνδεσης.",
    aboutParagraph1: "Από τη ζωγραφική και τη φωτογραφία, έως την ψηφιακή τέχνη, δημιουργώ έργα που αντικατοπτρίζουν την έμπνευση και την αισθητική μου.",
    aboutParagraph2: "Πιστεύω πως κάθε έργο αφηγείται μια ιστορία – άλλοτε δυναμικά, άλλοτε με σιωπή, πάντα με συναίσθημα.",
    aboutBtn: "Εξερεύνησε το έργο μου",

    // --- Επικοινωνία ---
    contactTitle: "Επικοινωνία",
    contactSubtitle: "Μη διστάσεις να επικοινωνήσεις για συνεργασία ή απορίες σχετικά με το έργο μου.",
    contactHeading: "Ας μιλήσουμε.",
    contactText: "Ένα μήνυμα μπορεί να γίνει η αρχή μιας δημιουργικής συνεργασίας.",
    formFirstName: "Όνομα",
    formLastName: "Επώνυμο",
    formEmail: "Email",
    formMessage: "Μήνυμα",
    formButton: "Αποστολή",

    // --- Footer ---
    footerRights: "Όλα τα δικαιώματα διατηρούνται.",
    footerCreatedBy: "Created by"
  },

  EN: {
    // --- Navigation ---
    navHome: "HOME",
    navGallery: "GALLERY",
    navAbout: "ABOUT",
    navContact: "CONTACT",

    // --- Home ---
    heroTitle: "Welcome",
    heroSubtitle: "Creative visuals, art and inspiration.",
    heroBtn: "View Gallery",
    galleryTitle: "Gallery",
    galleryEmpty: "No images found in Drive.",
    galleryError: "Error loading images from Google Drive.",

    // --- About page ---
    aboutTitle: "About",
    aboutSubtitle: "Art is a form of expression, observation, and connection.",
    aboutParagraph1: "From painting and photography to digital art, I create works that reflect my inspiration and aesthetics.",
    aboutParagraph2: "I believe that every piece tells a story – sometimes boldly, sometimes silently, always with emotion.",
    aboutBtn: "Explore my work",

    // --- Contact ---
    contactTitle: "Contact",
    contactSubtitle: "Don’t hesitate to reach out for collaborations or questions about my work.",
    contactHeading: "Let's talk.",
    contactText: "A message can be the start of a creative collaboration.",
    formFirstName: "First Name",
    formLastName: "Last Name",
    formEmail: "Email",
    formMessage: "Message",
    formButton: "Send",

    // --- Footer ---
    footerRights: "All rights reserved.",
    footerCreatedBy: "Created by"
  }
};

// === Gallery Zoom Effect ===
function animateGallery() {
  const images = document.querySelectorAll('.gallery-grid img');
  if (!images.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const img = entry.target;
        if (entry.isIntersecting) {
          const delay = Math.random() * 200;
          img.style.transitionDelay = `${delay}ms`;
          img.classList.add('visible');
        } else {
          img.classList.remove('visible');
          img.style.transitionDelay = '0ms';
        }
      });
    },
    { threshold: 0.15 }
  );

  images.forEach(img => {
    img.classList.remove('visible');
    observer.observe(img);

    const rect = img.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const delay = Math.random() * 200;
      img.style.transitionDelay = `${delay}ms`;
      img.classList.add('visible');
    }
  });
}

// === GOOGLE DRIVE GALLERY (τελική σταθερή έκδοση με thumbnailLink) ===
async function loadGalleryFromDrive() {
  const folderId = "1TRxcwdwln6c_KEQY5dq3uHFXViHj0EA7";
  const apiKey = "AIzaSyBckV-J09OMEWB8bFEadmEwLh3nYEnT7vE";

  try {
   const res = await fetch(
  `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+(mimeType+contains+'image/')&fields=files(id,name,mimeType,thumbnailLink)&key=${apiKey}`
);
const data = await res.json();

const gallery = document.querySelector(".gallery-grid");
if (!data.files || data.files.length === 0) {
  gallery.innerHTML = `<p>${langData[currentLang].galleryEmpty}</p>`;
  return;
}

gallery.innerHTML = data.files.map(f => {
  const imgUrl = `https://lh3.googleusercontent.com/d/${f.id}=s0`;
  return `
    <figure>
      <img 
        src="${imgUrl}" 
        alt="${f.name}" 
        loading="lazy"
      >
    </figure>
  `;
}).join("");

    animateGallery();
  } catch (err) {
    console.error("Σφάλμα φόρτωσης εικόνων:", err);
    const gallery = document.querySelector(".gallery-grid");
    if (gallery)
      gallery.innerHTML = "<p>Σφάλμα κατά τη φόρτωση των εικόνων από το Google Drive.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  const siteNav = document.querySelector(".site-nav");
  const logoLink = document.querySelector('.logo[data-page="home"]');
  const menuToggle = document.getElementById("menuToggle");
  const fullscreenNav = document.getElementById("fullscreenNav");
  const langOptions = document.querySelectorAll(".lang-option");
  const initialHomeHTML = main.innerHTML;

  // === Δημιουργία underline μόνο για desktop ===
  const underline = document.createElement("div");
  underline.classList.add("nav-underline");
  if (siteNav) siteNav.appendChild(underline);

  function moveUnderlineTo(el) {
    if (!el || window.innerWidth <= 900) return;
    const rect = el.getBoundingClientRect();
    const navRect = siteNav.getBoundingClientRect();
    underline.style.width = `${rect.width}px`;
    underline.style.left = `${rect.left - navRect.left}px`;
  }

  // === Έλεγχος αν είναι κινητό ===
  function isMobile() {
    return window.innerWidth <= 900 || /Mobi|Android/i.test(navigator.userAgent);
  }

  // === Καθάρισμα αρχικής κατάστασης burger ===
  if (menuToggle) menuToggle.classList.remove("active");
  if (fullscreenNav) fullscreenNav.classList.remove("active");

  // === Γλώσσα ===
  let currentLang = "EN";
  updateLanguage(currentLang);

  langOptions.forEach(option => {
    option.addEventListener("click", () => {
      const selectedLang = option.dataset.lang;
      if (selectedLang === currentLang) return;
      currentLang = selectedLang;
      langOptions.forEach(o => o.classList.remove("active"));
      option.classList.add("active");
      updateLanguage(currentLang);

      
      const activeLink = document.querySelector(".site-nav a.active");
      if (activeLink) setTimeout(() => moveUnderlineTo(activeLink), 100);
    });
  });

  // === PARALLAX ===
  function setupParallax() {
    const heroes = document.querySelectorAll('.home-section, .gallery-section, .about-hero, .contact-hero');
    if (!heroes.length) return;

    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mqReduced.matches) return;

    let ticking = false;

    function applyParallax() {
      const offset = window.scrollY * 0.25;
      heroes.forEach(h => {
        h.style.backgroundPosition = `center -${offset}px`;
      });
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(applyParallax);
    }

    applyParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // === Απαγόρευση δεξιού κλικ / drag σε εικόνες ===
  document.addEventListener("contextmenu", e => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });
  document.addEventListener("dragstart", e => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });

  // === Fade-in heroes ===
  function fadeInHeroes() {
    const heroes = document.querySelectorAll(".home-section, .gallery-section, .about-hero, .contact-hero");
    heroes.forEach(el => {
      el.style.transition = "none";
      el.style.opacity = "0";
    });
    requestAnimationFrame(() => {
      heroes.forEach(el => void el.offsetHeight);
      requestAnimationFrame(() => {
        heroes.forEach(el => {
          el.style.transition = "opacity 1000ms ease";
          el.style.opacity = "1";
        });
      });
    });
  }

  // === Εκκίνηση αρχικού animation + parallax ===
  fadeInHeroes();
  setupParallax();
  moveUnderlineTo(document.querySelector('.site-nav a[data-page="home"]'));
  animateGallery();

  // === Φόρτωση gallery από Google Drive ===
  if (document.querySelector(".gallery-grid")) {
    loadGalleryFromDrive();
  }

  // === Ενιαία διαχείριση πλοήγησης ===
  function handleNavLinkClick(link) {
    link.addEventListener("click", async e => {
      e.preventDefault();
      const page = link.dataset.page;

      if (menuToggle && fullscreenNav) {
        menuToggle.classList.remove("active");
        fullscreenNav.classList.remove("active");
      }

      const navLinks = document.querySelectorAll(".site-nav a[data-page]");
      if (!isMobile()) {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        moveUnderlineTo(link);
      }

      const currentlyOnHome = document.querySelector(".home-section") !== null;

      if (page === "home") {
        if (!currentlyOnHome) {
          main.innerHTML = initialHomeHTML;
          updateLanguage(currentLang);
          fadeInHeroes();
          setupParallax();
          animateGallery();
          if (document.querySelector(".gallery-grid")) {
            loadGalleryFromDrive();
          }  
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (page === "gallery") {
        if (currentlyOnHome) {
          const target = document.getElementById("gallery");
          if (target) target.scrollIntoView({ behavior: "smooth" });
          animateGallery();
          if (document.querySelector(".gallery-grid")) {
            loadGalleryFromDrive();
          }  
          return;
        } else {
          main.innerHTML = initialHomeHTML;
          updateLanguage(currentLang);
          fadeInHeroes();
          setupParallax();
          animateGallery();
          if (document.querySelector(".gallery-grid")) {
            loadGalleryFromDrive();
          }  
          const target = document.getElementById("gallery");
          setTimeout(() => {
            if (target) target.scrollIntoView({ behavior: "smooth" });
          }, 600);
          return;
        }
      }

      try {
        main.innerHTML = '<div class="loading">Φόρτωση...</div>';
        const res = await fetch(`${page}.html`, { cache: "no-store" });
        if (!res.ok) throw new Error("Σφάλμα φόρτωσης αρχείου");
        const html = await res.text();
        main.innerHTML = html;
        updateLanguage(currentLang);
        window.scrollTo({ top: 0, behavior: "smooth" });
        fadeInHeroes();
        setupParallax();
        animateGallery();
      } catch (err) {
        console.error(err);
        main.innerHTML = "<p>Σφάλμα φόρτωσης περιεχομένου.</p>";
      }
    });
  }

  document.querySelectorAll("[data-page]").forEach(link => {
    handleNavLinkClick(link);
  });

  if (logoLink) {
    logoLink.addEventListener("click", e => {
      e.preventDefault();
      main.innerHTML = initialHomeHTML;
      updateLanguage(currentLang);
      fadeInHeroes();
      setupParallax();
      animateGallery();
      if (document.querySelector(".gallery-grid")) {
  loadGalleryFromDrive();
}
      const homeLink = document.querySelector('.site-nav a[data-page="home"]');
      document.querySelectorAll(".site-nav a[data-page]").forEach(l => l.classList.remove("active"));
      homeLink.classList.add("active");
      moveUnderlineTo(homeLink);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (menuToggle && fullscreenNav) {
        menuToggle.classList.remove("active");
        fullscreenNav.classList.remove("active");
      }
    });
  }

  if (menuToggle && fullscreenNav) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      fullscreenNav.classList.toggle("active");
    });

    fullscreenNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        fullscreenNav.classList.remove("active");
      });
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && fullscreenNav) {
      fullscreenNav.classList.remove("active");
      if (menuToggle) menuToggle.classList.remove("active");
    }
  });
});

// === Συνάρτηση ενημέρωσης γλώσσας ===
function updateLanguage(lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (langData[lang] && langData[lang][key]) {
      el.textContent = langData[lang][key];
    }
  });
}
