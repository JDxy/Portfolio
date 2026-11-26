const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    mainNav.classList.toggle("is-open", !isOpen);
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      mainNav.classList.remove("is-open");
    }
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

const revealElements = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
}

if (window.matchMedia("(pointer: fine)").matches) {
  const glow = document.querySelector(".page-glow");
  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;
  const moveGlow = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    glow.classList.add("is-visible");
    document.body.classList.add("has-pointer");
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      document.body.style.setProperty("--glow-x", `${pointerX}px`);
      document.body.style.setProperty("--glow-y", `${pointerY}px`);
      frame = 0;
    });
  };
  window.addEventListener("pointermove", moveGlow, { passive: true });
  window.addEventListener("pointerdown", moveGlow, { passive: true });
  window.addEventListener("pointerleave", () => {
    glow.classList.remove("is-visible");
    document.body.classList.remove("has-pointer");
  });
}

const installButton = document.querySelector("#install-app");
const installDialog = document.querySelector("#install-dialog");
if (installButton && installDialog) {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (!isIOS || isStandalone) installButton.hidden = true;

  installButton.addEventListener("click", () => {
    installDialog.showModal();
  });
}

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch((error) => console.error("No se pudo registrar la aplicación sin conexión.", error));
  });
}
