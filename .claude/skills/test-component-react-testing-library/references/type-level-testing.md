# Type-Level Testing

Verify that TypeScript types exported by your library are correct at **compile time**, not at runtime.

## When to Write Type-Level Tests

> **Recommendation**: Write type-level tests when the API is stable and external consumers start depending on your types. During active development, behavior tests with Testing Library give more value per effort. Once the public API is frozen, type tests protect consumers from silent breaking changes in exported types.

Symptoms that indicate it's time to add type-level tests:
- The library has external consumers (other apps or teams)
- You've had incidents where a type change broke consumer code silently
- You export complex generics, conditional types, or overloads
- CI needs to guarantee types work across TypeScript versions

---

## Setup

### 1. Enable typecheck in Vitest

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    typecheck: { enabled: true },
  },
});
```

### 2. Add a test script

```json
{
  "scripts": {
    "test": "vitest run",
    "test:types": "vitest typecheck"
  }
}
```

### 3. File naming convention

Type test files use the `.test-d.ts` (or `.test-d.tsx`) suffix — the `-d` signals "declaration/types only":

```
packages/ui/src/components/Button/
├── Button.tsx
├── Button.test.tsx        ← behavior tests (Testing Library)
└── Button.test-d.ts       ← type-level tests (vitest typecheck)
```

---

## Core API: `expectTypeOf`

Imported from `vitest` — no extra packages needed:

```typescript
import { describe, expectTypeOf, it } from "vitest";
```

### Key matchers

```typescript
// Exact type equality
expectTypeOf<ButtonColor>().toEqualTypeOf<"default" | "primary">();

// Assignability (less strict)
expectTypeOf<"primary">().toMatchTypeOf<ButtonColor>();

// Type checks
expectTypeOf(value).toBeString();
expectTypeOf(value).toBeNumber();
expectTypeOf(value).toBeBoolean();
expectTypeOf(value).toBeUndefined();
expectTypeOf(value).toBeNull();
expectTypeOf(value).toBeFunction();
expectTypeOf(value).toBeObject();

// Callable
expectTypeOf(fn).toBeCallableWith(arg1, arg2);

// Return type
expectTypeOf(fn).returns.toEqualTypeOf<ReturnType>();

// Parameters
expectTypeOf(fn).parameters.toEqualTypeOf<[string, number]>();

// Negate
expectTypeOf<string>().not.toEqualTypeOf<number>();
```

---

## Examples for a React Component Library

### Testing variant types (ButtonColor, ButtonSize)

```typescript
// Button.test-d.ts
import { describe, expectTypeOf, it } from "vitest";
import type { ButtonColor, ButtonSize, ButtonRadius, ButtonProps } from "./Button";

describe("ButtonColor", () => {
  it("includes all 6 variant values", () => {
    expectTypeOf<ButtonColor>().toEqualTypeOf<
      "default" | "primary" | "secondary" | "success" | "warning" | "danger"
    >();
  });
});

describe("ButtonSize", () => {
  it("includes sm, md, lg", () => {
    expectTypeOf<ButtonSize>().toEqualTypeOf<"sm" | "md" | "lg">();
  });
});

describe("ButtonRadius", () => {
  it("includes all radius options", () => {
    expectTypeOf<ButtonRadius>().toEqualTypeOf<
      "none" | "sm" | "md" | "lg" | "full"
    >();
  });
});
```

### Testing props interface

```typescript
describe("ButtonProps", () => {
  it("color is optional", () => {
    expectTypeOf<ButtonProps["color"]>().toEqualTypeOf<ButtonColor | undefined>();
  });

  it("isDisabled is optional boolean", () => {
    expectTypeOf<ButtonProps["isDisabled"]>().toEqualTypeOf<boolean | undefined>();
  });

  it("testId is optional string", () => {
    expectTypeOf<ButtonProps["testId"]>().toEqualTypeOf<string | undefined>();
  });

  it("children is required ReactNode", () => {
    expectTypeOf<ButtonProps["children"]>().toEqualTypeOf<React.ReactNode>();
  });

  it("extends button HTML attributes", () => {
    // ButtonProps should accept standard button attrs like onClick, aria-label
    expectTypeOf<ButtonProps>().toMatchTypeOf<{
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
      "aria-label"?: string;
    }>();
  });
});
```

### Testing forwardRef components (Input, Checkbox)

```typescript
// Input.test-d.ts
import { describe, expectTypeOf, it } from "vitest";
import { Input } from "./Input";
import type { InputProps } from "./Input";
import React from "react";

describe("Input forwardRef", () => {
  it("accepts an HTMLInputElement ref", () => {
    // The component should be typed to accept a ref to HTMLInputElement
    const ref = React.createRef<HTMLInputElement>();
    // If this compiles, the ref type is correct
    expectTypeOf(ref).toMatchTypeOf<React.RefObject<HTMLInputElement>>();
  });

  it("errorMessage is optional string", () => {
    expectTypeOf<InputProps["errorMessage"]>().toEqualTypeOf<string | undefined>();
  });
});
```

### Testing public API exports

```typescript
// index.test-d.ts — verify the public API exports the expected types
import type {
  ButtonProps,
  ButtonColor,
  ButtonSize,
  InputProps,
  CardProps,
} from "../../index";
import { describe, expectTypeOf, it } from "vitest";

describe("Public API exports", () => {
  it("ButtonColor is exported", () => {
    expectTypeOf<ButtonColor>().not.toBeNever();
  });

  it("ButtonProps is exported", () => {
    expectTypeOf<ButtonProps>().not.toBeNever();
  });

  it("InputProps is exported", () => {
    expectTypeOf<InputProps>().not.toBeNever();
  });

  it("CardProps is exported", () => {
    expectTypeOf<CardProps>().not.toBeNever();
  });
});
```

### Protecting against silent breaking changes

```typescript
// This test catches the common mistake of accidentally narrowing a union type
describe("ButtonColor — regression guard", () => {
  it("secondary variant is still in ButtonColor (regression: was removed in v1.2)", () => {
    // If "secondary" is accidentally removed from ButtonColor, this test fails
    expectTypeOf<"secondary">().toMatchTypeOf<ButtonColor>();
  });

  it("danger variant is still in ButtonColor", () => {
    expectTypeOf<"danger">().toMatchTypeOf<ButtonColor>();
  });
});
```

---

## Running Type Tests

```bash
# Run only type tests
pnpm test:types

# Or directly
pnpm vitest typecheck

# In watch mode
pnpm vitest typecheck --watch
```

Type tests do **not** execute at runtime — they only run the TypeScript compiler. A failing type test means a type error, not a runtime error.

---

## What NOT to test with type-level tests

| Do test | Don't test |
|---------|-----------|
| Exported union types (ButtonColor, ButtonSize) | Internal implementation types |
| Props interface structure | CSS class names |
| forwardRef ref type | Component render output |
| Public API exports | Private helper functions |
| Generic type inference | Runtime behavior |

For runtime behavior → use `@testing-library/react` (see `vitest-component.md`).
For accessibility → use `axe-core` (see `axe-core.md`).
