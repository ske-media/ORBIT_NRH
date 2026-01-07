/* Golden Sweet Creations — interactions (menu, carousel, newsletter) */

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
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
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

initYear();
initMobileMenu();
initCarousel();
initNewsletter();

