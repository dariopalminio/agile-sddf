# Visual Design Principles Reference

Framework-agnostic visual design guidance for Tatians React UI. All code examples use `--ui-*` tokens — no Tailwind, no hardcoded values.

---

## 1. Design Philosophy — Clean Minimalism (2025)

| Principle | Application |
|-----------|-------------|
| **Every element earns its place** | Remove decorative borders, backgrounds, and shadows unless they communicate something |
| **Visual hierarchy first** | The user must know what to read or interact with first — without thinking about it |
| **Whitespace is a design tool** | Empty space creates breathing room, separates unrelated items, and emphasizes important content |
| **Internal consistency > creative variation** | A component should look like it belongs to the same family as all other components |

**Practical test**: Cover any decorative element on the screen. Does the interface still work? If yes, the element may not be needed.

---

## 2. Visual Weight

Visual weight determines what the user's eye gravitates toward. Understanding it is the foundation of hierarchy decisions — it applies to every CSS property choice, not just color.

### Weight Factors (descending impact)

| Factor | High weight | Low weight |
|--------|-------------|------------|
| **Size** | Large | Small |
| **Contrast** | High vs background | Low |
| **Color** | Saturated / warm | Desaturated / cool / gray |
| **Position** | Top-left, center | Bottom-right, edges |
| **Isolation** | Surrounded by whitespace | Crowded |
| **Motion** | Animated | Static |
| **Shape** | Irregular, complex | Rectangular, simple |

### Hierarchy Rule

Every component layout needs **one element with clearly the highest visual weight**, one or two secondary elements, and the rest tertiary. This is why `--ui-button--primary` stands out — it combines higher contrast, saturated color, and `--ui-radius-md`. The `--ui-button--default` version intentionally has lower weight.

```css
/* ✅ Primary: high weight — saturated color, strong contrast */
.ui-button--primary {
  background-color: var(--ui-action-primary); /* saturated violet */
  color: var(--ui-fg-on-primary);             /* high contrast */
}

/* ✅ Default: low weight — neutral, blends with surface */
.ui-button--default {
  background-color: var(--ui-action-default);
  color: var(--ui-fg-default);
}
```

---

## 3. 8px Grid System

All spacing must be a multiple of **4px or 8px**. This is what the `--ui-space-*` tokens enforce:

| Token | Value | Grid units | Use for |
|-------|-------|-----------|---------|
| `--ui-space-xs` | 4px | ½ unit | Icon gaps, inline padding between tight elements |
| `--ui-space-sm` | 8px | 1 unit | Internal padding in compact components |
| `--ui-space-md` | 16px | 2 units | Standard component padding, gaps between related items |
| `--ui-space-lg` | 24px | 3 units | Gaps between component groups |
| `--ui-space-xl` | 32px | 4 units | Section-level spacing |

### Practical Rules

```css
/* ✅ Internal padding for a small component (button, badge) */
.ui-button { padding: var(--ui-space-sm) var(--ui-space-md); }

/* ✅ Internal padding for a larger component (card, modal) */
.ui-card { padding: var(--ui-space-md); }
.ui-modal { padding: var(--ui-space-lg); }

/* ✅ Gap between related items in a group */
.ui-form { display: flex; flex-direction: column; gap: var(--ui-space-md); }

/* ✅ Gap between section-level blocks */
.ui-page-section + .ui-page-section { margin-top: var(--ui-space-xl); }

/* ✅ Exceptions to the grid — always pixel-precise */
.ui-input { border-width: 1px; }
.ui-button:focus-visible { outline-offset: 2px; }
```

### Spacing by Context

Knowing the token values isn't enough — use the right token for the right spatial context:

| Context | Range | Tokens | Example |
|---------|-------|--------|---------|
| Inside a component (icon ↔ text gap) | 4–8px | `--ui-space-xs`, `--ui-space-sm` | Button icon gap, Input prefix padding |
| Component internal padding | 8–16px | `--ui-space-sm`, `--ui-space-md` | Card body, Modal padding |
| Between related components | 16–24px | `--ui-space-md`, `--ui-space-lg` | FormField gap, CheckboxGroup items |
| Between page sections | 32px+ | `--ui-space-xl` | Section breaks in demo pages |
| Page edge padding (mobile) | 16px min | `--ui-space-md` | Demo app container horizontal padding |

### Anti-Pattern: Magic Numbers

```css
/* ❌ Arbitrary values — breaks the grid */
.ui-button { padding: 10px 18px; }
.ui-card { gap: 14px; }

/* ✅ Grid-aligned with tokens */
.ui-button { padding: var(--ui-space-sm) var(--ui-space-md); }
.ui-card { gap: var(--ui-space-md); }
```

---

## 4. Color Usage Philosophy

### Structure: Neutral Base + One Action Accent

Tatians UI's semantic tokens implement this pattern:

```
Neutral (backgrounds, text, borders)    → --ui-bg-*, --ui-fg-*, --ui-border-*
One primary action color               → --ui-action-primary (brand violet)
Supporting action colors (secondary)   → --ui-action-secondary, --ui-action-default
Semantic state colors (used sparingly) → --ui-status-success/warning/error/info
```

### Rules

**Backgrounds and text: always neutral**

```css
/* ✅ Correct — neutral bg, neutral text */
.ui-card {
  background-color: var(--ui-bg-surface);
  color: var(--ui-fg-default);
}

/* ❌ Avoid colored backgrounds unless intentional (alert, badge) */
.ui-card { background-color: var(--ui-action-primary); } /* only if it's a CTA card */
```

**One primary color per view**

Show `--ui-action-primary` prominently in one place — the main call-to-action. Secondary actions use `--ui-action-default` or `--ui-action-secondary`.

```css
/* ✅ Primary action — one per section */
.ui-button--primary { background-color: var(--ui-action-primary); }

/* ✅ Secondary action — lower visual weight */
.ui-button--default {
  background-color: var(--ui-action-default);
  color: var(--ui-fg-default);
}
```

**State colors communicate state, not decoration**

```css
/* ✅ Green only when something succeeded */
.ui-alert--success { background-color: var(--ui-alert-success-flat-bg); }

/* ❌ Using success-green for a decorative highlight */
.ui-featured-card { border-color: var(--ui-status-success); }
```

### WCAG Contrast Requirements

| Text type | Minimum ratio | Target |
|-----------|--------------|--------|
| Body text (< 18px / non-bold) | 4.5 : 1 (AA) | 7 : 1 (AAA) |
| Large text (≥ 18px or ≥ 14px bold) | 3 : 1 (AA) | 4.5 : 1 (AAA) |
| UI components & states | 3 : 1 (AA) | — |

The semantic token pairs in the project are pre-validated:
- `--ui-fg-default` on `--ui-bg-surface` → passes AA
- `--ui-fg-on-primary` on `--ui-action-primary` → passes AA

Never mix tokens from different theme contexts (e.g., `--ui-fg-on-primary` on `--ui-bg-surface`).

---

## 5. Typography Hierarchy

### Font Role Mapping with `--ui-font-*` Tokens

| Role | Size token | Weight token | Line-height token |
|------|-----------|-------------|------------------|
| Display / Hero | `--ui-font-size-xl` | `--ui-font-weight-bold` | `--ui-line-height-tight` |
| Section heading | `--ui-font-size-lg` | `--ui-font-weight-bold` | `--ui-line-height-tight` |
| Component heading | `--ui-font-size-md` | `--ui-font-weight-bold` | `--ui-line-height-normal` |
| Label / UI text | `--ui-font-size-sm` | `--ui-font-weight-medium` | `--ui-line-height-normal` |
| Body / description | `--ui-font-size-sm` | `--ui-font-weight-normal` | `--ui-line-height-relaxed` |
| Caption / helper | `--ui-font-size-xs` | `--ui-font-weight-normal` | `--ui-line-height-relaxed` |

### Rules

- **Maximum 3–4 type sizes in one component** — more creates chaos
- **Weight creates hierarchy**: bold headings, medium labels, normal body
- **Never bold long paragraphs** — bold is for short labels and headings only
- **Color reinforces hierarchy**: use `--ui-fg-default` for primary text, `--ui-fg-muted` for secondary

```css
/* ✅ Card with clear 3-level hierarchy */
.ui-card__title {
  font-size: var(--ui-font-size-md);
  font-weight: var(--ui-font-weight-bold);
  color: var(--ui-fg-default);
  line-height: var(--ui-line-height-tight);
}

.ui-card__description {
  font-size: var(--ui-font-size-sm);
  font-weight: var(--ui-font-weight-normal);
  color: var(--ui-fg-muted);
  line-height: var(--ui-line-height-relaxed);
}

.ui-card__meta {
  font-size: var(--ui-font-size-xs);
  font-weight: var(--ui-font-weight-normal);
  color: var(--ui-fg-subtle);
  line-height: var(--ui-line-height-normal);
}
```

---

## 6. Shadows & Elevation

Shadows communicate that an element is **above** the surface. Use them only when elevation matters.

### When to Use Shadows

| Element | Shadow level | Token |
|---------|-------------|-------|
| Cards on a page surface | None or subtle | `--ui-shadow-sm` (if card needs lift) |
| Dropdowns, popovers | Medium | `--ui-shadow-md` |
| Modals, dialogs | Strong | `--ui-shadow-lg` |
| Tooltips | Subtle | `--ui-shadow-sm` |
| Buttons (default state) | None | — |
| Buttons (hover state) | Avoid — use background change instead | — |

### Rules

```css
/* ✅ Elevated card — use shadow only when it floats above content */
.ui-card--raised {
  box-shadow: var(--ui-shadow-md);
}

/* ✅ Dropdown — clearly above the rest */
.ui-menu {
  box-shadow: var(--ui-shadow-lg);
}

/* ❌ Don't add shadow to flat surface elements */
.ui-button--primary {
  box-shadow: 0 4px 14px rgba(127, 81, 214, 0.5); /* too heavy for a button */
}

/* ❌ Don't animate box-shadow on hover (expensive repaint) */
.ui-card:hover {
  box-shadow: var(--ui-shadow-lg); /* use transform: translateY instead */
}

/* ✅ Hover elevation with transform instead */
.ui-card--pressable:hover {
  transform: translateY(-2px);
  box-shadow: var(--ui-shadow-md);
  transition: transform 150ms ease, box-shadow 150ms ease;
}
```

---

## 7. Border Radius Guidelines

### Token-to-Use-Case Mapping

| Token | Value | Use for |
|-------|-------|---------|
| `--ui-radius-none` | 0 | Data tables, full-bleed images, code blocks |
| `--ui-radius-sm` | 4px | Chips, tags, badges, tooltips, small inputs |
| `--ui-radius-md` | 8px | **Buttons, inputs, cards** — the default for 2025 |
| `--ui-radius-lg` | 12px | Modals, drawers, large cards, panels |
| `--ui-radius-full` | 9999px | Avatars, toggle switches, pill badges |

### Rules

**Consistency within a family**: elements that appear together should use the same radius.

```css
/* ✅ Input and button next to each other — same radius */
.ui-input { border-radius: var(--ui-radius-md); }
.ui-button { border-radius: var(--ui-radius-md); }

/* ❌ Mixing radii in related components */
.ui-input { border-radius: var(--ui-radius-sm); }
.ui-button { border-radius: var(--ui-radius-lg); }
```

**Nested elements**: inner elements should have a smaller radius than their container.

```css
/* ✅ Container has lg, inner image has md */
.ui-card {
  border-radius: var(--ui-radius-lg);
  overflow: hidden;
}

.ui-card__image {
  border-radius: var(--ui-radius-md); /* or 0 if full-bleed inside the card */
}
```

**Configurable radius**: allow consumers to override via the `radius` prop, mapped to tokens:

```tsx
const RADIUS_MAP: Record<ButtonRadius, string> = {
  none: "var(--ui-radius-none)",
  sm:   "var(--ui-radius-sm)",
  md:   "var(--ui-radius-md)",
  lg:   "var(--ui-radius-lg)",
  full: "var(--ui-radius-full)",
};
```

---

## 8. Visual Anti-Patterns

### ❌ Inconsistent spacing (magic numbers)
```css
/* Bad */
.ui-form { gap: 14px; }
.ui-card { padding: 18px 22px; }

/* Good — always tokens */
.ui-form { gap: var(--ui-space-md); }
.ui-card { padding: var(--ui-space-md); }
```

### ❌ Too many accent colors at once
One primary action color visible at a time. Don't use `--ui-action-primary` AND `--ui-action-success` AND `--ui-action-warning` in the same visual area unless each communicates a distinct state.

### ❌ Insufficient contrast
Never use `--ui-fg-muted` or `--ui-fg-subtle` for interactive labels or primary content — reserve those for secondary/placeholder text.

### ❌ Heavy shadows on small elements
A shadow on a `<Badge>` or `<Chip>` looks heavy and cluttered. Shadows belong on elevated containers (cards, dropdowns, modals).

### ❌ Inconsistent border radii across siblings
If a `<Button>` and an `<Input>` appear in the same row, they must share the same `border-radius` token.

### ❌ Typography without hierarchy
Avoid rendering all text at `--ui-font-size-sm` / `font-weight-normal`. Without size and weight contrast, the user doesn't know what matters.

### ❌ `:hover` that shifts layout
Never change `padding`, `margin`, `width`, or `border-width` on `:hover`. Only change colors and optionally `transform`/`box-shadow`.

```css
/* ❌ Causes layout shift */
.ui-button:hover { border-width: 2px; padding: calc(var(--ui-space-sm) - 1px); }

/* ✅ No layout shift */
.ui-button { border: 2px solid transparent; }
.ui-button:hover { border-color: var(--ui-action-primary); }
```

### ❌ Decorative dividers between every item
Dividers (lines, borders) add visual noise. Use whitespace (gap, padding) to separate items instead. Add a divider only when items would be genuinely confused without one.

---

## 9. Pre-Development Design Checklist

Before writing a single line of CSS for a new component, answer these questions:

- [ ] **What is the visual hierarchy?** Which text/element should the user notice first?
- [ ] **What are the interactive states?** Default, hover, focus, active, disabled, loading — does each state feel distinct?
- [ ] **What spacing tokens apply?** Have you picked tokens for internal padding, element gaps, and external margins?
- [ ] **Which radius token fits?** Is this component in the same visual family as existing components?
- [ ] **Does it need a shadow?** Is the component elevated above the surface, or part of the surface?
- [ ] **Are color choices semantic?** Is every color token communicating meaning, not just decoration?
- [ ] **Does it work without color?** Users with color blindness should understand the component from shape/text/icon alone.
- [ ] **Does dark mode work automatically?** If you're using only semantic tokens, yes. If you hardcoded values, no.
