# Homework 1 accessibility verification

## Scope and environment

- Page: `Homework1/index.html` with the existing Soft Rose & Burgundy themes.
- Browser: Chrome 154.0.8037.98.
- Tools: axe-core 4.14.0 and Lighthouse 13.5.0, installed outside the project for verification only.
- Automated scope: WCAG 2.0/2.1 A and AA, WCAG 2.2 AA, and axe best practices. The experimental `label-content-name-mismatch` check was explicitly enabled.
- Lighthouse scope: **Accessibility**, measured at a desktop viewport in both themes.

## Findings and fixes

1. **Label in Name (2.5.3):** the visible logo was `MyPortfolio.`, but its accessible name was `Portfolio homepage`. Its accessible name now starts with the visible label: `MyPortfolio. homepage`.
2. **Bypass Blocks (2.4.1):** the skip-link scrolled to the main content without moving keyboard focus to it. `tabindex="-1"` now lets the existing link focus the main landmark without adding it to the normal Tab order.
3. **Resize Text and Reflow (1.4.4 / 1.4.10):** at a 320px viewport with text enlarged to 200%, the name caused horizontal overflow. The heading's grid children can now shrink and the name can wrap at spaces.

All visible text, all seven image elements and image files, every link destination, the theme JavaScript, and the full light/dark color palette were retained.

## Automated results after the fixes

| Viewport | Theme | axe violations | axe checks requiring review | Lowest measured text contrast |
| --- | --- | ---: | ---: | ---: |
| 375px | Light | 0 | 0 | 5.81:1 |
| 375px | Dark | 0 | 0 | 6.95:1 |
| 1440px | Light | 0 | 0 | 5.81:1 |
| 1440px | Dark | 0 | 0 | 6.95:1 |

There were 39 passing axe checks and 93 rendered HTML text contrast samples per scenario. The existing colors passed the measured contrast checks and were kept.

| Lighthouse category | Light | Dark |
| --- | ---: | ---: |
| Accessibility | 100/100 | 100/100 |

No failed Accessibility audits or uncaught page JavaScript errors were recorded in the final run.

## Keyboard and layout verification

- The first Tab focuses the visible skip-link; Enter moves focus to `main-content`.
- Tab follows the document order through all links and the theme button, with a visible focus outline.
- Tab can leave the page after the last link; Shift+Tab returns to it without a focus trap.
- Enter operates the theme button, and the selected theme survives a reload.
- No horizontal page overflow at 320px, 375px, 768px, or 1440px.
- The same widths passed with text enlarged to 200%.
- The same widths passed with line height 1.5, letter spacing 0.12em, word spacing 0.16em, and paragraph spacing 2em.
- Normal desktop presentation and the enlarged mobile heading were visually reviewed.

## Interpretation

The earlier Skynet report's contrast failures were not reproduced by axe or the rendered-text measurements on the same deployed HTML and CSS. The logo label issue was reproduced and fixed. Skynet should be rescanned after deployment and any remaining report entries reviewed against their specific elements.

These results document automated checks and the listed keyboard, layout, and visual checks. They support WCAG AA review; a full conformance claim also requires evaluation of all applicable criteria with assistive technology. The 100/100 result above applies to Lighthouse Accessibility.

References: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html), [Lighthouse accessibility scoring](https://developer.chrome.com/docs/lighthouse/accessibility/scoring).
