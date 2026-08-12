/* Oviedo Car Care — shared behavior: mobile nav, header shadow, scroll reveal. */
(function () {
  "use strict";

  // Mobile menu — toggle on the button; close on nav-link tap, tap/click
  // outside, or Escape (Escape returns focus to the button).
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  if (btn && nav) {
    var setMenu = function (open) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    btn.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("open")) return;
      if (!e.target.closest("#site-nav") && !e.target.closest(".menu-btn")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        btn.focus();
      }
    });
  }

  // Header shadow once scrolled
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Scroll reveal — respects prefers-reduced-motion
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var els = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach(function (el) { io.observe(el); });
})();
