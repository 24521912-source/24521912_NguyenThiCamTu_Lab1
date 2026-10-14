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
      countdownNote.textContent = "The final pitch is live!";
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


/* ---------------------------------------------------
   SLICE 2: REGISTRATION FORM STATE MACHINE
   idle -> submitting -> success | error
   CSS reads data-state; JS only switches it.
   --------------------------------------------------- */

(() => {
  const MOCK_LATENCY_MS = 1200;
  const registeredEmails = new Set();

  // Mock API (no backend in this lab). Offline: DevTools > Network > Offline.
  function registerAttendee({ email }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!navigator.onLine) {
          reject(new Error("You are offline. Check your connection and try again."));
        } else if (registeredEmails.has(email)) {
          reject(new Error("This email has already registered a team."));
        } else {
          registeredEmails.add(email);
          resolve();
        }
      }, MOCK_LATENCY_MS);
    });
  }

  const form = document.querySelector("#register-form");
  const nameField = form.elements.namedItem("name");
  const emailField = form.elements.namedItem("email");
  const submitButton = form.querySelector('button[type="submit"]');
  const statusText = form.querySelector(".form-status");

  function setFormState(state, message) {
    const busy = state === "submitting";

    form.dataset.state = state;
    form.setAttribute("aria-busy", busy);
    submitButton.disabled = busy;
    statusText.textContent = message; // textContent: user text is never parsed as HTML
  }


  /* ---------------------------------------------------
     SLICE 3: DOUBLE-SUBMIT GUARD & SANITIZATION
     --------------------------------------------------- */

  // Control characters become spaces, whitespace runs collapse, length is capped.
  // input.maxLength is -1 when the attribute is missing: slice(0, -1) would eat a char.
  function sanitizeText(value, maxLength) {
    return value
      .replace(/\p{Cc}/gu, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength > 0 ? maxLength : undefined);
  }

  nameField.addEventListener("input", () => nameField.setCustomValidity(""));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.state === "submitting") return; // Double-submit guard

    // Sanitize first, then validate what will actually be sent.
    const name = sanitizeText(nameField.value, nameField.maxLength);
    const email = sanitizeText(emailField.value, emailField.maxLength).toLowerCase();
    nameField.value = name;
    emailField.value = email;

    nameField.setCustomValidity(
      name.length < 2 ? "Please enter your full name (at least 2 characters)." : ""
    );
    if (!form.reportValidity()) return;

    setFormState("submitting", "Submitting your team registration...");

    try {
      await registerAttendee({ name, email });
      setFormState("success", `Thanks, ${name}! Your team is registered. Next steps are on their way to ${email}.`);
      form.reset();
    } catch (error) {
      setFormState("error", error.message);
    }
  });
})();
