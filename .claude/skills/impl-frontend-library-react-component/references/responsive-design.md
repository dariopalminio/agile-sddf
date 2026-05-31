# Responsive Design Reference

Responsive design guidance for Tatians React UI Library. All examples use plain CSS with `--ui-*` tokens — no Tailwind, no CSS-in-JS.

## Philosophy: Component-First Responsiveness

In a component library, responsiveness is **component-first**, not viewport-first:

| Scope | Mechanism | Where |
|-------|-----------|-------|
| Component internals (layout, padding, font size) | **Container queries** | `packages/ui` component CSS |
| Page layouts, grids, navigation | **Media queries** | `apps/demo` page CSS |

**Reason**: Container queries make components truly reusable — they adapt to wherever they're placed, not to the viewport size.

---

## Container Queries — Component-Level Responsiveness

The preferred mechanism for components in `packages/ui`.

### Basic Setup

```css
/* 1. Define a containment context on the wrapper element */
.ui-card-container {
  container-type: inline-size;   /* Most common — width-based only */
  container-name: card;          /* Optional — use when you need targeted queries */
}

/* 2. Query the container, not the viewport */
@container card (min-width: 400px) {
  .ui-card {
    flex-direction: row;
    align-items: flex-start;
  }

  .ui-card__image {
    width: 40%;
    aspect-ratio: 1;
  }
}

@container card (min-width: 600px) {
  .ui-card__image {
    width: 200px;
  }

  .ui-card__title {
    font-size: var(--ui-font-size-lg);
  }
}
```

### Container Query Units

Use `cqi` (container inline %) for padding and font size inside container queries:

```css
.ui-card {
  padding: clamp(var(--ui-space-sm), 4cqi, var(--ui-space-lg));
}

.ui-card__title {
  font-size: clamp(var(--ui-font-size-sm), 4cqi, var(--ui-font-size-xl));
}
```

### Full Adaptive Card Example

```css
/* Wrapper defines container */
.ui-card-container {
  container: card / inline-size;
}

/* Mobile-first base: vertical stack */
.ui-card {
  display: flex;
  flex-direction: column;
  gap: var(--ui-space-md);
  padding: var(--ui-space-md);
  background-color: var(--ui-bg-surface);
  border: 1px solid var(--ui-border-default);
  border-radius: var(--ui-radius-md);
}

.ui-card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--ui-radius-sm);
}

.ui-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--ui-space-sm);
}

.ui-card__title {
  font-size: var(--ui-font-size-md);
  font-weight: var(--ui-font-weight-bold);
  color: var(--ui-fg-default);
}

.ui-card__description {
  font-size: var(--ui-font-size-sm);
  color: var(--ui-fg-muted);
  line-height: var(--ui-line-height-relaxed);
}

/* Medium container: side-by-side */
@container card (min-width: 400px) {
  .ui-card {
    flex-direction: row;
    align-items: flex-start;
  }

  .ui-card__image {
    width: 40%;
    flex-shrink: 0;
    aspect-ratio: 1;
  }

  .ui-card__body {
    flex: 1;
  }
}

/* Large container: bigger title, more padding */
@container card (min-width: 600px) {
  .ui-card {
    padding: var(--ui-space-lg);
    gap: var(--ui-space-lg);
  }

  .ui-card__image {
    width: 220px;
  }

  .ui-card__title {
    font-size: var(--ui-font-size-lg);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .ui-card {
    transition: none;
  }
}
```

### Multiple Named Containers

```css
/* Sidebar context */
.sidebar-widget-container {
  container: sidebar-widget / inline-size;
}

@container sidebar-widget (min-width: 280px) {
  .ui-stat {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--ui-space-sm);
  }
}

/* Main content context */
.content-card-container {
  container: content-card / inline-size;
}

@container content-card (min-width: 500px) {
  .ui-stat {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Browser Support Note

Container queries are supported in all evergreen browsers (Chrome 105+, Firefox 110+, Safari 16+). If you need a graceful fallback:

```css
/* Fallback for very old browsers */
.ui-card { flex-direction: column; }

@supports (container-type: inline-size) {
  .ui-card-container { container-type: inline-size; }

  @container (min-width: 400px) {
    .ui-card { flex-direction: row; }
  }
}
```

---

## Breakpoints — Layouts in `apps/demo`

Use media queries for page layouts, navigation, and demo app sections. **Always mobile-first.**

### Standard Scale

| Name | Value | Typical use |
|------|-------|-------------|
| Base | `< 640px` | Mobile phones (default styles) |
| sm | `≥ 640px` | Landscape phones, small tablets |
| md | `≥ 768px` | Tablets |
| lg | `≥ 1024px` | Laptops, small desktops |
| xl | `≥ 1280px` | Large desktops |

```css
/* Mobile-first base styles — written first, no @media needed */
.demo-layout {
  display: flex;
  flex-direction: column;
  gap: var(--ui-space-md);
}

/* Enhance as viewport grows */
@media (min-width: 768px) {
  .demo-layout {
    flex-direction: row;
  }
}

@media (min-width: 1024px) {
  .demo-layout {
    gap: var(--ui-space-xl);
  }
}
```

### Common Layout Patterns

```css
/* Auto-fit card grid — no breakpoints needed */
.demo-component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--ui-space-md);
}

/* Sidebar + content layout */
.demo-page-layout {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ui-space-lg);
}

/* Sidebar: collapses below its flex-basis when parent is narrow */
.demo-sidebar {
  flex-basis: 260px;
  flex-grow: 1;
}

/* Main content: grows to fill remaining space */
.demo-main {
  flex-basis: 0;
  flex-grow: 999;
  min-width: 60%;
}

/* Stack on small screens */
@media (max-width: 767px) {
  .demo-page-layout {
    flex-direction: column;
  }

  .demo-sidebar {
    flex-basis: auto;
  }
}
```

---

## Fluid Values with `clamp()`

### Syntax

```css
/* clamp(minimum, preferred, maximum) */
font-size: clamp(1rem, 5vw, 2rem);
```

### With `--ui-*` Tokens (preferred)

```css
/* Using token variables as bounds */
.ui-display-title {
  font-size: clamp(var(--ui-font-size-xl), 5vw, 3rem);
  line-height: var(--ui-line-height-tight);
}

/* Fluid padding based on container width */
.ui-hero {
  padding-inline: clamp(var(--ui-space-md), 6cqi, var(--ui-space-xl));
}

/* Fluid gap in a grid */
.demo-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(var(--ui-space-sm), 2vw, var(--ui-space-lg));
}
```

### Calculating a Fluid Value

To scale a property from **value A** at **viewport W1** to **value B** at **viewport W2**:

```
preferred = A + (B - A) / (W2 - W1) * 100vw
```

Example: 16px at 320px viewport → 24px at 1280px:
- Slope: (24 - 16) / (1280 - 320) = 0.00833
- Intercept: 16 - 0.00833 × 320 = 13.33px

```css
font-size: clamp(1rem, 0.833rem + 0.833vw, 1.5rem);
```

---

## Touch Targets and Accessible Sizing

### Minimum 44×44px for Tappable Elements

All interactive elements must be at least 44×44px on mobile (WCAG 2.5.5). Recommended target is 48px for primary actions.

#### Per-Element Targets

| Element | Minimum hit area | Recommended | Implementation |
|---------|-----------------|-------------|----------------|
| Primary / secondary button | 44×44px | 48px height | `min-height: 44px` |
| Icon button | 44×44px hit area | 48px | Padding or `::before` extension |
| Link in running text | 24px height | Add `padding-block` | Hard to tap — add vertical padding |
| List item / menu item | 44px height | 48px | `min-height: 44px` + `padding-block` |
| Input field | 44px height | 48px | `min-height: 44px` |

```css
/* Ensure minimum tap target without affecting visual size */
.ui-button {
  min-height: 44px;
  min-width: 44px;
  padding: var(--ui-space-sm) var(--ui-space-md);
}

/* Small visual button with extended tap area */
.ui-icon-button {
  position: relative;
  width: 32px;
  height: 32px;
}

/* Extend hit area with a pseudo-element */
.ui-icon-button::before {
  content: "";
  position: absolute;
  inset: -6px;  /* (44 - 32) / 2 = 6px */
}

/* Checkbox: visual indicator small, label makes total area big */
.ui-checkbox__control {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* The full row is the tap target */
.ui-checkbox {
  display: flex;
  align-items: center;
  gap: var(--ui-space-sm);
  min-height: 44px;
  cursor: pointer;
}
```

### Viewport Height on Mobile

Avoid `100vh` — it doesn't account for mobile browser chrome (address bar). Use dynamic viewport units:

```css
/* ❌ Jumps when browser chrome shows/hides */
.ui-fullscreen {
  height: 100vh;
}

/* ✅ Adapts to the visible area */
.ui-fullscreen {
  height: 100dvh;
}

/* ✅ Modal max-height: never taller than visible area */
.ui-modal {
  max-height: min(90dvh, 800px);
  overflow-y: auto;
}

/* ✅ Sticky header: accounts for safe area (notched devices) */
.ui-topbar {
  position: fixed;
  top: 0;
  top: env(safe-area-inset-top, 0);
  inset-inline: 0;
}
```

---

## Preventing Layout Shift (CLS)

Cumulative Layout Shift (CLS) measures unexpected layout movement during load. Target: **CLS < 0.1** (Google Core Web Vitals "Good" threshold). Most violations come from images and async content without reserved space.

### Rules

- **Always declare `aspect-ratio`** on image wrappers — the image reserves its space before it loads
- **Include explicit `width` + `height` attributes** on every `<img>` in `apps/demo`
- **Reserve `min-height`** for async content placeholders using `--ui-bg-muted` as the placeholder background

```css
/* ✅ Image wrapper reserves space before image loads */
.ui-image-wrapper {
  aspect-ratio: 16 / 9;
  background-color: var(--ui-bg-muted);
  overflow: hidden;
}

.ui-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ✅ Async content slot — prevents jump when content loads */
.ui-async-slot {
  min-height: 80px;
  background-color: var(--ui-bg-muted);
  border-radius: var(--ui-radius-md);
}
```

```html
<!-- ✅ Explicit width/height — browser pre-allocates space -->
<img src="hero.jpg" width="1280" height="720" alt="..." />

<!-- ❌ No dimensions — causes layout shift on load -->
<img src="hero.jpg" alt="..." />
```

---

## Typography Readability

### Base Rules (from `--ui-*` tokens)

```css
body {
  font-size: var(--ui-font-size-md);    /* ≥ 16px — minimum for body text */
  line-height: var(--ui-line-height-normal); /* ≈ 1.5 */
}

/* Prose text in demo pages */
.demo-prose {
  max-width: 65ch;   /* Optimal line length for reading */
  line-height: var(--ui-line-height-relaxed);
}
```

### Don't Make Mobile Text Too Small

```css
/* ❌ Too small on mobile */
.ui-helper-text {
  font-size: 11px;
}

/* ✅ Use the smallest token (12px) — never go below */
.ui-helper-text {
  font-size: var(--ui-font-size-xs);  /* 12px */
}
```

---

## Verification Checklist

Before marking a component or layout as complete, verify:

- [ ] **Mobile-first**: Base styles work on 375px viewport without horizontal scroll
- [ ] **Touch targets**: All interactive elements ≥ 44×44px hit area
- [ ] **Font size**: No text smaller than `var(--ui-font-size-xs)` (12px) in components
- [ ] **Container queries used** (not media queries) for component-internal layout changes
- [ ] **`100dvh` instead of `100vh`** in any full-height containers
- [ ] **No hardcoded px widths** in responsive contexts — use `%`, `fr`, `min()`, `clamp()`
- [ ] **Tokens used** for all spacing, font sizes, radii — no magic numbers
- [ ] **`prefers-reduced-motion`** included alongside any `transition` or `animation`
- [ ] **Images have `aspect-ratio`** defined to prevent layout shift
- [ ] **Grid layout tested** at 320px, 768px, and 1280px viewport widths
