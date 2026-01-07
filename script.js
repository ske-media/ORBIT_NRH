/* Chef Bulier — interactions (menu, carousel, newsletter) */

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function showToast(message) {
  const el = document.querySelector("[data-toast]");
  if (!el) return;

  el.textContent = message;
  el.hidden = false;

  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => {
    el.hidden = true;
  }, 3200);
}

function initYear() {
  const year = new Date().getFullYear();
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(year);
}

function initMobileMenu() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__links");
  if (!toggle || !menu) return;

  function setOpen(isOpen) {
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menu.classList.toggle("is-open", isOpen);
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  // Close menu when clicking a link (mobile)
  menu.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.tagName.toLowerCase() !== "a") return;
    setOpen(false);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // Close on resize up to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) setOpen(false);
  });
}

function initCarousel() {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const slides = $all("[data-slide]", root);
  const dots = $all("[data-dot]", root);
  const btnPrev = $("[data-prev]", root);
  const btnNext = $("[data-next]", root);

  let idx = Math.max(0, slides.findIndex((s) => s.classList.contains("is-active")));
  if (idx === -1) idx = 0;

  function render(nextIdx) {
    idx = (nextIdx + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === idx);
      d.setAttribute("aria-selected", i === idx ? "true" : "false");
    });
  }

  function next() {
    render(idx + 1);
  }

  function prev() {
    render(idx - 1);
  }

  btnNext?.addEventListener("click", next);
  btnPrev?.addEventListener("click", prev);

  dots.forEach((d, i) => d.addEventListener("click", () => render(i)));

  // Keyboard: left/right when focused inside carousel
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Auto-advance (respect reduce motion)
  if (!prefersReducedMotion()) {
    window.setInterval(() => {
      const isVisible = root.getBoundingClientRect().top < window.innerHeight && root.getBoundingClientRect().bottom > 0;
      if (isVisible) next();
    }, 7000);
  }
}

function initNewsletter() {
  const form = document.querySelector("[data-newsletter]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.querySelector("input[type='email']");
    const value = email && "value" in email ? String(email.value || "").trim() : "";
    if (!value) {
      showToast("Veuillez saisir une adresse email valide.");
      return;
    }
    if (email && "value" in email) email.value = "";
    showToast("Merci ! Vous êtes bien inscrit(e) à la newsletter.");
  });
}

// Amélioration : Header avec effet au scroll
function initScrollHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  function handleScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > scrollThreshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    
    lastScroll = currentScroll;
  }

  // Utiliser requestAnimationFrame pour de meilleures performances
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Amélioration : Lazy loading des images avec intersection observer
function initLazyLoading() {
  const images = document.querySelectorAll("img[loading='lazy']");
  if (!images.length || !("IntersectionObserver" in window)) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: "50px"
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Amélioration : Smooth scroll avec offset pour le header fixe
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
  const offset = headerHeight + 20;

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#" || !href) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });
}

// Carousel best-sellers
function initBestsellersCarousel() {
  const root = document.querySelector("[data-bestsellers-carousel]");
  if (!root) return;

  const slides = $all("[data-bestseller-slide]", root);
  const dots = $all("[data-bestseller-dot]", root);
  const btnPrev = $("[data-bestseller-prev]", root);
  const btnNext = $("[data-bestseller-next]", root);

  let idx = Math.max(0, slides.findIndex((s) => s.classList.contains("is-active")));
  if (idx === -1) idx = 0;

  function render(nextIdx) {
    idx = (nextIdx + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === idx);
      d.setAttribute("aria-selected", i === idx ? "true" : "false");
    });
  }

  function next() {
    render(idx + 1);
  }

  function prev() {
    render(idx - 1);
  }

  btnNext?.addEventListener("click", next);
  btnPrev?.addEventListener("click", prev);

  dots.forEach((d, i) => d.addEventListener("click", () => render(i)));

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  if (!prefersReducedMotion()) {
    window.setInterval(() => {
      const isVisible = root.getBoundingClientRect().top < window.innerHeight && root.getBoundingClientRect().bottom > 0;
      if (isVisible) next();
    }, 6000);
  }
}

// Scroll reveal avec Intersection Observer pour de meilleures performances
function initScrollReveal() {
  const sections = document.querySelectorAll('.section, .hero');
  if (!sections.length || !('IntersectionObserver' in window)) {
    // Fallback : afficher tout si pas de support
    sections.forEach(s => s.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionnel : ne plus observer une fois visible pour la performance
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  sections.forEach(section => observer.observe(section));
}

// Amélioration : Parallaxe subtile pour les éléments du collage
function initParallax() {
  if (prefersReducedMotion()) return;

  const parallaxElements = document.querySelectorAll('.collage__main, .collage__tile');
  if (!parallaxElements.length) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.pageYOffset;
    parallaxElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const speed = 0.1 + (index * 0.05); // Vitesse différente pour chaque élément
        const yPos = -(scrollY * speed);
        el.style.transform = `translateY(${yPos}px)`;
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

// Amélioration : Effet de souris sur les cartes (ombre dynamique)
function initMouseShadow() {
  const cards = document.querySelectorAll('.card, .media-card, .collage__main');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}

// Amélioration : Animation de chargement de page
function initPageLoad() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('loaded');
    });
  } else {
    document.body.classList.add('loaded');
  }
}

// Amélioration : Smooth scroll amélioré avec easing
function initEnhancedSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
  const offset = headerHeight + 20;

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#" || !href) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

      // Utiliser smooth scroll avec easing personnalisé
      smoothScrollTo(targetPosition, 800);
    });
  });
}

// Fonction de smooth scroll avec easing
function smoothScrollTo(target, duration) {
  const start = window.pageYOffset;
  const distance = target - start;
  let startTime = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, start + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// Amélioration : Préchargement intelligent des images critiques
function initImagePreload() {
  const criticalImages = [
    'images/patisseries/opera.png',
    'images/patisseries/macarons.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Amélioration : Gestion des erreurs d'images
function initImageErrorHandling() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      // Ajouter une classe pour un fallback visuel
      this.classList.add('image-error');
      this.alt = 'Image non disponible';
      console.warn('Image failed to load:', this.src);
    });
    
    // Ajouter une classe quand l'image est chargée
    if (img.complete) {
      img.classList.add('image-loaded');
    } else {
      img.addEventListener('load', function() {
        this.classList.add('image-loaded');
      });
    }
  });
}

// Amélioration : Détection de la connexion réseau
function initNetworkStatus() {
  if ('connection' in navigator) {
    const updateConnectionStatus = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          // Désactiver certaines animations sur connexion lente
          document.body.classList.add('slow-connection');
        }
      }
    };
    
    updateConnectionStatus();
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', () => {
      showToast('Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.');
    });
  }
}

// Amélioration : Performance monitoring (optionnel, pour le développement)
function initPerformanceMonitoring() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time:', pageLoadTime, 'ms');
      }
    });
  }
}

// Enregistrement du Service Worker pour PWA
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker enregistré avec succès:', registration.scope);
          
          // Vérifier les mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nouveau service worker disponible
                showToast('Nouvelle version disponible ! Rechargez la page.');
              }
            });
          });
        })
        .catch((error) => {
          console.log('Échec de l\'enregistrement du Service Worker:', error);
        });
    });
  }
}

// Initialisation de toutes les fonctionnalités
initYear();
initMobileMenu();
initCarousel();
initNewsletter();
initScrollHeader();
initLazyLoading();
initSmoothScroll();
initBestsellersCarousel();
initScrollReveal();
initParallax();
initMouseShadow();
initPageLoad();
initEnhancedSmoothScroll();
initImagePreload();
initImageErrorHandling();
initPerformanceMonitoring();
initServiceWorker();
initNetworkStatus();

