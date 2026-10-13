"use strict";

/* =====================================================
   HOMEWORK 2 - DRUM KIT ENGINE

   - Vanilla JavaScript ES6+
   - Keys and sound paths come from HTML data attributes
   - No inline event handlers, no innerHTML
   ===================================================== */

(() => {
  /* ---------------------------------------------------
     01. POLYPHONIC AUDIO ENGINE (T-03)
     Knows only file paths. A new Audio per hit lets
     sounds overlap instead of restarting each other.
     --------------------------------------------------- */

  const activeSounds = new Set();

  function playSound(src) {
    const audio = new Audio(src);

    activeSounds.add(audio);
    audio.addEventListener("ended", () => activeSounds.delete(audio));
    audio.play().catch(() => activeSounds.delete(audio));
  }

  function stopAll() {
    activeSounds.forEach((audio) => audio.pause());
    activeSounds.clear();
  }


  /* ---------------------------------------------------
     02. PAD TRIGGER
     --------------------------------------------------- */

  const PAD_FLASH_MS = 100;
  const pads = document.querySelectorAll(".drum-pad");

  function triggerPad(pad) {
    playSound(pad.dataset.sound);
    pad.classList.add("active");
    setTimeout(() => pad.classList.remove("active"), PAD_FLASH_MS);
  }

  pads.forEach((pad) => {
    pad.addEventListener("click", () => triggerPad(pad));
  });


  /* ---------------------------------------------------
     03. KEYBOARD LISTENER (T-04)
     Map lookup instead of a selector string, so keys
     like " or \ can never break querySelector.
     --------------------------------------------------- */

  const padsByKey = new Map(
    [...pads].map((pad) => [pad.dataset.key, pad])
  );

  window.addEventListener("keydown", (event) => {
    if (event.repeat) return; // Held key: play once, no audio flood
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    const pad = padsByKey.get(event.key.toLowerCase());
    if (pad) triggerPad(pad);
  });
})();
