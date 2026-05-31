# Animation & Transitions Reference

Standards for CSS transitions and animations in `packages/ui` components.

---

## Project Standard — Duration by Interaction Type

| Interaction | Duration | Notes |
|-------------|----------|-------|
| Hover state change | 80–120ms | Opacity, color, shadow |
| Focus ring | 80ms | Must feel instant — no transition (see Focus Ring section) |
| Tap / click feedback | 80–100ms | Scale or opacity pulse |
| Toggle / checkbox / switch | 150ms | State change |
| Dropdown open | 150–200ms | Entering |
| Dropdown close | 100–150ms | Exiting — faster than entering |
| Modal / dialog open | 200–250ms | Entering — deliberate |
| Modal / dialog close | 150–200ms | Exiting |
| Toast notification | 200–300ms in / 150ms out | |
| **Hard limit** | **500ms** | Never exceed for any UI animation |

Every component with a `transition` **must** include a `prefers-reduced-motion` block. No exceptions.

---

## Easing Rules — Direction Matters

| Direction | Easing | When to use |
|-----------|--------|-------------|
| **Entering** (element appears) | `ease-out` | Dropdowns opening, modals appearing, toasts entering |
| **Exiting** (element disappears) | `ease-in` | Dropdowns closing, modals dismissing, toasts leaving |
| **Transforming** (in-place change) | `ease-in-out` | Toggles, accordion, tab underline moving |
| **Never** | `linear` | Looks mechanical — reserved for spinners only |

```css
/* ✅ Dropdown: ease-out in, ease-in out */
.ui-menu { transition: opacity 150ms ease-out, transform 150ms ease-out; }
.ui-menu--closing { transition: opacity 100ms ease-in, transform 100ms ease-in; }

/* ✅ Toggle state change: ease-in-out */
.ui-switch__thumb { transition: transform 150ms ease-in-out; }
```

---

## Safe Properties to Animate

Animating these properties is performant (GPU-composited or cheap to repaint):

```css
transition:
  background-color 150ms ease,
  color 150ms ease,
  border-color 150ms ease,
  opacity 150ms ease,
  transform 150ms ease,
  box-shadow 150ms ease;
```

### ❌ Never Animate

```css
/* ❌ Triggers layout — expensive and causes visual jitter */
transition: width 150ms ease;
transition: height 150ms ease;
transition: padding 150ms ease;
transition: margin 150ms ease;
transition: top 150ms ease;
transition: left 150ms ease;
```

---

## Reduced Motion — Always Required

Every component that declares a `transition` or `animation` must end its CSS file with:

```css
@media (prefers-reduced-motion: reduce) {
  .ui-button {
    transition: none;
    animation: none;
  }
}
```

Include **all** animated elements in the block, not just the root class.

---

## Hover & Focus Transitions

Standard interactive state transitions:

```css
/* ✅ Color-only hover — no layout shift */
.ui-button {
  background-color: var(--ui-action-primary);
  transition: background-color 150ms ease, opacity 150ms ease;
}

.ui-button:hover:not(.ui-button--disabled) {
  background-color: var(--ui-action-primary-hover);
}
```

### Hover Elevation Pattern

Prefer `transform: translateY` over animating `box-shadow` on hover. The box-shadow still changes, but anchoring the motion to a transform keeps it smooth:

```css
/* ✅ Pressable card — lift on hover */
.ui-card--pressable:hover {
  transform: translateY(-2px);
  box-shadow: var(--ui-shadow-md);
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.ui-card--pressable:active {
  transform: translateY(0);
  box-shadow: var(--ui-shadow-sm);
}

@media (prefers-reduced-motion: reduce) {
  .ui-card--pressable:hover,
  .ui-card--pressable:active {
    transform: none;
    transition: none;
  }
}
```

---

## Press / Active State

Scale transform signals that an element was pressed:

```css
.ui-button:active:not(.ui-button--disabled):not(.ui-button--loading) {
  transform: scale(0.97);
  transition: transform 80ms ease, background-color 150ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .ui-button:active {
    transform: none;
  }
}
```

---

## Overlay Enter/Exit Transitions

Modals and popovers use a slightly longer enter duration to feel deliberate:

```css
/* Backdrop */
.ui-modal-backdrop {
  opacity: 0;
  transition: opacity 200ms ease-out;
}

.ui-modal-backdrop--visible {
  opacity: 1;
}

/* Dialog panel */
.ui-modal-content {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}

.ui-modal-content--visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Exit is faster — ease-in for exiting elements */
.ui-modal-content--exiting {
  opacity: 0;
  transform: scale(0.97);
  transition: opacity 150ms ease-in, transform 150ms ease-in;
}

@media (prefers-reduced-motion: reduce) {
  .ui-modal-backdrop,
  .ui-modal-content {
    transition: none;
    transform: none;
  }
}
```

---

## Loading Spinner Animation

The spinner uses a CSS `@keyframes` rotation on a BEM element:

```css
/* Element inside button */
.ui-button__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: var(--ui-radius-full);
  animation: ui-spin 600ms linear infinite;
  flex-shrink: 0;
}

@keyframes ui-spin {
  to { transform: rotate(360deg); }
}

/* Prefix all keyframe names with ui- to avoid collisions */

@media (prefers-reduced-motion: reduce) {
  .ui-button__spinner {
    animation: none;
    /* Show a static indicator instead */
    border-top-color: currentColor;
    opacity: 0.6;
  }
}
```

---

## Focus Ring

Focus rings should NOT use `transition` — they must appear instantly:

```css
/* ✅ No transition on focus ring */
.ui-button:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

/* ❌ Animated focus ring — user can miss the focus indicator */
.ui-button:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  transition: outline 150ms ease; /* don't do this */
}
```

---

## Checklist

Before shipping a component with transitions:

- [ ] Duration matches interaction type (hover 80–120ms, press 80ms, toggle 150ms, overlay 200–250ms)
- [ ] Easing matches direction: `ease-out` entering, `ease-in` exiting, `ease-in-out` transforming — never `linear` (except spinners)
- [ ] Only animating safe properties (no layout-triggering props)
- [ ] `@media (prefers-reduced-motion: reduce)` block present
- [ ] Spinner uses `@keyframes ui-spin` with `linear infinite`
- [ ] Focus ring has no transition
