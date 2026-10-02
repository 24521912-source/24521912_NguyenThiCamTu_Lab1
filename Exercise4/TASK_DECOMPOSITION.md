# Exercise 4 - Resilient Component Architecture

## State Machine

The component supports four states:

1. Loading
2. Live Data
3. Empty
4. Error

State transitions:

Loading -> Live Data
Loading -> Empty
Loading -> Error
Error -> Loading -> Live Data / Empty / Error

---

## T-03A - Loading Skeleton

Goal:
Create a loading state using a pure CSS shimmer animation.

Contract:
- No JavaScript animation.
- Skeleton items represent loading content.
- Use CSS @keyframes.
- Loading state must be visually identifiable.

Verification:
- Skeleton animation runs continuously.
- No console errors.

---

## T-03B - Live Data State

Goal:
Display successfully loaded content.

Contract:
- Use CSS Grid for the item list.
- Use Flexbox for metadata badges.
- Use semantic HTML where possible.

Verification:
- Cards display correctly.
- Layout is responsive.
- No horizontal scrolling at 375px.

---

## T-03C - Empty and Error States

Goal:
Handle cases where no data is available or loading fails.

Empty State:
- Display a clear message.
- Do not show fake content.

Error State:
- Display an error message.
- Provide an accessible Retry button.

Verification:
- Retry button can be reached using Tab.
- Retry can be triggered using Enter or Space.