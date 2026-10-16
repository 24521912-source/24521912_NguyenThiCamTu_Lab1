// Stub-DOM checks for Homework3 slices 2 & 3. Usage: node tests/form.test.js
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const src = fs.readFileSync(process.argv[2] || path.join(__dirname, "..", "script.js"), "utf8");

class HTMLInputElement {}

function field(name, rules) {
  const listeners = {};
  const input = {
    name, value: "", custom: "", ...rules, attrs: {},
    setCustomValidity(m) { this.custom = m; },
    addEventListener: (t, fn) => ((listeners[t] ||= []).push(fn)),
    fire: (t) => (listeners[t] || []).forEach((fn) => fn({})),
    // Mirrors native rules: required = non-empty, minlength counts spaces too.
    valid() {
      if (this.custom) return false;
      if (this.required && this.value === "") return false;
      if (this.minLength && this.value.length < this.minLength) return false;
      if (this.type === "email" && this.value && !/^[^@\s]+@[^@\s]+$/.test(this.value)) return false;
      return true;
    },
    get validity() { return { valid: this.valid() }; },
    get validationMessage() { return this.valid() ? "" : this.custom || "Please fill out this field."; },
  };
  return Object.setPrototypeOf(input, HTMLInputElement.prototype);
}

const nameField = field("name", { required: true, minLength: 2, maxLength: 80 });
const emailField = field("email", { required: true, type: "email", maxLength: 254 });
const statusText = { textContent: "" };
const submitButton = { disabled: false, textContent: "Register" };
const formListeners = {};
const form = {
  dataset: { state: "idle" },
  attrs: {},
  elements: {
    name: nameField, email: emailField,
    namedItem: (n) => ({ name: nameField, email: emailField })[n],
    *[Symbol.iterator]() { yield nameField; yield emailField; },
  },
  addEventListener: (t, fn) => ((formListeners[t] ||= []).push(fn)),
  querySelector: (sel) => (sel.includes("button") ? submitButton : statusText),
  reportValidity: () => nameField.valid() && emailField.valid(),
  checkValidity: () => nameField.valid() && emailField.valid(),
  reset() { nameField.value = ""; emailField.value = ""; },
  setAttribute(k, v) { this.attrs[k] = String(v); },
  submit: () => (formListeners.submit || []).map((fn) => fn({ preventDefault() {} })),
};

let calls = 0;
const timers = [];
class FormData {
  constructor(f) { this.f = f; }
  get(n) { return this.f.elements[n].value; }
}
const ctx = {
  console, Promise, Error, Set, Map, String, Object, Number, Intl, FormData, HTMLInputElement,
  navigator: { onLine: true },
  Date,
  setTimeout: (fn) => { calls++; timers.push(fn); return timers.length; },
  clearTimeout() {},
  document: {
    visibilityState: "visible",
    addEventListener() {}, removeEventListener() {},
    querySelector: (sel) => {
      if (sel === "#register-form") return form;
      if (sel === "#event-start") return { dateTime: "invalid" };
      return { querySelectorAll: () => [], textContent: "" };
    },
  },
};
ctx.console = { ...console, warn() {} }; // countdown slice warns on the stub date
vm.runInNewContext(src, ctx);

const flush = async () => {
  await new Promise((r) => setImmediate(r));
  while (timers.length) timers.shift()();
  await new Promise((r) => setImmediate(r));
};

let failures = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
};

(async () => {
  // State machine: idle -> submitting -> success
  nameField.value = "Cam Tu"; emailField.value = "tu@uit.edu.vn";
  form.submit();
  check("submitting state", form.dataset.state, "submitting");
  await flush();
  check("success state", form.dataset.state, "success");
  check("success message", statusText.textContent, "Thanks, Cam Tu! Your team is registered. Next steps are on their way to tu@uit.edu.vn.");

  // Error: duplicate email
  nameField.value = "Cam Tu"; emailField.value = "tu@uit.edu.vn";
  form.submit(); await flush();
  check("duplicate -> error", form.dataset.state, "error");

  // Error: offline, then retry succeeds
  ctx.navigator.onLine = false;
  nameField.value = "An"; emailField.value = "an@uit.edu.vn";
  form.submit(); await flush();
  check("offline -> error", [form.dataset.state, statusText.textContent.startsWith("You are offline")], ["error", true]);
  ctx.navigator.onLine = true;
  form.submit(); await flush();
  check("retry after error -> success", form.dataset.state, "success");

  // --- Slice 3 expectations ---
  // Double submit: 10 rapid submits -> 1 request
  calls = 0;
  nameField.value = "Binh"; emailField.value = "binh@uit.edu.vn";
  for (let i = 0; i < 10; i++) form.submit();
  check("10 rapid submits -> 1 request", calls, 1);
  check("button disabled while submitting", submitButton.disabled, true);
  check("aria-busy while submitting", form.attrs["aria-busy"], "true");
  await flush();
  check("button re-enabled after", submitButton.disabled, false);

  // Whitespace-only name rejected
  calls = 0;
  nameField.value = "     "; emailField.value = "space@uit.edu.vn";
  form.submit(); await flush();
  check("whitespace name -> no request", calls, 0);
  check("whitespace name -> error state", [form.dataset.state, statusText.textContent],
    ["error", "Please enter your full name (at least 2 characters)."]);
  nameField.custom = ""; // simulate user editing (input listener clears it)
  nameField.fire("input");

  // Same email in other case = duplicate
  nameField.value = "Cam Tu"; emailField.value = "  TU@UIT.EDU.VN ";
  form.submit(); await flush();
  check("email normalized -> duplicate", form.dataset.state, "error");

  // XSS payload stays plain text, whitespace collapsed
  const payload = "<img src=x onerror=alert(1)>";
  nameField.value = `  ${payload}\u0000\n  Jr  `; emailField.value = "x@uit.edu.vn";
  form.submit(); await flush();
  check("payload rendered as text", statusText.textContent, `Thanks, ${payload} Jr! Your team is registered. Next steps are on their way to x@uit.edu.vn.`);

  check("no innerHTML in source", /\.innerHTML/.test(src), false);
  process.exitCode = failures ? 1 : 0;
})();
