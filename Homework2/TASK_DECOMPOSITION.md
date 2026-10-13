# Homework 2 - Drum Kit Engine (Contract-First)

## Project Goal
Build a keyboard-driven drum kit with a polyphonic audio engine
and a FIFO beat recorder, using HTML5, CSS3, and Vanilla JavaScript.

## Technology
- Semantic HTML5 with `data-*` attributes as the data contract
- CSS Grid and Flexbox, design tokens in `:root`
- Vanilla JavaScript ES6+ (`HTMLAudioElement`, `keydown`, `event.key`)
- Git for version control

## Data Contract (defined before any JavaScript)

Every pad is a `<button>` that carries all of its data:

```html
<button class="drum-pad" type="button" data-key="a" data-sound="sounds/kick.wav">
  <kbd>A</kbd> Kick
</button>
```

| Attribute    | Meaning                                   | Read by        |
|--------------|-------------------------------------------|----------------|
| `data-key`   | Lowercase `event.key` that triggers a pad | Keyboard layer |
| `data-sound` | Path of the audio file to play            | Audio engine   |

- JavaScript never hard-codes keys or file paths. A new pad or a new
  key binding is an HTML-only change.
- Recorder controls are buttons with `data-action="record|play|stop"`.
- Recorder status is announced through an `aria-live="polite"` region.

## Task Breakdown

### Step 1 / T-01: HTML data-sound contract
- Build semantic page (header, main, section, footer, skip link, one h1).
- Declare 9 pads with `data-key` and `data-sound`.
- Declare recorder controls and live status region.
- No inline scripts, styles, or event handlers: only external files.
- Commit HTML before touching JavaScript.

### T-02: CSS layout
- box-sizing reset and design tokens (light and dark via `prefers-color-scheme`).
- 3x3 pad grid that fits 375px without horizontal scroll.
- `.active` visual state and visible focus ring.

### Step 2 / T-03: Polyphonic audio engine
- `playSound(src)`: a new `Audio` per hit, so hits overlap instead of cutting each other off.
- Track playing sounds in a `Set`; `stopAll()` halts every active sound.
- Engine knows nothing about keys or the DOM layout.
- Pads are also playable by click (mouse and Tab + Enter).

### Step 3 / T-04: Keyboard listener
- Listen to `keydown`, read `event.key` (no `keypress`, no `keyCode`).
- `if (event.repeat) return;` stops audio flooding on held keys.
- Ignore shortcuts with Ctrl / Alt / Meta so browser shortcuts still work.

### Step 4 / T-05: FIFO beat recorder
- Record: each hit is enqueued as `{ key, time }` where `time` is
  milliseconds since recording started (`performance.now()`).
- Play: events are dequeued in insertion order (first in, first out)
  and replayed at their recorded offsets.
- Stop: ends recording or playback and cancels pending timers.

## State Machine (recorder)

```
idle --record--> recording --stop--> idle
idle --play----> playing   --stop / queue empty--> idle
```

## Acceptance Criteria
- Zero console errors; no inline event handlers; no `innerHTML`.
- Holding a key plays the sound once.
- Fast repeated hits overlap (polyphony).
- Renders at 375px with no horizontal scroll.
- Fully usable with keyboard only.

## Verification
Each task is tested in the browser (Live Server) before its commit.
