# Component Patterns Reference

React patterns used in `packages/ui`. All examples follow Tatians conventions (no CSS-in-JS, plain functions, TypeScript strict).

## Compound Components

Compound components share a parent context and let consumers compose sub-parts freely. Used by `Card` in this project.

```tsx
// Card.tsx
import "./Card.css";

export type CardColor = "default" | "primary" | "secondary";

export interface CardProps {
  /** Visual color variant. @default "default" */
  color?: CardColor;
  /** Enables press/click interaction. */
  isPressable?: boolean;
  /** Disables interaction. */
  isDisabled?: boolean;
  /** data-testid for E2E selectors. */
  testId?: string;
  children: React.ReactNode;
}

const VALID_COLORS: CardColor[] = ["default", "primary", "secondary"];

export function Card({
  color = "default",
  isPressable = false,
  isDisabled = false,
  testId,
  children,
  ...rest
}: CardProps) {
  const resolvedColor = VALID_COLORS.includes(color!) ? color! : "default";

  const className = [
    "ui-card",
    `ui-card--${resolvedColor}`,
    isPressable && "ui-card--pressable",
    isDisabled && "ui-card--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...rest}
      className={className}
      data-testid={testId ?? "ui-card"}
      data-disabled={isDisabled ? "true" : undefined}
      role={isPressable ? "button" : undefined}
      tabIndex={isPressable && !isDisabled ? 0 : undefined}
    >
      {children}
    </div>
  );
}
```

```tsx
// CardHeader.tsx
export interface CardHeaderProps {
  children: React.ReactNode;
  testId?: string;
}

export function CardHeader({ children, testId }: CardHeaderProps) {
  return (
    <div className="ui-card__header" data-testid={testId ?? "ui-card-header"}>
      {children}
    </div>
  );
}
```

```tsx
// index.ts
"use client";

export { Card } from "./Card";
export { CardHeader } from "./CardHeader";
export { CardBody } from "./CardBody";
export { CardFooter } from "./CardFooter";
export type { CardProps } from "./Card";
```

```tsx
// Consumer usage
<Card isPressable>
  <CardHeader>
    <h3>Title</h3>
  </CardHeader>
  <CardBody>
    <p>Description</p>
  </CardBody>
  <CardFooter>
    <Button size="sm">Action</Button>
  </CardFooter>
</Card>
```

## forwardRef Pattern

Use for Input, Checkbox, Textarea — any component where the parent may need direct DOM access.

```tsx
import { forwardRef } from "react";
import "./Input.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>,
  "disabled" | "size"> {
  /** Field label. */
  label?: string;
  /** Error message — also sets aria-invalid. */
  errorMessage?: string;
  /** Size variant. @default "md" */
  size?: InputSize;
  /** Disables the input. */
  isDisabled?: boolean;
  /** data-testid for E2E selectors. */
  testId?: string;
}

const VALID_SIZES: InputSize[] = ["sm", "md", "lg"];

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, errorMessage, size = "md", isDisabled = false, testId, ...rest }, ref) => {
    const resolvedSize = VALID_SIZES.includes(size) ? size : "md";

    const inputClassName = [
      "ui-input",
      `ui-input--${resolvedSize}`,
      errorMessage && "ui-input--error",
      isDisabled && "ui-input--disabled",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="ui-input-wrapper">
        {label && (
          <label className="ui-input__label">{label}</label>
        )}
        <input
          ref={ref}
          {...rest}
          className={inputClassName}
          disabled={isDisabled}
          aria-invalid={!!errorMessage}
          aria-disabled={isDisabled}
          data-testid={testId ?? "ui-input"}
          data-disabled={isDisabled ? "true" : undefined}
        />
        {errorMessage && (
          <span className="ui-input__helper ui-input__helper--error" role="alert">
            {errorMessage}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
```

## Context Group Pattern

Used by `CheckboxGroup` and `RadioGroup` to share state with child items.

```tsx
// useCheckboxGroupContext.ts
import { createContext, useContext } from "react";

export interface CheckboxGroupContextValue {
  value: string[];
  onChange: (value: string[]) => void;
  isDisabled?: boolean;
  name?: string;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export function useCheckboxGroupContext() {
  return useContext(CheckboxGroupContext); // null when used outside a group
}

export { CheckboxGroupContext };
```

```tsx
// CheckboxGroup.tsx
import { CheckboxGroupContext, type CheckboxGroupContextValue } from "./useCheckboxGroupContext";

export interface CheckboxGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  isDisabled?: boolean;
  children: React.ReactNode;
  testId?: string;
}

export function CheckboxGroup({ value, onChange, isDisabled, children, testId }: CheckboxGroupProps) {
  const contextValue: CheckboxGroupContextValue = { value, onChange, isDisabled };

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <div role="group" className="ui-checkbox-group" data-testid={testId ?? "ui-checkbox-group"}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
}
```

```tsx
// Checkbox.tsx — reads group context when present
export function Checkbox({
  value,
  isDisabled: ownDisabled,
  isChecked: ownChecked,
  onChange: ownOnChange,
  ...rest
}: CheckboxProps) {
  const group = useCheckboxGroupContext();

  // Group overrides individual props when inside a CheckboxGroup
  const isDisabled = group?.isDisabled ?? ownDisabled ?? false;
  const isChecked = group ? group.value.includes(value ?? "") : ownChecked ?? false;

  const handleChange = () => {
    if (group && value) {
      const next = isChecked
        ? group.value.filter((v) => v !== value)
        : [...group.value, value];
      group.onChange(next);
    } else {
      ownOnChange?.(!isChecked);
    }
  };

  // ...
}
```

## Controlled vs Uncontrolled

Prefer controlled. Support `defaultValue` for uncontrolled convenience.

```tsx
export interface InputProps {
  value?: string;          // controlled
  defaultValue?: string;   // uncontrolled default
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Controlled
<Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

// Uncontrolled
<Input defaultValue="initial text" />
```

## Internal State — When to Add

Add internal state only for UI details the consumer doesn't need to manage:

```tsx
// ✅ Password visibility — pure UI concern
export function Input({ type, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = type === "password" && showPassword ? "text" : type;
  return (
    <div className="ui-input-wrapper">
      <input type={resolvedType} {...props} />
      {type === "password" && (
        <button
          type="button"
          className="ui-input__toggle"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
  );
}
```

## Prop Validation Pattern

Always validate string union props at runtime with constant arrays:

```tsx
export type ButtonColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

const VALID_COLORS: ButtonColor[] = ["default", "primary", "secondary", "success", "warning", "danger"];

export function Button({ color = "primary", ...props }: ButtonProps) {
  let resolvedColor: ButtonColor = "primary";

  if (VALID_COLORS.includes(color as ButtonColor)) {
    resolvedColor = color as ButtonColor;
  } else if (process.env.NODE_ENV !== "production") {
    console.warn(`[Button] Invalid color "${color}". Using "primary".`);
  }

  // use resolvedColor in className, not raw color
}
```

## Slot Pattern (Tatians Style)

Cards, Modals, and Drawers use named slot components, not prop-based slots:

```tsx
// ✅ Tatians: named exported sub-components
<Modal>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter><Button>Close</Button></ModalFooter>
</Modal>

// ❌ Not used in this project: prop-based slots
<Modal header={<Title />} footer={<Actions />}>
  Content
</Modal>
```

## Overlay Pattern (Modal, Drawer, Popover)

Components that float above the page use three techniques together:

### 1. `createPortal` — escape the stacking context

```tsx
"use client";

import { createPortal } from "react-dom";

export function Modal({ isOpen, children }: ModalProps) {
  if (!isOpen || typeof document === "undefined") return null;

  // Render directly into document.body — avoids z-index/overflow issues
  return createPortal(
    <div className="ui-modal-backdrop">
      {children}
    </div>,
    document.body
  );
}
```

### 2. `FocusTrap` — trap keyboard focus inside the overlay

`focus-trap-react` is the **only allowed external runtime dependency** in `packages/ui`:

```tsx
import FocusTrap from "focus-trap-react";
import { useRef } from "react";

export function Modal({ isOpen, onOpenChange, children }: ModalProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div className="ui-modal-backdrop" aria-hidden="true" onClick={() => onOpenChange(false)} />
      <FocusTrap
        focusTrapOptions={{
          escapeDeactivates: false,        // handled manually below
          clickOutsideDeactivates: false,  // handled by backdrop click
          returnFocusOnDeactivate: true,   // return focus to trigger on close
          fallbackFocus: () => wrapperRef.current ?? document.body,
        }}
      >
        <div ref={wrapperRef} className="ui-modal-wrapper" role="dialog" aria-modal="true">
          {children}
        </div>
      </FocusTrap>
    </>,
    document.body
  );
}
```

### 3. Body scroll lock

Lock page scroll while the overlay is open; restore the previous value on close:

```tsx
useEffect(() => {
  if (!isOpen) return;
  const previous = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = previous;  // restore, not just clear
  };
}, [isOpen]);
```

### 4. Escape key handler

```tsx
useEffect(() => {
  if (!isOpen) return;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [isOpen, onOpenChange]);
```

### Z-index

Use the token `--ui-z-modal` — never hardcode a z-index in overlay CSS:

```css
.ui-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--ui-z-modal);
  background-color: var(--ui-overlay-backdrop);
}

.ui-modal-wrapper {
  position: fixed;
  inset: 0;
  z-index: var(--ui-z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* wrapper doesn't block — children do */
}

.ui-modal-content {
  pointer-events: all;
  background-color: var(--ui-bg-surface);
  border-radius: var(--ui-radius-lg);
  box-shadow: var(--ui-shadow-lg);
  max-height: min(90dvh, 800px);
  overflow-y: auto;
}
```

### useDisclosure helper

The project provides `useDisclosure` for controlling open/close state:

```tsx
// Modal/useDisclosure.ts — already exists, reuse it
export function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  return { isOpen, open, close, toggle, onOpenChange: setIsOpen };
}

// Usage
const { isOpen, open, close, onOpenChange } = useDisclosure();

<Button onClick={open}>Open Modal</Button>
<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
  ...
</Modal>
```
