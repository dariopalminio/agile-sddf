# Theming & Dark Mode Reference

How `ThemeProvider`, `useTheme`, and the CSS variable system work together in Tatians React UI.

---

## How Dark Mode Works

Dark mode is driven entirely by a `data-theme` attribute on `<html>`:

```
data-theme="dark" on <html>
    ↓
CSS variables in [data-theme="dark"] { } override :root values
    ↓
Every component using --ui-* semantic tokens updates automatically
```

**Rule**: if a component uses only `--ui-*` semantic tokens in its CSS, dark mode works with **zero extra code** in the component.

```css
/* ✅ This component is automatically dark-mode compatible */
.ui-card {
  background-color: var(--ui-bg-surface);   /* changes in dark */
  color: var(--ui-fg-default);              /* changes in dark */
  border: 1px solid var(--ui-border-default); /* changes in dark */
}

/* ❌ This component breaks in dark mode */
.ui-card {
  background-color: #ffffff;  /* hardcoded — won't change */
  color: #111827;
}
```

---

## ThemeProvider

Wrap the application root (or the demo/storybook root) with `ThemeProvider`:

```tsx
import { ThemeProvider } from "@tatians-react-ui-lib/ui";

// apps/demo/src/main.tsx
root.render(
  <ThemeProvider defaultTheme="system" enablePersistence>
    <App />
  </ThemeProvider>
);
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultTheme` | `"light" \| "dark" \| "system"` | `"system"` | Initial theme (uncontrolled mode). `"system"` reads OS preference. |
| `theme` | `"light" \| "dark"` | `undefined` | Controlled mode — consumer owns the state. |
| `onThemeChange` | `(theme: Theme) => void` | `undefined` | Fires whenever the resolved theme changes. |
| `enablePersistence` | `boolean` | `true` | Persist user preference to `localStorage`. |
| `customTheme` | `ThemeConfig` | `undefined` | Partial overrides for colors, spacing, radius tokens. |

### Controlled vs Uncontrolled

```tsx
// Uncontrolled — ThemeProvider manages state internally
<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>

// Controlled — consumer owns the theme state
const [theme, setTheme] = useState<"light" | "dark">("light");

<ThemeProvider theme={theme} onThemeChange={setTheme}>
  <App />
</ThemeProvider>
```

---

## useTheme() Hook

Call inside any component that is a descendant of `ThemeProvider`:

```tsx
import { useTheme } from "@tatians-react-ui-lib/ui";

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
```

### Return values

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `"light" \| "dark"` | Currently active theme. |
| `setTheme` | `(t: Theme) => void` | Set a specific theme. |
| `toggleTheme` | `() => void` | Toggle between light and dark. |
| `config.colors` | `ThemeColors` | Resolved semantic color tokens as CSS variable references. |
| `config.layout` | `LayoutTheme` | Spacing and radius scale as CSS variable references. |

`useTheme()` **throws** if called outside a `<ThemeProvider>`. Always verify the component tree includes one.

---

## themeScript — Preventing FOUC

FOUC (Flash of Unstyled Content) is the brief flash of the wrong theme on page load. Prevent it by injecting `themeScript` in `<head>` **before any rendered content**:

```tsx
// apps/demo/index.html — for Vite apps
<head>
  <script>
    // paste the contents of themeScript here, or import and inline it
  </script>
</head>

// Next.js App Router — _document.tsx or layout.tsx
import { themeScript } from "@tatians-react-ui-lib/ui";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

The script synchronously reads `localStorage` and sets `data-theme` on `<html>` before the first paint. Without it, SSR/static pages always start in light mode and then flash to dark.

---

## Using ThemeProvider in Storybook Stories

Wrap stories with ThemeProvider so components render correctly in both themes:

```tsx
// .storybook/preview.tsx
import { ThemeProvider } from "@tatians-react-ui-lib/ui";

export const decorators = [
  (Story) => (
    <ThemeProvider defaultTheme="system">
      <Story />
    </ThemeProvider>
  ),
];
```

Or per-story:

```tsx
// Button.stories.tsx
export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider theme="dark">
        <div style={{ padding: "var(--ui-space-lg)" }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};
```

---

## Using ThemeProvider in Unit Tests

```tsx
// test-utils.tsx — custom render with ThemeProvider
import { render } from "@testing-library/react";
import { ThemeProvider } from "@tatians-react-ui-lib/ui";

export function renderWithTheme(ui: React.ReactElement, theme: "light" | "dark" = "light") {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
}

// Usage in tests
test("renders in dark mode", () => {
  renderWithTheme(<Card>Content</Card>, "dark");
  // ...
});
```

---

## Anti-Patterns

### ❌ Using `prefers-color-scheme` directly in component CSS

```css
/* ❌ Don't do this in packages/ui component CSS */
@media (prefers-color-scheme: dark) {
  .ui-card {
    background-color: #1a1a1a;
  }
}
```

This bypasses `ThemeProvider` and breaks when the user manually selects a theme. The `data-theme` attribute is the only source of truth.

### ❌ Hardcoded colors in components

```css
/* ❌ Breaks dark mode */
.ui-card { background-color: white; color: black; }

/* ✅ Adapts automatically */
.ui-card { background-color: var(--ui-bg-surface); color: var(--ui-fg-default); }
```

### ❌ Calling useTheme() outside ThemeProvider

```tsx
/* ❌ Throws at runtime */
export function MyComponent() {
  const { theme } = useTheme(); // Error: must be inside ThemeProvider
}

/* ✅ Components in packages/ui never call useTheme() — they rely on CSS tokens */
/* useTheme() is for app-level UI like theme toggles, not for library components */
```

**Library components in `packages/ui` should never call `useTheme()`** — they get their dark mode for free through CSS tokens. `useTheme()` is for app-level components (e.g., theme toggle buttons in `apps/demo`).
