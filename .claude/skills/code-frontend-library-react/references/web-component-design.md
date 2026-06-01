# Web Component Design Reference

Design and API principles for components in `packages/ui`. All examples use the real conventions of Tatians React UI.

## Component API Design

### Props Interface Pattern

```tsx
// ✅ Tatians pattern
export type ButtonColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  /** Visual color variant. @default "primary" */
  color?: ButtonColor;
  /** Disables interaction and applies disabled styling. */
  isDisabled?: boolean;
  /** data-testid for E2E selectors. Defaults to "ui-button-{color}" */
  testId?: string;
  children: React.ReactNode;
}
```

**Principles:**
- Extend native HTML attributes with `Omit` to avoid prop name conflicts
- Rename overridden attrs: `disabled` → `isDisabled`, `type` → semantically named variant
- All boolean props use `is*` prefix: `isDisabled`, `isLoading`, `isIconOnly`
- `testId` is always in the public interface
- Export variant types so consumers can type-check prop values
- JSDoc on every exported prop

### Sensible Defaults

Provide defaults for all optional props. Validate with runtime arrays:

```tsx
const VALID_COLORS: ButtonColor[] = ["default", "primary", "secondary", "success", "warning", "danger"];

export function Button({ color = "primary", size = "md", ...props }: ButtonProps) {
  const resolvedColor = VALID_COLORS.includes(color) ? color : "primary";
  if (color && !VALID_COLORS.includes(color)) {
    console.warn(`[Button] Invalid color "${color}". Falling back to "primary".`);
  }
  // ...
}
```

**Keep union types to 6 values or fewer.** Beyond 6 options, consumers face measurably slower decisions (Hick's Law). Button's 6 colors is the project's upper bound. If a new variant seems to need 7+ values, consider whether two orthogonal props with fewer values each better model the intent — for example `color` × `variant` ("filled" | "outlined") instead of expanding the color enum.

## Composition Patterns

### Compound Components (Project Standard)

Used by `Card` with `CardHeader`, `CardBody`, `CardFooter`. Each sub-component is exported individually and can be composed freely.

```tsx
// Card.tsx — root component
export function Card({ children, isPressable = false, testId, ...rest }: CardProps) {
  return (
    <div
      className={`ui-card${isPressable ? " ui-card--pressable" : ""}`}
      data-testid={testId ?? "ui-card"}
      {...rest}
    >
      {children}
    </div>
  );
}

// CardHeader.tsx — sub-component (separate file)
export function CardHeader({ children, ...rest }: CardHeaderProps) {
  return (
    <div className="ui-card__header" {...rest}>
      {children}
    </div>
  );
}

// index.ts — export all parts
export { Card } from "./Card";
export { CardHeader } from "./CardHeader";
export { CardBody } from "./CardBody";
export { CardFooter } from "./CardFooter";
export type { CardProps } from "./Card";

// Consumer usage
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter><Button>Action</Button></CardFooter>
</Card>
```

### Context-Based Group Components

For groups like `CheckboxGroup` / `RadioGroup`, share state via context:

```tsx
// CheckboxGroupContext.tsx
interface CheckboxGroupContextValue {
  value: string[];
  onChange: (value: string[]) => void;
  isDisabled?: boolean;
  name?: string;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export function useCheckboxGroupContext() {
  return useContext(CheckboxGroupContext); // null = not inside a group
}

export function CheckboxGroup({ value, onChange, isDisabled, children }: CheckboxGroupProps) {
  return (
    <CheckboxGroupContext.Provider value={{ value, onChange, isDisabled }}>
      <div role="group" className="ui-checkbox-group">
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
}

// Checkbox.tsx — reads group context if present
export function Checkbox({ isDisabled: ownDisabled, ...props }: CheckboxProps) {
  const group = useCheckboxGroupContext();
  const isDisabled = group?.isDisabled ?? ownDisabled ?? false;
  // ...
}
```

### forwardRef

Required when consumers may need DOM access (inputs, textareas, interactive elements):

```tsx
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isDisabled = false, testId, ...rest }, ref) => (
    <input
      ref={ref}
      {...rest}
      disabled={isDisabled}
      className="ui-input"
      data-testid={testId ?? "ui-input"}
    />
  ),
);
Input.displayName = "Input";
```

## Controlled vs Uncontrolled

Prefer **controlled** components (value + onChange). Provide `defaultValue` for uncontrolled fallback:

```tsx
export interface InputProps {
  value?: string;            // controlled
  defaultValue?: string;     // uncontrolled
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

## Stateless vs Stateful

Default to **stateless** (all state in props). Add internal state only for UI concerns the consumer doesn't need to own:

| Stateless (in props) | Stateful (internal) |
|---------------------|---------------------|
| `value`, `isChecked` | Password visibility toggle |
| `isDisabled`, `isLoading` | Hover/focus/pressed tracking for custom styling |
| `isOpen` (controlled modal) | — |

```tsx
// Password visibility is an internal UI concern — consumer doesn't need it
export function Input({ type, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = type === "password" && showPassword ? "text" : type;
  // ...
}
```

## TypeScript Typing Conventions

```tsx
// ✅ Explicit union types for variants
export type AlertColor = "default" | "primary" | "success" | "warning" | "danger";

// ✅ Readonly arrays for runtime validation
const VALID_COLORS = ["default", "primary", "success", "warning", "danger"] as const;

// ✅ Omit conflicting HTML attrs
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "checked" | "defaultChecked" | "disabled"> {
  isChecked?: boolean;
  isDisabled?: boolean;
}

// ✅ Children typed explicitly
interface ModalProps {
  children: React.ReactNode;
  title: string;
}

// ❌ Avoid
const Component: React.FC<Props> = ({ ... }) => { ... };  // No React.FC
const x: any = ...;                                        // No any
```

## `"use client"` Directive

Required in `index.ts` for interactive components:

```ts
// index.ts — interactive component
"use client";
export { Button } from "./Button";

// index.ts — purely presentational (safe to omit)
// No "use client" needed for Divider, Spacer, Badge
export { Divider } from "./Divider";
```

Interactive = uses `useState`, `useEffect`, event handlers, `useRef`, or `useContext` with state.

## ThemeProvider Integration

Tatians components work automatically with `ThemeProvider`. No special integration needed in individual components — they inherit tokens from CSS variables.

```tsx
// App root
import { ThemeProvider, themeScript } from "@tatians-react-ui-lib/ui";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <YourApp />
    </ThemeProvider>
  );
}
```

Access theme in components only if you need to read/change it programmatically:

```tsx
import { useTheme } from "@tatians-react-ui-lib/ui";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
```

## Build & Export Chain

```
packages/ui/src/components/Button/Button.tsx
                                  Button.css
                                  index.ts  ("use client" + exports)
                             ↓
packages/ui/src/index.ts    (re-exports all components)
                             ↓
tsup build
                             ↓
packages/ui/dist/index.js   (ESM)
packages/ui/dist/index.cjs  (CJS)
packages/ui/dist/index.d.ts (types)
packages/ui/dist/styles.css (all component CSS + tokens)
```

Always add new exports to `packages/ui/src/index.ts`:

```ts
export { Button } from "./components/Button";
export type { ButtonProps, ButtonColor, ButtonSize } from "./components/Button";
```
