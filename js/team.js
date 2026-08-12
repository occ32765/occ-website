/* Meet the Team — card reveal.
   Desktop: hover/focus previews (CSS). Click/tap toggles everywhere,
   tap outside or Esc closes. One card open at a time. */
(function () {
  "use strict";
  var cards = Array.prototype.slice.call(document.querySelectorAll(".tcard"));
  if (!cards.length) return;

  function close(card) {
    card.classList.remove("open");
    card.setAttribute("aria-expanded", "false");
  }
  function closeAll(except) {
    cards.forEach(function (c) { if (c !== except) close(c); });
  }

  cards.forEach(function (card) {
    card.setAttribute("aria-expanded", "false");
    card.addEventListener("click", function () {
      var opening = !card.classList.contains("open");
      closeAll(card);
      card.classList.toggle("open", opening);
      card.setAttribute("aria-expanded", String(opening));
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".tcard")) closeAll(null);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll(null);
  });
})();
