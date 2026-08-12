/* Schedule a Drop-Off — chooser + Cal.com inline embeds.
   Flow (decided, do not redesign): the customer picks Morning or Afternoon;
   the matching Cal.com namespace mounts in the ONE branded panel below.
   embed.js loads once, on first selection. Both embeds persist after creation
   and are swapped with [hidden]. #morning / #afternoon deep links preselect.
   Embed code source of truth: content/scheduler.md. */
(function () {
  "use strict";
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".opt[data-window]"));
  var label = document.getElementById("panel-window");
  var placeholder = document.getElementById("sched-placeholder");
  var slots = {
    morning: document.getElementById("cal-morning"),
    afternoon: document.getElementById("cal-afternoon")
  };
  if (!buttons.length || !label || !slots.morning || !slots.afternoon) return;

  var LABELS = {
    morning: "Morning · 8:00 – 11:00 AM",
    afternoon: "Afternoon · 11:00 AM – 6:00 PM"
  };
  var calLoaderInjected = false;
  var inited = { morning: false, afternoon: false };

  /* Cal.com official embed loader (verbatim from content/scheduler.md) */
  function injectCalLoader() {
    if (calLoaderInjected) return;
    calLoaderInjected = true;
    (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
  }

  function initNamespace(name) {
    if (inited[name]) return;
    inited[name] = true;
    injectCalLoader();
    window.Cal("init", name, { origin: "https://app.cal.com" });
    window.Cal.config = window.Cal.config || {};
    window.Cal.config.forwardQueryParams = true;
    window.Cal.ns[name]("inline", {
      elementOrSelector: "#cal-" + name,
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
      calLink: "oviedo-car-care-56swvc/" + name
    });
    window.Cal.ns[name]("ui", { hideEventTypeDetails: false, layout: "month_view" });
    // Drop the placeholder as soon as the first embed actually mounts
    if (placeholder && !placeholder.hidden) {
      new MutationObserver(function (muts, obs) {
        if (slots[name].childElementCount > 0) {
          placeholder.hidden = true;
          obs.disconnect();
        }
      }).observe(slots[name], { childList: true });
    }
  }

  function select(name) {
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.window === name));
    });
    label.textContent = LABELS[name];
    slots.morning.hidden = name !== "morning";
    slots.afternoon.hidden = name !== "afternoon";
    if (placeholder && !placeholder.hidden && !inited[name]) {
      placeholder.textContent = "LOADING OPEN TIMES…";
    }
    initNamespace(name);
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      select(b.dataset.window);
      var panel = document.querySelector(".sched-panel");
      if (panel) {
        var r = panel.getBoundingClientRect();
        if (r.top > window.innerHeight * 0.6) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  // Deep links from the homepage preselect a window; a plain visit shows the
  // prompt state until the customer chooses (the choice is the decided flow).
  var hash = location.hash.replace("#", "");
  if (hash === "morning" || hash === "afternoon") select(hash);
})();
