# Icons & SVG Reference

Two patterns for icons in `packages/ui`: dedicated Icon components and inline SVG.

---

## Two Patterns

| Pattern | When to use | Example |
|---------|------------|---------|
| **Icon component** | Reusable standalone icon exported from the library | `<CloseIcon />`, `<AddIcon />`, `<TrashIcon />` |
| **Inline SVG** | Icon used only inside one specific component | Alert color icons, spinner |

---

## Pattern 1: Icon Components

### File Structure

```
components/icons/
├── CloseIcon.tsx        ← component
├── CloseIcon.css        ← BEM class + sizing
└── CloseIcon.stories.tsx
```

### Props Interface

All icon components extend `React.SVGAttributes<SVGSVGElement>` and expose:

```tsx
"use client";

import React from "react";
import "./CloseIcon.css";

export interface CloseIconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Thicker stroke (2px) vs outline (1.5px). @default false */
  filled?: boolean;
  /** Size in px or CSS length. @default 24 */
  size?: number | string;
  /** Icon color. Defaults to currentColor (inherits from parent). */
  color?: string;
  /** Additional CSS class. */
  className?: string;
  /** data-testid for E2E selectors. @default "close-icon" */
  testId?: string;
  /**
   * Accessible label. When provided, role="img" is added automatically.
   * Omit for decorative icons (they get no role).
   */
  "aria-label"?: string;
}
```

### Implementation

```tsx
export function CloseIcon({
  filled = false,
  size = 24,
  color,
  className = "",
  testId = "close-icon",
  "aria-label": ariaLabel,
  ...props
}: CloseIconProps) {
  const sizeValue = typeof size === "number" ? `${size}px` : size;
  const strokeColor = color || "currentColor";  // inherit from parent by default
  const strokeWidth = filled ? "2" : "1.5";     // filled = bold, outline = thin

  const classNames = ["ui-close-icon", className].filter(Boolean).join(" ");

  return (
    <svg
      className={classNames}
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-testid={testId}
      role={ariaLabel ? "img" : undefined}   // role only when semantic
      aria-label={ariaLabel}                  // undefined = no attribute
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
```

### CSS

```css
.ui-close-icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
}
```

### Standards

| Property | Value | Why |
|----------|-------|-----|
| `viewBox` | `"0 0 24 24"` | All icon components use 24×24 viewBox |
| `strokeWidth` (outline) | `"1.5"` | Default visual weight for this design system |
| `strokeWidth` (filled) | `"2"` | Bold variant |
| `fill` | `"none"` | Stroke-based icons, not filled paths |
| `strokeLinecap` | `"round"` | Rounded line ends |
| `strokeLinejoin` | `"round"` | Rounded corners |
| `color` default | `currentColor` | Inherits from parent CSS `color` |

---

## Pattern 2: Inline SVG (inside a complex component)

Use when the icon only makes sense within one component and doesn't need to be reusable.

Example: color-specific icons inside `Alert`:

```tsx
// AlertIcon.tsx — internal, not exported
function AlertIcon({ color }: { color: string }) {
  if (color === "success") {
    return (
      <svg
        aria-hidden="true"      // always aria-hidden for decorative inline SVG
        width="20"              // inline SVG uses 20×20 (smaller than standalone 24)
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  // ...other color variants
}
```

**Inline SVG standards:**
- `aria-hidden="true"` — always, because the surrounding component provides accessible context
- `viewBox="0 0 20 20"` with `width/height="20"` — smaller size for within-component use
- Same stroke conventions: `fill="none"`, `strokeWidth="1.5"`, `strokeLinecap="round"`
- No `data-testid` — the parent component's testId covers it
- Not exported from `index.ts`

---

## Decorative vs Semantic Icons

### Decorative (most icons)

The icon adds visual interest but the surrounding text/context provides the meaning:

```tsx
// ✅ Text label next to icon — icon is decorative
<Button>
  <AddIcon />   {/* no aria-label on SVG — text "Save" provides the label */}
  Save
</Button>
```

The `CloseIcon` above will render without `role` or `aria-label` → screen readers skip it.

### Semantic (icon-only)

The icon IS the label — no surrounding text:

```tsx
// ✅ Icon-only button — aria-label on the BUTTON, not the SVG
<Button isIconOnly aria-label="Close dialog">
  <CloseIcon />   {/* no aria-label here — button's label is enough */}
</Button>

// ✅ Standalone icon with meaning (rare)
<CloseIcon aria-label="Close" />
// → renders with role="img" aria-label="Close"
```

**Rule**: `aria-label` belongs on the **interactive element** (button, link), not on the SVG inside it.

---

## Sizing Icons Next to Text

Use `1em` for icons that should scale with the surrounding text:

```tsx
// ✅ Icon scales with the button's font size
<Button>
  <CloseIcon size="1em" />
  Close
</Button>
```

Use a fixed pixel value for icons at a specific visual size:

```tsx
// ✅ Fixed size regardless of context
<CloseIcon size={20} />   // 20px
<CloseIcon size={32} />   // 32px
```

---

## Exporting Icon Components

Icon components are exported from the library's public API:

```ts
// packages/ui/src/index.ts
export { CloseIcon } from "./components/icons/CloseIcon";
export type { CloseIconProps } from "./components/icons/CloseIcon";
export { AddIcon } from "./components/icons/AddIcon";
export type { AddIconProps } from "./components/icons/AddIcon";
// ...
```

Each icon file has `"use client"` because SVG rendering is client-side.

---

## Adding a New Icon

1. Create `packages/ui/src/components/icons/MyIcon.tsx` following the pattern above
2. Create `packages/ui/src/components/icons/MyIcon.css` with `.ui-my-icon { display: inline-block; flex-shrink: 0; vertical-align: middle; }`
3. Export from `packages/ui/src/index.ts`
4. Add `MyIcon.stories.tsx` to document outline and filled variants

Do **not** add new icon dependencies (no `react-icons`, no `heroicons` package). All icons are authored inline in the project.
