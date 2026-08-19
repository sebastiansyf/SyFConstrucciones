(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("menu-toggle");
  var navLinks = document.getElementById("nav-links");

  function closeMenu() {
    navLinks.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Header: hidden over the hero, appears once scrolled past it ---------- */
  var header = document.getElementById("site-header");
  var heroSection = document.querySelector(".hero");

  if (header && heroSection) {
    var ticking = false;

    function updateHeaderVisibility() {
      var heroBottom = heroSection.getBoundingClientRect().bottom;
      header.classList.toggle("visible", heroBottom <= 0);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(updateHeaderVisibility);
          ticking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", updateHeaderVisibility, { passive: true });
    updateHeaderVisibility();
  }

  /* ---------- Active nav link on scroll (position-based, works reliably both ways) ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  if (sections.length && navAnchors.length) {
    var navTicking = false;

    function updateActiveNav() {
      var scanLine = 140; // px from top of viewport used as the reference line
      var current = sections[0];

      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= scanLine) {
          current = section;
        }
      });

      var id = current.getAttribute("id");
      navAnchors.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + id);
      });
      navTicking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!navTicking) {
          requestAnimationFrame(updateActiveNav);
          navTicking = true;
        }
      },
      { passive: true }
    );
    updateActiveNav();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
        revealObserver.observe(el);
      });
    }
  }

  /* ---------- Hero photo: subtle slow zoom (respects reduced motion) ---------- */
  var heroImg = document.querySelector(".hero-media img");
  if (heroImg && !reduceMotion) {
    heroImg.classList.add("ken-burns");
  }

  /* ---------- Contact form (no backend — friendly confirmation) ---------- */
  var form = document.getElementById("contact-form");
  var note = document.getElementById("form-note");

  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var msg = form.querySelector("#msg");

      if (!name.value.trim() || !email.value.trim() || !msg.value.trim()) {
        note.textContent = "Completá todos los campos antes de enviar.";
        note.style.color = "#f2b8b8";
        return;
      }

      // No backend connected yet — replace this block with a real submission
      // (e.g. fetch() to your email service or form endpoint) when ready.
      note.textContent = "¡Gracias! Formulario de ejemplo — conectá un servicio de envío de emails para recibir estas consultas.";
      note.style.color = "";
      form.reset();
    });
  }

  /* ---------- Portfolio lightbox ---------- */
  var slots = Array.prototype.slice.call(document.querySelectorAll(".project-slot, .render-slot:not(.render-slot-video)"));
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxClose = document.getElementById("lightbox-close");
  var lightboxPrev = document.getElementById("lightbox-prev");
  var lightboxNext = document.getElementById("lightbox-next");

  if (slots.length && lightbox && lightboxImg) {
    var currentIndex = 0;

    function openLightbox(index) {
      currentIndex = (index + slots.length) % slots.length;
      var slot = slots[currentIndex];
      var img = slot.querySelector("img");
      var caption = slot.querySelector("figcaption");
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "";
      lightboxCaption.textContent = caption ? caption.textContent.trim().replace(/\s+/g, " ") : "";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    slots.forEach(function (slot, i) {
      slot.style.cursor = "pointer";
      slot.addEventListener("click", function () {
        openLightbox(i);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener("click", function () { openLightbox(currentIndex - 1); });
    if (lightboxNext) lightboxNext.addEventListener("click", function () { openLightbox(currentIndex + 1); });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") openLightbox(currentIndex - 1);
      if (e.key === "ArrowRight") openLightbox(currentIndex + 1);
    });
  }
})();
