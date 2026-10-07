/* =========================================================
   CONFIGURACIÓN
   Todo lo que se puede cambiar sin tocar el HTML está aquí.
   ========================================================= */
const CONFIG = {
  // Enlace de compra/reserva de cada función.
  // Si se deja vacío (""), el botón muestra "Entradas próximamente".
  tickets: {
    "11-dec-1730": "",
    "12-dec-1700": "",
    "12-dec-1900": "",
    "13-dec-1130": ""
  },

  // Fechas y horarios. "id" debe coincidir con una clave de "tickets".
  shows: [
    { id: "11-dec-1730", day: "11", month: "diciembre", weekday: "viernes", time: "17:30" },
    { id: "12-dec-1700", day: "12", month: "diciembre", weekday: "sábado",  time: "17:00" },
    { id: "12-dec-1900", day: "12", month: "diciembre", weekday: "sábado",  time: "19:00" },
    { id: "13-dec-1130", day: "13", month: "diciembre", weekday: "domingo", time: "11:30" }
  ],

  contactEmail: "viajeparis2027@gmail.com",

  // Galería: ponlo a true cuando haya fotografías autorizadas por el colegio.
  galleryEnabled: false,
  // Ejemplo: { src: "assets/images/galeria/foto-1.webp", alt: "Descripción de la foto" }
  galleryPhotos: []
};

/* ========================================================= */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderShows() {
  const lists = document.querySelectorAll("[data-shows]");

  lists.forEach((list) => {
    list.innerHTML = CONFIG.shows.map((show, index) => {
      const link = (CONFIG.tickets[show.id] || "").trim();
      const when = `${show.weekday} ${show.day} de ${show.month} a las ${show.time}`;

      const action = link
        ? `<a class="btn btn--ticket" href="${link}" target="_blank" rel="noopener" aria-label="Conseguir entrada para el ${when} (se abre en otra pestaña)">Conseguir entrada</a>`
        : `<span class="btn btn--ticket btn--soon" role="note" aria-label="Entradas próximamente para el ${when}">Entradas próximamente</span>`;

      return `
        <li class="ticket reveal" style="--i:${index}">
          <div class="ticket__stub">
            <span class="ticket__number">Función ${index + 1}</span>
            <span class="ticket__weekday">${show.weekday}</span>
            <span class="ticket__day">${show.day}</span>
            <span class="ticket__month">${show.month}</span>
          </div>
          <div class="ticket__body">
            <p class="ticket__time"><span class="visually-hidden">Hora: </span>${show.time}<small> h</small></p>
            <p class="ticket__place">Gimnasio · CEIP Reyes Católicos</p>
            ${action}
          </div>
        </li>`;
    }).join("");
  });
}

function setupMainCta() {
  // Si hay un único enlace de entradas, el CTA grande lleva directamente a él.
  const links = Object.values(CONFIG.tickets).filter((l) => l.trim());
  const cta = document.querySelector("[data-main-cta]");
  if (!cta) return;

  const uniqueLinks = [...new Set(links)];
  if (uniqueLinks.length === 1 && links.length === CONFIG.shows.length) {
    cta.href = uniqueLinks[0];
    cta.target = "_blank";
    cta.rel = "noopener";
  } else {
    cta.addEventListener("click", () => {
      // Mueve el foco a la lista para quien navega con teclado
      setTimeout(() => document.getElementById("entradas-funciones")?.focus({ preventScroll: true }), 400);
    });
  }
}

function setupEmail() {
  document.querySelectorAll("[data-contact-email]").forEach((el) => {
    el.href = `mailto:${CONFIG.contactEmail}`;
    el.textContent = CONFIG.contactEmail;
  });
}

function setupGallery() {
  const section = document.querySelector("[data-gallery]");
  const grid = document.querySelector("[data-gallery-grid]");
  if (!section || !grid || !CONFIG.galleryEnabled || CONFIG.galleryPhotos.length === 0) return;

  grid.innerHTML = CONFIG.galleryPhotos.map((photo) => `
    <li class="gallery__item reveal">
      <img src="${photo.src}" alt="${photo.alt || ""}" loading="lazy" decoding="async">
    </li>`).join("");
  section.hidden = false;
}

function setupNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });

  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      close();
      toggle.focus();
    }
  });

  // Cabecera con fondo al hacer scroll
  const header = document.querySelector("[data-header]");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupStickyCta() {
  const cta = document.querySelector("[data-sticky-cta]");
  const hero = document.getElementById("inicio");
  const tickets = document.getElementById("entradas");
  if (!cta || !hero || !tickets || !("IntersectionObserver" in window)) return;

  let heroVisible = true;
  let ticketsVisible = false;
  const update = () => cta.classList.toggle("is-visible", !heroVisible && !ticketsVisible);

  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; update(); }, { threshold: 0.15 }).observe(hero);
  new IntersectionObserver(([entry]) => { ticketsVisible = entry.isIntersecting; update(); }, { threshold: 0.05 }).observe(tickets);
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  items.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  renderShows();
  setupMainCta();
  setupEmail();
  setupGallery();
  setupNav();
  setupStickyCta();
  setupReveal();
});
