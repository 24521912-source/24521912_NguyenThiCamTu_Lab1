# Homework 3 - Resilient Event Hub

## Project Goal
Build an event landing page with a drift-free countdown and a
registration form that survives slow networks, errors, double
submits, and hostile input. HTML5, CSS3, and Vanilla JavaScript only.

The event is **UIT Startup Challenge 2026** (fictional): a startup
competition for students with ideas in economics, finance, e-commerce
and business. The countdown targets the final pitch day; the form
registers a team through its team leader.

## Contracts (defined before any JavaScript)

### Countdown contract
```html
<time id="event-start" datetime="2026-12-12T02:00:00Z">...</time>
<ol class="countdown">
  <li><span data-unit="days">--</span> days</li>
  ...
</ol>
```
- The only source of truth is the `datetime` attribute: a UTC ISO 8601
  timestamp ending in `Z`. JavaScript never hard-codes the date.
- Units: `data-unit="days|hours|minutes|seconds"`.

### Form contract
```html
<form id="register-form" data-state="idle" novalidate>
```
- `data-state` is one of `idle | submitting | success | error`.
  CSS styles each state from this attribute; JS only changes the attribute.
- Fields: `name` (2-80 chars), `email` (type email, max 254 chars).
- Status messages go to one `role="status"` region.

## Slices

### Slice 1 / T-01: Drift-free countdown engine
- Parse the target once: `Date.parse(time.dateTime)` (UTC, `Z` suffix).
- Every tick recomputes `remaining = target - Date.now()`.
  No counter is decremented, so delayed timers never accumulate error.
- Next tick is scheduled for the next whole-second boundary
  (`remaining % 1000`), not a fixed `setInterval(1000)`.
- At zero: show "The final pitch is live!" and stop scheduling (no leaked timer).
- Show the start time in the visitor's own timezone with `Intl.DateTimeFormat`.

### Slice 2 / T-02: State-machine form
```
idle --submit--> submitting --resolve--> success
                            \--reject--> error
success / error --submit--> submitting
```
- Mock API `registerAttendee()` (no backend): resolves after a delay,
  rejects if the email is already registered or the browser is offline
  (DevTools > Network > Offline).
- Every state has a visible, announced message.

### Slice 3 / T-03: Double-submit prevention & sanitization
- Guard: a submit while `data-state="submitting"` is ignored.
- Submit button is disabled and the form is `aria-busy` while submitting.
- Sanitize: strip control characters, collapse whitespace, trim, cap length,
  lowercase email. Validate after sanitizing (a name of only spaces is rejected).
- Output: user text is written with `textContent` only. `innerHTML` is banned.

## Acceptance Criteria
- Countdown matches a wall clock after the tab sits in the background.
- Clicking Register 10 times fast sends one request.
- A name like `<img src=x onerror=alert(1)>` is shown as plain text.
- Works at 375px with no horizontal scroll; keyboard only.
- Zero console errors.

## Commit Plan
1. docs(spec): define event hub slices and contracts
2. feat(html): build event landing page structure
3. feat(css): style landing page and form states
4. feat(js): implement drift-free countdown engine
5. feat(js): implement registration form state machine
6. feat(js): prevent double submit and sanitize input
7. test(js): add fake-clock countdown and form state checks
8. docs(audit): record AI failure modes

### Theme change: UIT Startup Challenge
Logic and contracts above are unchanged; only content, styling and copy.
9. feat(html): rebrand landing page as student startup challenge
10. style(css): navy and gold business theme for startup challenge
11. feat(js): update countdown and form messages for startup challenge
12. docs(spec): describe startup challenge theme
