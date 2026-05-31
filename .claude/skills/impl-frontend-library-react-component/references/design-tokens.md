# Design Tokens Reference

The token system uses two layers. Only semantic tokens may appear in component CSS.

## Two-Layer Architecture

```
Layer 1 — Primitives   (tokens/primitives.css)
  --ui-palette-brand-500: #7F51D6;      ← raw palette, NEVER in components

Layer 2 — Semantic     (tokens/semantic-light.css / semantic-dark.css)
  --ui-action-primary: var(--ui-palette-brand-500);   ← THIS is what components use
```

**Rule**: If you find yourself writing `var(--ui-palette-*)` inside a component `.css` file, stop — use a semantic token instead.

## Semantic Token Groups

### Background (`--ui-bg-*`)

| Token | Usage |
|-------|-------|
| `--ui-bg-surface` | Page/card base background |
| `--ui-bg-surface-raised` | Elevated surfaces (dropdowns, modals) |
| `--ui-bg-surface-hover` | Hover state on surface elements |
| `--ui-bg-muted` | Subtle background (tags, badges) |
| `--ui-bg-primary` | Primary action background |
| `--ui-bg-danger` | Destructive action background |

### Foreground / Text (`--ui-fg-*`)

| Token | Usage |
|-------|-------|
| `--ui-fg-default` | Body text, primary content |
| `--ui-fg-muted` | Secondary text, placeholders |
| `--ui-fg-subtle` | Disabled text, metadata |
| `--ui-fg-on-primary` | Text on primary-colored backgrounds |
| `--ui-fg-on-danger` | Text on danger-colored backgrounds |
| `--ui-fg-link` | Hyperlinks |

### Border (`--ui-border-*`)

| Token | Usage |
|-------|-------|
| `--ui-border-default` | Standard border (inputs, cards) |
| `--ui-border-subtle` | Dividers, section separators |
| `--ui-border-focus` | Focus ring (2px outline) |
| `--ui-border-danger` | Error state border |

### Action (`--ui-action-*`)

Action tokens cover all six color variants × three states (default/hover/active).

| Pattern | Example |
|---------|---------|
| `--ui-action-{color}` | `--ui-action-primary` |
| `--ui-action-{color}-hover` | `--ui-action-primary-hover` |
| `--ui-action-{color}-active` | `--ui-action-primary-active` |

Available colors: `default`, `primary`, `secondary`, `success`, `warning`, `danger`

### Status (`--ui-status-*`)

`--ui-status-success`, `--ui-status-warning`, `--ui-status-error`, `--ui-status-info`

### Alert (`--ui-alert-*`)

Pattern: `--ui-alert-{type}-{variant}-{property}`
- Types: `default`, `primary`, `secondary`, `success`, `warning`, `danger`
- Variants: `solid`, `flat`, `faded`
- Properties: `bg`, `fg`, `border`

Example: `--ui-alert-success-flat-bg`, `--ui-alert-danger-solid-fg`

## Layout Tokens

### Spacing (`--ui-space-*`)

| Token | Value | Usage |
|-------|-------|-------|
| `--ui-space-xs` | 4px | Icon gaps, inline padding |
| `--ui-space-sm` | 8px | Component internal padding |
| `--ui-space-md` | 16px | Section spacing |
| `--ui-space-lg` | 24px | Component group spacing |
| `--ui-space-xl` | 32px | Page section spacing |

### Typography (`--ui-font-*`)

```css
font-family:   var(--ui-font-family);          /* system-ui */
font-family:   var(--ui-font-family-mono);     /* monospace */

font-size:     var(--ui-font-size-xs);         /* 12px */
font-size:     var(--ui-font-size-sm);         /* 14px */
font-size:     var(--ui-font-size-md);         /* 16px */
font-size:     var(--ui-font-size-lg);         /* 18px */
font-size:     var(--ui-font-size-xl);         /* 24px */

font-weight:   var(--ui-font-weight-normal);   /* 400 */
font-weight:   var(--ui-font-weight-medium);   /* 500 */
font-weight:   var(--ui-font-weight-bold);     /* 700 */

line-height:   var(--ui-line-height-tight);
line-height:   var(--ui-line-height-normal);
line-height:   var(--ui-line-height-relaxed);
```

### Radius (`--ui-radius-*`)

| Token | Value |
|-------|-------|
| `--ui-radius-none` | 0 |
| `--ui-radius-sm` | 4px |
| `--ui-radius-md` | 8px |
| `--ui-radius-lg` | 12px |
| `--ui-radius-full` | 9999px |

## Dark Mode

Semantic tokens switch automatically when `data-theme="dark"` is set on `<html>`.
The fallback is `@media (prefers-color-scheme: dark)` for users with JS disabled.

```css
/* Light: defined in semantic-light.css */
:root {
  --ui-bg-surface: var(--ui-palette-neutral-50);
  --ui-fg-default: var(--ui-palette-neutral-900);
}

/* Dark: defined in semantic-dark.css */
[data-theme="dark"] {
  --ui-bg-surface: var(--ui-palette-neutral-950);
  --ui-fg-default: var(--ui-palette-neutral-50);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --ui-bg-surface: var(--ui-palette-neutral-950);
    --ui-fg-default: var(--ui-palette-neutral-50);
  }
}
```

Components inherit dark mode for free — no conditional CSS needed.

## Usage Examples

```css
/* ✅ Correct — semantic tokens */
.ui-button--primary {
  background-color: var(--ui-action-primary);
  color: var(--ui-fg-on-primary);
  border-radius: var(--ui-radius-md);
  padding: var(--ui-space-sm) var(--ui-space-md);
  font-weight: var(--ui-font-weight-medium);
}

.ui-button--primary:hover:not(.ui-button--disabled) {
  background-color: var(--ui-action-primary-hover);
}

/* ❌ Wrong — primitive tokens in component */
.ui-button--primary {
  background-color: var(--ui-palette-brand-500);
}

/* ❌ Wrong — hardcoded values */
.ui-button--primary {
  background-color: #7F51D6;
}
```

## Token Files Location

```
packages/ui/src/tokens/
├── primitives.css        ← raw palette (brand, neutral, error, success, warning)
├── semantic-light.css    ← light theme mappings
├── semantic-dark.css     ← dark theme mappings
├── spacing.css           ← --ui-space-*
├── typography.css        ← --ui-font-*
├── radius.css            ← --ui-radius-*
├── shadows.css           ← --ui-shadow-*
└── layout.css            ← z-index, sidebar widths, transitions
```

All tokens are imported via `packages/ui/src/styles.css` and exported as `dist/styles.css`.
