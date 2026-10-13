"use strict";

/* =====================================================
   HOMEWORK 3 - RESILIENT EVENT HUB

   - Vanilla JavaScript ES6+
   - No inline event handlers, no innerHTML
   ===================================================== */

(() => {
  /* ---------------------------------------------------
     SLICE 1: DRIFT-FREE COUNTDOWN ENGINE
     Each tick recomputes from Date.now(), so a late or
     throttled timer never accumulates error.
     --------------------------------------------------- */

  const MS = { second: 1000, minute: 60000, hour: 3600000, day: 86400000 };

  const startTime = document.querySelector("#event-start");
  const countdown = document.querySelector(".countdown");
  const countdownNote = document.querySelector(".countdown-note");
  const units = {};
  countdown.querySelectorAll("[data-unit]").forEach((el) => {
    units[el.dataset.unit] = el;
  });

  const target = Date.parse(startTime.dateTime);
  let timerId = null;

  function splitDuration(ms) {
    return {
      days: Math.floor(ms / MS.day),
      hours: Math.floor((ms % MS.day) / MS.hour),
      minutes: Math.floor((ms % MS.hour) / MS.minute),
      seconds: Math.floor((ms % MS.minute) / MS.second),
    };
  }

  function renderCountdown(remaining) {
    // Round up to whole seconds: 00:00:00:00 appears exactly at the start time.
    const parts = splitDuration(Math.ceil(remaining / MS.second) * MS.second);
    Object.entries(parts).forEach(([unit, value]) => {
      units[unit].textContent = String(value).padStart(2, "0");
    });
  }

  function tick() {
    clearTimeout(timerId); // Only one timer chain may ever exist.
    const remaining = target - Date.now();

    if (remaining <= 0) {
      renderCountdown(0);
      countdownNote.textContent = "The event has started.";
      document.removeEventListener("visibilitychange", onVisible);
      return; // No new timer: nothing left to leak.
    }

    renderCountdown(remaining);
    // Wake exactly when the displayed second changes.
    timerId = setTimeout(tick, remaining % MS.second || MS.second);
  }

  // Background tabs throttle timers (up to 1/min); refresh as soon as visible.
  function onVisible() {
    if (document.visibilityState === "visible") tick();
  }

  if (Number.isNaN(target)) {
    console.warn("Invalid event datetime:", startTime.dateTime);
  } else {
    // dateStyle/timeStyle cannot be combined with timeZoneName (TypeError),
    // so the fields are listed one by one.
    startTime.textContent = new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(target);
    document.addEventListener("visibilitychange", onVisible);
    tick();
  }
})();
