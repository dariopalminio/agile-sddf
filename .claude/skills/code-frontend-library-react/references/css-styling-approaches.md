# CSS Styling Approaches Reference

To use **plain CSS with CSS Variables exclusively**. No CSS-in-JS, no CSS Modules, no Tailwind, no utility classes.

## The Rule

Each component has exactly one `.css` file. All styles use BEM class names and `--ui-*` semantic tokens.

```
packages/ui/src/components/Button/
├── Button.tsx
└── Button.css    ← plain CSS, imported directly in Button.tsx
```

```tsx
// Button.tsx
import "./Button.css";
```

The CSS is collected by tsup and emitted as `dist/styles.css`. Consumers import it once:

```ts
import "@tatians-react-ui-lib/ui/dist/styles.css";
```

## BEM Class Naming

**Pattern**: `.ui-{block}`, `.ui-{block}--{modifier}`, `.ui-{block}__{element}`

The `ui-` prefix is mandatory on all classes to avoid collisions with consumer styles.

```css
/* Block */
.ui-input { }

/* Block + modifier */
.ui-input--error { }
.ui-input--disabled { }
.ui-input--sm { }

/* Block element */
.ui-input__label { }
.ui-input__helper { }
.ui-input__icon { }

/* Element + modifier */
.ui-input__icon--leading { }
.ui-input__icon--trailing { }
```

## Full Component CSS Example — Button

```css
/* ── Base ─────────────────────────────────────────────── */
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ui-space-xs);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-size-sm);
  font-weight: var(--ui-font-weight-medium);
  line-height: var(--ui-line-height-normal);
  border: none;
  border-radius: var(--ui-radius-md);
  padding: var(--ui-space-sm) var(--ui-space-md);
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  transition: background-color 150ms ease, color 150ms ease, box-shadow 150ms ease;
}

/* ── Focus ────────────────────────────────────────────── */
.ui-button:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

/* ── Color variants ───────────────────────────────────── */
.ui-button--default {
  background-color: var(--ui-action-default);
  color: var(--ui-fg-default);
}
.ui-button--default:hover:not(.ui-button--disabled) {
  background-color: var(--ui-action-default-hover);
}

.ui-button--primary {
  background-color: var(--ui-action-primary);
  color: var(--ui-fg-on-primary);
}
.ui-button--primary:hover:not(.ui-button--disabled) {
  background-color: var(--ui-action-primary-hover);
}
.ui-button--primary:active:not(.ui-button--disabled) {
  background-color: var(--ui-action-primary-active);
}

/* (secondary, success, warning, danger follow same pattern) */

/* ── Size variants ────────────────────────────────────── */
.ui-button--sm {
  padding: var(--ui-space-xs) var(--ui-space-sm);
  font-size: var(--ui-font-size-xs);
}

.ui-button--lg {
  padding: var(--ui-space-md) var(--ui-space-lg);
  font-size: var(--ui-font-size-md);
}

/* ── States ───────────────────────────────────────────── */
.ui-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.ui-button--icon-only {
  padding: var(--ui-space-sm);
  aspect-ratio: 1;
}

/* ── Elements ─────────────────────────────────────────── */
.ui-button__icon {
  flex-shrink: 0;
  width: 1em;
  height: 1em;
}

/* ── Reduced motion ───────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .ui-button {
    transition: none;
  }
}
```

## Full Component CSS Example — Input

```css
/* ── Wrapper ──────────────────────────────────────────── */
.ui-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--ui-space-xs);
}

/* ── Label ────────────────────────────────────────────── */
.ui-input__label {
  font-size: var(--ui-font-size-sm);
  font-weight: var(--ui-font-weight-medium);
  color: var(--ui-fg-default);
}

/* ── Control ──────────────────────────────────────────── */
.ui-input {
  width: 100%;
  padding: var(--ui-space-sm) var(--ui-space-md);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-size-sm);
  color: var(--ui-fg-default);
  background-color: var(--ui-bg-surface);
  border: 1px solid var(--ui-border-default);
  border-radius: var(--ui-radius-md);
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.ui-input::placeholder {
  color: var(--ui-fg-muted);
}

.ui-input:hover:not(.ui-input--disabled) {
  border-color: var(--ui-border-focus);
}

.ui-input:focus-visible {
  border-color: var(--ui-border-focus);
  box-shadow: 0 0 0 2px var(--ui-border-focus);
}

/* ── Error state ──────────────────────────────────────── */
.ui-input--error {
  border-color: var(--ui-border-danger);
}

.ui-input__helper--error {
  font-size: var(--ui-font-size-xs);
  color: var(--ui-status-error);
}

/* ── Disabled ─────────────────────────────────────────── */
.ui-input--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--ui-bg-muted);
}

@media (prefers-reduced-motion: reduce) {
  .ui-input {
    transition: none;
  }
}
```

## Anti-Patterns

```css
/* ❌ Hardcoded color */
.ui-button--primary { background-color: #7F51D6; }

/* ❌ Primitive token */
.ui-button--primary { background-color: var(--ui-palette-brand-500); }

/* ❌ Missing ui- prefix */
.button--primary { }

/* ❌ Inline :focus instead of :focus-visible */
.ui-input:focus { box-shadow: 0 0 0 2px blue; }

/* ❌ Magic numbers */
.ui-button { padding: 8px 16px; border-radius: 8px; }

/* ❌ BEM deep nesting — máximo 2 niveles (bloque__elemento) */
.ui-button__icon__svg { }

/* ❌ Selectores encadenados — acopla componentes entre sí */
.ui-card .ui-button { }

/* ❌ Selector calificado por tag — reduce reusabilidad */
button.ui-button { }

/* ❌ Selector de ID — especificidad no controlable */
#ui-modal { }

/* ❌ Modificador de estado en elemento — el estado pertenece al bloque */
.ui-button__icon--disabled { }
/* ✅ En su lugar: .ui-button--disabled .ui-button__icon { opacity: 0.5; } */
```

## Importing CSS in the Component

```tsx
// Button.tsx — always import the co-located CSS file
import "./Button.css";

export function Button({ ... }: ButtonProps) {
  // ...
}
```

Never import another component's CSS. Each component is self-contained.

## Class Merging (if needed)

No external library like `clsx` or `twMerge` is needed. Use a plain array filter:

```tsx
const cls = [
  "ui-button",
  `ui-button--${resolvedColor}`,
  `ui-button--${resolvedSize}`,
  isDisabled && "ui-button--disabled",
  isLoading && "ui-button--loading",
]
  .filter(Boolean)
  .join(" ");
```

## Data Attributes vs CSS Modifiers

Este proyecto usa tres mecanismos distintos para expresar estado — cada uno tiene un rol específico:

| Mecanismo | Propósito | Ejemplo |
|-----------|-----------|---------|
| CSS modifier (`.ui-*--state`) | Styling visual | `.ui-button--disabled { opacity: 0.5 }` |
| `aria-*` | Estado accesible para screen readers | `aria-disabled={isDisabled \|\| undefined}` |
| `data-testid` | Selector de E2E (API pública) | `data-testid="ui-button-primary"` |

**CSS modifiers controlan el styling visual:**

```css
/* ✅ Estado expresado como modificador BEM */
.ui-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

**`aria-*` expresa el estado accesible — no el visual:**

```tsx
/* ✅ aria para screen readers */
<button
  disabled={isDisabled}
  aria-disabled={isDisabled || undefined}
>
```

El patrón `|| undefined` es intencional: `undefined` elimina el atributo del DOM en lugar de renderizar `aria-disabled="false"`.

**`data-testid` es API pública — siempre se renderiza:**

```tsx
/* ✅ testId es prop pública con default predecible */
<button data-testid={testId ?? `ui-button-${resolvedColor}`}>
```

**Nunca usar clases `.is-*` o `.has-*`** — este proyecto usa CSS modifiers BEM y `aria-*` en lugar del patrón clásico de clases de estado:

```css
/* ❌ Clases de estado clásicas — no usadas en este proyecto */
.ui-button.is-disabled { }
.ui-input.has-error { }

/* ✅ Patrón de este proyecto */
.ui-button--disabled { }          /* modifier BEM para styling visual */
/* + aria-disabled={isDisabled} en el JSX para estado accesible */
```

## Theming & Dark Mode

Components inherit dark mode automatically because they use semantic tokens. No conditional CSS in components is needed:

```css
/* This works in both light and dark mode — token switches automatically */
.ui-card {
  background-color: var(--ui-bg-surface);
  color: var(--ui-fg-default);
  border: 1px solid var(--ui-border-default);
}
```
