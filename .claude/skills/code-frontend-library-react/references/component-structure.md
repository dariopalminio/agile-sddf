# Component Structure Reference

Complete anatomy for any component in `packages/ui/src/components/`.

## Directory Layout

```
components/ComponentName/
├── ComponentName.tsx          ← main component
├── ComponentName.css          ← BEM styles with --ui-* tokens
├── ComponentName.stories.tsx  ← Storybook v8 stories
├── ComponentName.test.tsx     ← Vitest unit tests (separate skill)
├── index.ts                   ← re-export with "use client"
├── types.ts                   ← (optional) complex prop types
└── SubComponent.tsx           ← (optional) compound sub-parts
```

## `ComponentName.tsx` — Component File

### Type Definitions

```tsx
// 1. Export all public variant types
export type ButtonColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";

// 2. Runtime validation arrays — keep in sync with the types
const VALID_COLORS: ButtonColor[] = ["default", "primary", "secondary", "success", "warning", "danger"];
const VALID_SIZES: ButtonSize[] = ["sm", "md", "lg"];

// 3. Props interface extends native HTML attributes, omitting overridden props
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  /** Visual color variant. @default "primary" */
  color?: ButtonColor;
  /** Size variant. @default "md" */
  size?: ButtonSize;
  /** Border radius variant. @default "md" */
  radius?: ButtonRadius;
  /** Disables interaction and applies disabled styling. */
  isDisabled?: boolean;
  /** Shows loading spinner and disables interaction. */
  isLoading?: boolean;
  /** Renders as icon-only; requires aria-label. */
  isIconOnly?: boolean;
  /** data-testid for E2E selectors. Default: "ui-button-{color}" */
  testId?: string;
}
```

**Key rules:**
- Name: `ComponentNameProps` (PascalCase + Props suffix)
- Rename unsafe HTML attrs: `disabled` → `isDisabled`, native `type` → component-specific type
- JSDoc on every public prop
- Export all variant types alongside the interface

### Runtime Validation

```tsx
export function Button({
  color = "primary",
  size = "md",
  isDisabled = false,
  testId,
  children,
  ...rest
}: ButtonProps) {
  // Validate prop values at runtime (dev only)
  const resolvedColor = VALID_COLORS.includes(color!) ? color! : "primary";
  if (color && !VALID_COLORS.includes(color)) {
    console.warn(`[Button] Invalid color "${color}". Using "primary".`);
  }

  // ...
}
```

### Class Composition

```tsx
const className = [
  "ui-button",
  `ui-button--${resolvedColor}`,
  `ui-button--${resolvedSize}`,
  isDisabled && "ui-button--disabled",
  isLoading && "ui-button--loading",
  isIconOnly && "ui-button--icon-only",
]
  .filter(Boolean)
  .join(" ");
```

### testId and Data Attributes

```tsx
return (
  <button
    {...rest}
    className={className}
    disabled={isDisabled || isLoading}
    aria-disabled={isDisabled || isLoading}
    data-testid={testId ?? `ui-button-${resolvedColor}`}
    data-disabled={isDisabled ? "true" : undefined}
    data-loading={isLoading ? "true" : undefined}
  >
    {children}
  </button>
);
```

For interactive stateful components (Card, etc.) add interaction data attributes:

```tsx
data-hover={isHovered ? "true" : undefined}
data-focus={isFocused ? "true" : undefined}
data-pressed={isPressed ? "true" : undefined}
```

### forwardRef Pattern

Use `forwardRef` when the parent may need access to the DOM node (Input, Checkbox, Textarea).

```tsx
import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, isDisabled = false, testId, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        {...rest}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        data-testid={testId ?? "ui-input"}
        data-disabled={isDisabled ? "true" : undefined}
        className="ui-input"
      />
    );
  },
);

Input.displayName = "Input";
```

### Context-Aware Components (Group pattern)

For components used inside a group (CheckboxGroup, RadioGroup), read group context:

```tsx
import { useCheckboxGroupContext } from "./useCheckboxGroupContext";

export function Checkbox({ isDisabled: ownDisabled, ...props }: CheckboxProps) {
  const group = useCheckboxGroupContext(); // returns null outside a group
  const isDisabled = group?.isDisabled ?? ownDisabled ?? false;
  // ...
}
```

## `ComponentName.css` — Styles File

### BEM Structure

```css
/* Base element */
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ui-font-family);
  font-weight: var(--ui-font-weight-medium);
  border-radius: var(--ui-radius-md);
  padding: var(--ui-space-sm) var(--ui-space-md);
  transition: background-color 150ms ease, color 150ms ease;
  cursor: pointer;
  border: none;
  outline: none;
}

/* Modifier: color variant */
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

/* Modifier: state */
.ui-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Focus visible — ALWAYS use focus-visible, never focus */
.ui-button:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

/* Element: icon inside button */
.ui-button__icon {
  flex-shrink: 0;
  width: 1em;
  height: 1em;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .ui-button {
    transition: none;
  }
}
```

**Rules:**
- All classes start with `ui-` prefix
- BEM: `.ui-{block}`, `.ui-{block}--{modifier}`, `.ui-{block}__{element}`
- Only `--ui-*` semantic tokens — no hardcoded hex, rgb, or rem values
- Use `:hover:not(.ui-button--disabled)` — avoid duplicate disabled state CSS
- Use `:focus-visible` not `:focus`
- Include `@media (prefers-reduced-motion: reduce)` for any `transition` or `animation`

## `index.ts` — Re-export File

```ts
"use client";  // Required for interactive components (Next.js App Router)

export { Button } from "./Button";
export type { ButtonProps, ButtonColor, ButtonSize, ButtonRadius } from "./Button";
```

Omit `"use client"` only for purely presentational, non-interactive components (Divider, Spacer).

## `packages/ui/src/index.ts` — Public API

Add exports for the new component:

```ts
// Button
export { Button } from "./components/Button";
export type { ButtonProps, ButtonColor, ButtonSize } from "./components/Button";
```

## Demo App Integration

### `apps/demo/src/components/ButtonDemo.tsx`

```tsx
import { Button } from "@tatians-react-ui-lib/ui";

export function ButtonDemo() {
  return (
    <section>
      <h2>Button</h2>
      <div style={{ display: "flex", gap: "var(--ui-space-sm)", flexWrap: "wrap" }}>
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button isDisabled>Disabled</Button>
      </div>
    </section>
  );
}
```

### `apps/demo/src/pages/ButtonPage.tsx`

```tsx
import { ButtonDemo } from "../components/ButtonDemo";

export function ButtonPage() {
  return (
    <main>
      <h1>Button</h1>
      <ButtonDemo />
    </main>
  );
}
```

### Route in `apps/demo/src/App.tsx`

```tsx
<Route path="/button" element={<ButtonPage />} />
```

### Sidebar entry in `apps/demo/src/components/SidebarDemo.tsx`

```tsx
{ label: "Button", path: "/button" },
```

### Demo Page Layout Guidelines

Structure demo pages so they communicate clearly from the first scroll position:

- **Show the component first** — the most representative usage (e.g. Primary button) must be visible without scrolling. No imports, no explanatory paragraphs at the top.
- **Front-load headings** — the first two words carry 80% of the scanning weight. "Primary Button" beats "Button Usage Example". "Disabled State" beats "Example 3".
- **Group related variants** under a descriptive heading (Layer-Cake pattern: motivated users scan headings to find what they want).
- **Separate groups with `--ui-space-xl` (32px) minimum** between visual sections.
- **Don't mix too many concepts in one section** — one color per section, one size per section.

```tsx
// ✅ Good demo page structure
export function ButtonPage() {
  return (
    <main>
      <h1>Button</h1>

      {/* Most important usage visible immediately */}
      <section>
        <h2>Primary</h2>
        <Button color="primary">Save changes</Button>
      </section>

      {/* Grouped by concept, with meaningful headings */}
      <section style={{ marginTop: "var(--ui-space-xl)" }}>
        <h2>All Color Variants</h2>
        {/* ... */}
      </section>

      <section style={{ marginTop: "var(--ui-space-xl)" }}>
        <h2>Sizes</h2>
        {/* ... */}
      </section>

      <section style={{ marginTop: "var(--ui-space-xl)" }}>
        <h2>Disabled State</h2>
        {/* ... */}
      </section>
    </main>
  );
}
```

---

## CSS Class Constants as Public API

Components that expose many BEM class names export a `COMPONENT_CSS_CLASSES` constant so consumers don't hardcode strings:

```tsx
// types.ts (or bottom of ComponentName.tsx)
export const BUTTON_CSS_CLASSES = {
  ROOT: "ui-button",
  PRIMARY: "ui-button--primary",
  SECONDARY: "ui-button--secondary",
  DISABLED: "ui-button--disabled",
  LOADING: "ui-button--loading",
  ICON_ONLY: "ui-button--icon-only",
  SM: "ui-button--sm",
  MD: "ui-button--md",
  LG: "ui-button--lg",
  ICON: "ui-button__icon",
  SPINNER: "ui-button__spinner",
} as const;
```

Export it from the component's `index.ts` and from `packages/ui/src/index.ts`:

```ts
// index.ts
export { Button, BUTTON_CSS_CLASSES } from "./Button";
export type { ButtonProps, ButtonColor, ButtonSize } from "./Button";
```

**When to create it**: add `COMPONENT_CSS_CLASSES` for any component with 6+ BEM classes. Simpler components (Divider, Badge) don't need it.

Consumers use these in tests and E2E selectors to avoid coupling to class name strings.

---

## Loading State (`isLoading`)

Components that perform async actions (Button, Input) support `isLoading`:

```tsx
export interface ButtonProps {
  /** Shows loading spinner and disables interaction. */
  isLoading?: boolean;
}

export function Button({ isLoading = false, isDisabled = false, children, ...rest }: ButtonProps) {
  const disabled = isDisabled || isLoading;

  return (
    <button
      {...rest}
      disabled={disabled}
      aria-disabled={disabled}
      aria-busy={isLoading || undefined}   // undefined removes the attribute when false
      data-loading={isLoading ? "true" : undefined}
      className={[
        "ui-button",
        isLoading && "ui-button--loading",
        isDisabled && "ui-button--disabled",
      ].filter(Boolean).join(" ")}
    >
      {isLoading && <span className="ui-button__spinner" aria-hidden="true" />}
      <span className={isLoading ? "ui-button__label ui-button__label--hidden" : "ui-button__label"}>
        {children}
      </span>
    </button>
  );
}
```

CSS for the spinner:

```css
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

/* Hide label text while loading (keep for screen readers) */
.ui-button__label--hidden {
  visibility: hidden;
  width: 0;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .ui-button__spinner {
    animation: none;
    opacity: 0.6;
  }
}
```

**Rules**:
- `isLoading` always implies disabled — set `disabled={isDisabled || isLoading}`
- `aria-busy={isLoading || undefined}` — `undefined` removes the attribute (cleaner DOM than `aria-busy="false"`)
- Spinner is `aria-hidden="true"` — the `aria-busy` attribute informs screen readers
- Label text stays in DOM (for layout stability) but is visually hidden during loading

---

## Loading Pattern Selection

Not every async operation should use the `isLoading` spinner-on-button pattern. Choose the right pattern for the scenario:

| Scenario | Pattern | Avoid |
|----------|---------|-------|
| Page / section initial load | **Skeleton screen** | Full-page spinner |
| Button action — fast, outcome certain (toggle, like) | **Optimistic UI** (update immediately, revert on error) | Blocking overlay |
| Button action — uncertain outcome (save form, submit) | **`isLoading` spinner on button** | Full-page overlay |
| File upload | **Progress bar** | Spinner |
| Long operation > 3s | **Progress bar + estimated time** | Spinner alone |
| Background data fetch (silent refresh) | **No indicator** | — |

Research: skeleton screens are perceived **20–30% faster** than spinners for initial page loads because they communicate structure while loading.

### Skeleton CSS Pattern

```css
/* Skeleton placeholder — mirrors the layout of the real content */
.ui-skeleton {
  background-color: var(--ui-bg-muted);
  border-radius: var(--ui-radius-sm);
  animation: ui-skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes ui-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}

@media (prefers-reduced-motion: reduce) {
  .ui-skeleton {
    animation: none;
  }
}
```

```tsx
{/* Skeleton is aria-hidden — it's a visual placeholder only */}
<div className="ui-skeleton" aria-hidden="true" style={{ height: "1.5rem", width: "60%" }} />
```
