/* =========================================================
   CONFIGURACIÓN
   Todo lo que se puede cambiar sin tocar el HTML está aquí.
   ========================================================= */
const CONFIG = {
  // Enlace de compra/reserva de cada función.
  // Si se deja vacío (""), el botón muestra "Entradas próximamente".
  // Si las cuatro funciones usan el mismo enlace, todos los botones "Consigue tu entrada" llevan a él.
  tickets: {
    "11-dec-1730": "",
    "12-dec-1700": "",
    "12-dec-1900": "",
    "13-dec-1130": ""
  },

  // Fechas y horarios. "id" debe coincidir con una clave de "tickets".
  // Si cambias una fecha u hora, cámbiala también en index.html: en las tarjetas
  // escritas dentro de <ul data-shows> y en "startDate" del bloque JSON-LD (para Google).
  shows: [
    { id: "11-dec-1730", day: "11", month: "diciembre", weekday: "viernes", time: "17:30" },
    { id: "12-dec-1700", day: "12", month: "diciembre", weekday: "sábado",  time: "17:00" },
    { id: "12-dec-1900", day: "12", month: "diciembre", weekday: "sábado",  time: "19:00" },
    { id: "13-dec-1130", day: "13", month: "diciembre", weekday: "domingo", time: "11:30" }
  ],

  contactEmail: "viajeparis2027@gmail.com",

  // Vídeo de YouTube de una edición anterior: el código que va tras "watch?v=" y el título.
  // Si "id" se deja vacío, el botón "Ver una edición anterior" desaparece.
  video: {
    id: "IzQB-Fotho4",
    title: "Buscando la magia de Abraham"
  },

  // Galería: ponlo a true cuando haya fotografías autorizadas por el colegio.
  galleryEnabled: false,
  // Ejemplo: { src: "assets/images/galeria/foto-1.webp", alt: "Descripción de la foto" }
  galleryPhotos: []
};

/* ========================================================= */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderShows() {
  const lists = document.querySelectorAll("[data-shows]");
  // "viernes" → "vie", "diciembre" → "dic"
  const short = (word) => word.slice(0, 3);

  lists.forEach((list) => {
    list.innerHTML = CONFIG.shows.map((show, index) => {
      const link = (CONFIG.tickets[show.id] || "").trim();
      const when = `${show.weekday} ${show.day} de ${show.month} a las ${show.time}`;

      const action = link
        ? `<a class="btn btn--ticket" href="${link}" target="_blank" rel="noopener" aria-label="Consigue tu entrada para el ${when} (se abre en otra pestaña)">Consigue tu entrada</a>`
        : `<span class="btn btn--ticket btn--soon" role="note" aria-label="Entradas próximamente para el ${when}">Entradas próximamente</span>`;

      return `
        <li class="ticket reveal" style="--i:${index}">
          <div class="ticket__stub">
            <span class="ticket__number">Función ${index + 1}</span>
            <span class="ticket__weekday" aria-hidden="true">${short(show.weekday)}</span>
            <span class="ticket__day"><span class="visually-hidden">${show.weekday} </span>${show.day}</span>
            <span class="ticket__month" aria-hidden="true">${short(show.month)}</span><span class="visually-hidden"> de ${show.month}</span>
          </div>
          <div class="ticket__body">
            <p class="ticket__show">Una Navidad Diferente</p>
            <p class="ticket__time"><span class="visually-hidden">Hora: </span>${show.time}<small> h</small></p>
            <p class="ticket__price">Donativo · 5 €</p>
            ${action}
          </div>
        </li>`;
    }).join("");
  });
}

function setupMainCta() {
  // Si las cuatro funciones comparten un único enlace, los botones "Consigue tu entrada"
  // llevan directamente a él. Si no, bajan hasta la lista de funciones.
  const links = Object.values(CONFIG.tickets).map((l) => l.trim()).filter(Boolean);
  const uniqueLinks = [...new Set(links)];
  const singleLink = uniqueLinks.length === 1 && links.length === CONFIG.shows.length;
  const list = document.getElementById("lista-funciones");

  document.querySelectorAll("[data-main-cta]").forEach((cta) => {
    if (singleLink) {
      cta.href = uniqueLinks[0];
      cta.target = "_blank";
      cta.rel = "noopener";
    } else if (list) {
      // Mueve el foco a la lista para quien navega con teclado
      cta.addEventListener("click", () => {
        setTimeout(() => list.focus({ preventScroll: true }), 400);
      });
    }
  });
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

function setupVideo() {
  const open = document.querySelector("[data-video-open]");
  const dialog = document.querySelector("[data-video-dialog]");
  if (!open) return;

  const id = CONFIG.video.id.trim();
  if (!id) {
    open.hidden = true;
    return;
  }
  open.href = `https://www.youtube.com/watch?v=${id}`;

  // Sin soporte de <dialog>, el enlace abre YouTube en otra pestaña
  if (!dialog || typeof dialog.showModal !== "function") return;

  const frame = dialog.querySelector("[data-video-frame]");
  dialog.querySelector("[data-video-title]").textContent = CONFIG.video.title;

  open.addEventListener("click", (e) => {
    e.preventDefault();
    // El reproductor solo se carga al abrir, y sin cookies de seguimiento
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${CONFIG.video.title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    dialog.showModal();
  });

  dialog.querySelector("[data-video-close]").addEventListener("click", () => dialog.close());
  // Cerrar al pulsar fuera del vídeo
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  // Al cerrar (botón, Escape o fuera) se quita el reproductor para que deje de sonar
  dialog.addEventListener("close", () => { frame.innerHTML = ""; });
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

function setupActiveNav() {
  // Marca en el menú la sección que se está viendo.
  // Cada sección se asocia al enlace de su id o al de data-nav-section.
  const links = [...document.querySelectorAll("[data-nav] a[href^='#']")];
  if (!links.length || !("IntersectionObserver" in window)) return;

  const linkFor = (section) => {
    const key = section.dataset.navSection || section.id;
    return links.find((a) => a.getAttribute("href") === `#${key}`);
  };

  const setActive = (active) => {
    links.forEach((a) => {
      if (a === active) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  };

  // Una franja en el centro de la pantalla decide qué sección está "activa"
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(linkFor(entry.target));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  document.querySelectorAll("main > section").forEach((section) => observer.observe(section));
}

function setupStickyCta() {
  // Se oculta mientras se ven la portada, la lista de funciones o el bloque final
  const cta = document.querySelector("[data-sticky-cta]");
  const zones = ["inicio", "lista-funciones", "entradas"].map((id) => document.getElementById(id)).filter(Boolean);
  if (!cta || !zones.length || !("IntersectionObserver" in window)) return;

  const visible = new Set(zones.slice(0, 1));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    cta.classList.toggle("is-visible", visible.size === 0);
  }, { threshold: 0.05 });

  zones.forEach((zone) => observer.observe(zone));
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
  setupVideo();
  setupNav();
  setupActiveNav();
  setupStickyCta();
  setupReveal();
});
