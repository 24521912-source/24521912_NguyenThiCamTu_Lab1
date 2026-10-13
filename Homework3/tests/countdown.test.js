// Fake-clock checks for Homework3 slice 1. Usage: node tests/countdown.test.js
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const src = fs.readFileSync(process.argv[2] || path.join(__dirname, "..", "script.js"), "utf8");
const TARGET = Date.parse("2026-12-12T02:00:00Z");

function run(startRemaining, lateness = 0) {
  let now = TARGET - startRemaining;
  const timers = [];
  const docListeners = {};
  const el = (attrs = {}) => ({ dataset: attrs, textContent: "" });
  const units = ["days", "hours", "minutes", "seconds"].map((u) => el({ unit: u }));
  const note = el();
  const countdown = {
    querySelectorAll: () => units,
    nextElementSibling: note,
  };
  const startTime = { dateTime: "2026-12-12T02:00:00Z", textContent: "" };
  const ctx = {
    console,
    Intl,
    Number,
    String,
    Object,
    Date: { now: () => now, parse: Date.parse },
    setTimeout: (fn, ms) => { const t = { fn, at: now + ms + lateness }; timers.push(t); return t; },
    clearTimeout: (t) => { const i = timers.indexOf(t); if (i >= 0) timers.splice(i, 1); },
    document: {
      visibilityState: "visible",
      addEventListener: (t, fn) => (docListeners[t] = fn),
      removeEventListener: (t) => delete docListeners[t],
      querySelector: (sel) => {
        if (sel === "#event-start") return startTime;
        if (sel === ".countdown") return countdown;
        if (sel === ".countdown-note") return note;
        return { querySelector: () => ({}), addEventListener() {}, elements: { namedItem: () => ({ addEventListener() {} }) }, dataset: {} };
      },
    },
  };
  vm.runInNewContext(src, ctx);
  const shown = () => units.map((u) => u.textContent).join(":");
  // Advance the fake clock, firing timers in order; return what is shown at time `t`.
  function at(remaining) {
    const end = TARGET - remaining;
    for (;;) {
      timers.sort((a, b) => a.at - b.at);
      const t = timers[0];
      if (!t || t.at > end) break;
      timers.shift();
      now = t.at;
      t.fn();
    }
    now = end;
    return shown();
  }
  return { at, timers, note, docListeners, setNow: (r) => (now = TARGET - r) };
}

let failures = 0;
const check = (name, got, want) => {
  const ok = got === want;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}: got ${got}, want ${want}`);
};

// Remaining 2.5s, then sample just after each whole-second boundary.
const a = run(2500);
check("at 2.5s left", a.at(2500), "00:00:00:03");
check("at 1.999s left", a.at(1999), "00:00:00:02");
check("at 0.999s left", a.at(999), "00:00:00:01");
check("at 0 left", a.at(0), "00:00:00:00");
check("started note", a.note.textContent, "The event has started.");
check("no timer left after start", a.timers.length, 0);

// Timer that fires exactly on the boundary (0ms lateness) must not freeze display.
const b = run(59400);
b.at(59000); // fires exactly at boundary
check("exact-boundary tick, 58.5s left", b.at(58500), "00:00:00:59");
check("exact-boundary tick, 57.999s left", b.at(57999), "00:00:00:58");

// Long throttled tab: timers delayed 60s. Becoming visible must refresh at once.
const c = run(3600000, 60000);
c.setNow(3600000 - 30000); // 30s pass while hidden, throttled timer not fired yet
if (c.docListeners.visibilitychange) c.docListeners.visibilitychange();
check("refresh on visibilitychange", c.at(3570000), "00:00:59:30");
check("single timer chain after visibilitychange", c.timers.length, 1);

process.exitCode = failures ? 1 : 0;
