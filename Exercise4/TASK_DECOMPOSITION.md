# Exercise 4 - Resilient Component Architecture

## State Machine

The component contains four states:

1. Loading
2. Live Data
3. Empty
4. Error


## State Transitions

Loading -> Live Data

Loading -> Empty

Loading -> Error

Error -> Loading -> Live Data


---

## T-03A - Loading Skeleton

### Goal

Create a loading state using a pure CSS shimmer animation.

### Contract

- Use CSS animation.
- Do not use JavaScript for the shimmer animation.
- Display skeleton items while content is loading.

### Verification

- Skeleton animation is visible.
- No console errors.


---

## T-03B - Live Data State

### Goal

Display successfully loaded resources.

### Contract

- Use CSS Grid for the resource cards.
- Use Flexbox for metadata badges.
- Use semantic HTML elements.

### Verification

- Resource cards display correctly.
- Layout is responsive.
- No horizontal scrolling at 375px.


---

## T-03C - Empty State

### Goal

Display a message when no data exists.

### Contract

- Display a clear empty message.
- Do not display fake data.

### Verification

- Empty state appears correctly.
- Layout remains responsive.


---

## T-03D - Error State

### Goal

Display an error message when loading fails.

### Contract

- Display an error message.
- Provide an accessible Retry button.
- Retry returns the component to Loading state.

### Verification

- Retry button works.
- Retry button can be reached with Tab.
- Retry button works with Enter or Space.