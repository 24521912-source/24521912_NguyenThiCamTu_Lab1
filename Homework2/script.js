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
    recordBeat(pad.dataset.key);
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


  /* ---------------------------------------------------
     04. FIFO BEAT RECORDER (T-05)
     States: idle -> recording -> idle, idle -> playing -> idle
     Queue items: { key, time } with time in ms since Record.
     --------------------------------------------------- */

  const recorder = {
    state: "idle",
    queue: [],
    startedAt: 0,
    timer: null,
  };

  const recordButton = document.querySelector('[data-action="record"]');
  const playButton = document.querySelector('[data-action="play"]');
  const stopButton = document.querySelector('[data-action="stop"]');
  const statusText = document.querySelector(".recorder-status");

  const STATUS = {
    idle: () => `Idle. ${recorder.queue.length} beats recorded.`,
    recording: () => "Recording. Play the pads, then press Stop.",
    playing: () => `Playing ${recorder.queue.length} beats.`,
  };

  function setState(state) {
    recorder.state = state;
    statusText.textContent = STATUS[state]();
    recordButton.setAttribute("aria-pressed", state === "recording");
    playButton.setAttribute("aria-pressed", state === "playing");
  }

  function recordBeat(key) {
    if (recorder.state !== "recording") return;

    recorder.queue.push({
      key,
      time: performance.now() - recorder.startedAt,
    });
  }

  function stopRecorder() {
    clearTimeout(recorder.timer);
    if (recorder.state === "playing") stopAll();
    setState("idle");
  }

  function startRecording() {
    stopRecorder();
    recorder.queue = [];
    recorder.startedAt = performance.now();
    setState("recording");
  }

  function playRecording() {
    stopRecorder();
    if (recorder.queue.length === 0) return;

    // Copy so the recording survives replays; shift() = FIFO dequeue.
    const pending = [...recorder.queue];
    const playbackStart = performance.now();

    // Each delay is measured from playbackStart, so timer lag never accumulates.
    function scheduleNext() {
      const delay = pending[0].time - (performance.now() - playbackStart);
      recorder.timer = setTimeout(playNext, Math.max(0, delay));
    }

    function playNext() {
      const beat = pending.shift();
      const pad = padsByKey.get(beat.key);
      if (pad) triggerPad(pad);

      if (pending.length > 0) {
        scheduleNext();
      } else {
        setState("idle");
      }
    }

    setState("playing");
    scheduleNext();
  }

  recordButton.addEventListener("click", startRecording);
  playButton.addEventListener("click", playRecording);
  stopButton.addEventListener("click", stopRecorder);

  setState("idle");
})();
