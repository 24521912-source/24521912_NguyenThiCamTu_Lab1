# Exercise 2 - Enterprise Developer Portfolio

## T-02A: Design Tokens & CSS Reset

### Goal
Create reusable CSS design tokens and a global CSS reset.

### Files
- style.css

### Requirements
- Define colors using CSS custom properties in :root.
- Use border-box for all elements.
- Avoid hardcoded colors inside component rules.

### Verification
- Inspect CSS and confirm colors use var(...).
- Check layout in browser.

---

## T-02B: Responsive 2D Grid Layout

### Goal
Create a responsive project card layout using CSS Grid.

### Files
- index.html
- style.css

### Requirements
- Use CSS Grid.
- Use repeat(), auto-fit and minmax().
- Support 375px mobile viewport.
- No horizontal scrolling.

### Verification
- Test browser width at 375px.
- Resize browser and observe project cards wrapping automatically.

---

## T-02C: Theme Engine

### Goal
Implement a light/dark theme switcher.

### Files
- index.html
- style.css
- script.js

### Requirements
- Use a button to toggle theme.
- Use aria-pressed for accessibility.
- Store theme using localStorage key "theme".
- Restore the saved theme after page reload.

### Verification
- Toggle dark/light mode.
- Reload the page.
- Confirm selected theme remains.
- Check browser console for errors.