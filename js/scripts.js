// === ΠΟΛΥΓΛΩΣΣΙΚΟ ΠΕΡΙΕΧΟΜΕΝΟ ===
const langData = {
  GR: {
    navHome: "ΑΡΧΙΚΗ",
    navGallery: "GALLERY",
    navAbout: "ΣΧΕΤΙΚΑ",
    navContact: "ΕΠΙΚΟΙΝΩΝΙΑ",
    heroTitle: "Καλωσόρισες",
    heroSubtitle: "Δημιουργικά οπτικά, τέχνη και έμπνευση.",
    heroBtn: "Δες το Gallery",
    galleryTitle: "Gallery"
  },
  EN: {
    navHome: "HOME",
    navGallery: "GALLERY",
    navAbout: "ABOUT",
    navContact: "CONTACT",
    heroTitle: "Welcome",
    heroSubtitle: "Creative visuals, art and inspiration.",
    heroBtn: "View Gallery",
    galleryTitle: "Gallery"
  }
};

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

  // === PARALLAX σε ΟΛΕΣ τις συσκευές (desktop + mobile) ===
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



// === Gallery Zoom Effect: από 0.8 → 1.0 όταν γίνει ορατή ή κατά το load ===
function animateGallery() {
  const images = document.querySelectorAll('.gallery-grid img');
  if (!images.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const img = entry.target;
        if (entry.isIntersecting) {
          const delay = Math.random() * 200; // μικρή τυχαία καθυστέρηση
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

    // ✅ Αν είναι ήδη ορατή κατά το load, ενεργοποίησέ την αμέσως
    const rect = img.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const delay = Math.random() * 200;
      img.style.transitionDelay = `${delay}ms`;
      img.classList.add('visible');
    }
  });
}

  // === Εκκίνηση αρχικού animation + parallax ===
  fadeInHeroes();
  setupParallax();
  moveUnderlineTo(document.querySelector('.site-nav a[data-page="home"]'));
  animateGallery();

  // === Ενιαία διαχείριση πλοήγησης για όλα τα links ===
  function handleNavLinkClick(link) {
    link.addEventListener("click", async e => {
      e.preventDefault();
      const page = link.dataset.page;

      // Κλείνει το burger menu αν είναι ανοιχτό
      if (menuToggle && fullscreenNav) {
        menuToggle.classList.remove("active");
        fullscreenNav.classList.remove("active");
      }

      // Ενημέρωση ενεργού link στο desktop
      const navLinks = document.querySelectorAll(".site-nav a[data-page]");
      if (!isMobile()) {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        moveUnderlineTo(link);
      }

      const currentlyOnHome = document.querySelector(".home-section") !== null;

      // === HOME ===
      if (page === "home") {
        if (!currentlyOnHome) {
          main.innerHTML = initialHomeHTML;
          updateLanguage(currentLang);
          fadeInHeroes();
          setupParallax();
          animateGallery();
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // === GALLERY ===
      if (page === "gallery") {
        if (currentlyOnHome) {
          const target = document.getElementById("gallery");
          if (target) target.scrollIntoView({ behavior: "smooth" });
          animateGallery();
          return;
        } else {
          main.innerHTML = initialHomeHTML;
          updateLanguage(currentLang);
          fadeInHeroes();
          setupParallax();
          animateGallery();
          const target = document.getElementById("gallery");
          setTimeout(() => {
            if (target) target.scrollIntoView({ behavior: "smooth" });
          }, 600);
          return;
        }
      }

      // === ABOUT / CONTACT ===
      try {
        main.innerHTML = '<div class="loading">Φόρτωση...</div>';
        const res = await fetch(`${page}.html`, { cache: "no-store" });
        if (!res.ok) throw new Error("Σφάλμα φόρτωσης αρχείου");
        const html = await res.text();
        main.innerHTML = html;
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

  // ✅ Πιάνει ΟΛΑ τα links (desktop + mobile)
  document.querySelectorAll("[data-page]").forEach(link => {
    handleNavLinkClick(link);
  });

  // === Logo click -> Home ===
  if (logoLink) {
    logoLink.addEventListener("click", e => {
      e.preventDefault();
      main.innerHTML = initialHomeHTML;
      updateLanguage(currentLang);
      fadeInHeroes();
      setupParallax();
      animateGallery();
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

  // === BURGER MENU (Mobile) ===
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

  // ✅ Κλείσιμο menu όταν αλλάζει σε desktop
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
