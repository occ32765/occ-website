/* Oviedo Car Care: holiday hours bar + holiday rows in the hours lists.

   HOW TO USE
   Each entry in SCHEDULE turns itself on at `start` and off after `end`
   (both dates inclusive, visitor's local date). Nothing to swap by hand:
   Thanksgiving runs, the site goes back to normal, then Christmas and
   New Year's turns on by itself.

   To change dates or wording, edit the entry below and push. That's it.
   To add next year, copy an entry and change the dates.

   PREVIEW any date by adding ?holiday=YYYY-MM-DD to a page URL, e.g.
   https://oviedocarcare.com/?holiday=2026-12-15
*/
(function () {
  "use strict";

  var SCHEDULE = [
    {
      start: "2026-11-12",
      end: "2026-11-27",
      theme: "amber",
      tag: "Thanksgiving Hours",
      message: "<b>Closed Thu, Nov 26 &amp; Fri, Nov 27.</b> Back Monday, Nov 30 at 7:30 AM.",
      link: { href: "schedule.html", lead: "Traveling?", text: "Drop it off ahead" },
      rows: [["Nov 26 &amp; 27", "Closed"]]
    },
    {
      start: "2026-12-10",
      end: "2027-01-01",
      theme: "red",
      tag: "Happy Holidays",
      message: "<b>Closed Dec 24 &amp; 25 and Dec 31 &amp; Jan 1.</b> Regular hours all other weekdays.",
      link: { href: "schedule.html", lead: "Traveling?", text: "Drop it off ahead" },
      rows: [["Dec 24 &amp; 25", "Closed"], ["Dec 31 &amp; Jan 1", "Closed"]]
    }
  ];

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  var today;
  var preview = /[?&]holiday=(\d{4}-\d{2}-\d{2})/.exec(location.search);
  if (preview) {
    today = preview[1];
  } else {
    var d = new Date();
    today = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  var active = null;
  for (var i = 0; i < SCHEDULE.length; i++) {
    if (today >= SCHEDULE[i].start && today <= SCHEDULE[i].end) { active = SCHEDULE[i]; break; }
  }
  if (!active) return;

  // 1. The bar. This script sits right before the header, so the bar is
  //    in place before anything below it renders (no layout shift).
  var bar = document.createElement("div");
  bar.className = "holiday-bar is-" + active.theme;
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "Holiday hours");
  bar.innerHTML =
    '<div class="holiday-in">' +
      '<span class="holiday-tag">' + active.tag + '</span>' +
      '<p class="holiday-msg">' + active.message + '</p>' +
      (active.link ? '<a class="holiday-link" href="' + active.link.href + '">' + (active.link.lead ? '<span class="holiday-lead">' + active.link.lead + '&nbsp;</span>' : '') + active.link.text + '&nbsp;<span aria-hidden="true">&rarr;</span></a>' : '') +
    '</div>';
  var me = document.currentScript;
  if (me && me.parentNode) {
    me.parentNode.insertBefore(bar, me.nextSibling);
  } else {
    document.body.insertBefore(bar, document.body.firstChild);
  }

  // 2. Holiday rows in the hours lists (homepage + Find Us).
  document.addEventListener("DOMContentLoaded", function () {
    var lists = document.querySelectorAll("ul.hours");
    for (var j = 0; j < lists.length; j++) {
      for (var k = 0; k < active.rows.length; k++) {
        var li = document.createElement("li");
        li.className = "holiday-row";
        li.innerHTML = "<span>" + active.rows[k][0] + '</span><span class="closed">' + active.rows[k][1] + "</span>";
        lists[j].appendChild(li);
      }
    }
  });
})();
