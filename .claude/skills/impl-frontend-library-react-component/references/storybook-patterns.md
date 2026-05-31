# Storybook Patterns Reference

Conventions for `.stories.tsx` files in `packages/ui/src/components/`. Uses Storybook v8 with CSF3 format.

## File Skeleton

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",       // Always "Components/{Name}" or "Layout/{Name}"
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],               // Enables auto-generated docs page
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
      table: { defaultValue: { summary: "primary" } },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      table: { defaultValue: { summary: "md" } },
    },
    isDisabled: { control: "boolean" },
    isLoading:  { control: "boolean" },
    onPress:    { action: "pressed" },   // Captures events in Actions panel
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
```

## Story Types

### 1. Single Variant Story

One story per important prop value. Keep `args` minimal.

```tsx
export const Primary: Story = {
  args: { color: "primary", children: "Primary" },
};

export const Secondary: Story = {
  args: { color: "secondary", children: "Secondary" },
};

export const Disabled: Story = {
  args: { color: "primary", isDisabled: true, children: "Disabled" },
};
```

### 2. Showcase Story — All Variants in a Grid

Use a descriptive `name` with the pattern `"Showcase — {description}"`.

```tsx
export const AllColors: Story = {
  name: "Showcase — All 6 Color Variants",
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
      <Button color="default">Default</Button>
      <Button color="primary">Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="success">Success</Button>
      <Button color="warning">Warning</Button>
      <Button color="danger">Danger</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  name: "Showcase — All 3 Sizes",
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
```

### 3. Render Story — Custom JSX

Use `render` when the story needs composition or special wrappers.

```tsx
export const WithIcon: Story = {
  name: "With Icon (leading)",
  args: { children: "Save" },
  render: (args) => (
    <Button {...args}>
      <SaveIcon aria-hidden="true" />
      {args.children}
    </Button>
  ),
};
```

### 4. Icon-Only Story

`aria-label` is mandatory for icon-only buttons (WCAG 2.1 AA).

```tsx
export const IconOnly: Story = {
  name: "Icon Only — All Sizes",
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Button isIconOnly size="sm" aria-label="Add small"><PlusIcon /></Button>
      <Button isIconOnly size="md" aria-label="Add"><PlusIcon /></Button>
      <Button isIconOnly size="lg" aria-label="Add large"><PlusIcon /></Button>
    </div>
  ),
};
```

### 5. Compound Component Story

Show sub-parts together. Use named child components.

```tsx
import { Card, CardHeader, CardBody, CardFooter } from "./Card";

export const WithAllSlots: Story = {
  name: "Compound — Header + Body + Footer",
  render: () => (
    <Card style={{ width: 320 }}>
      <CardHeader>
        <h3 style={{ margin: 0, color: "var(--ui-fg-default)" }}>Card Title</h3>
      </CardHeader>
      <CardBody>
        <p style={{ margin: 0, color: "var(--ui-fg-muted)", fontSize: "0.875rem" }}>
          Card description goes here.
        </p>
      </CardBody>
      <CardFooter>
        <Button size="sm" color="primary">Action</Button>
      </CardFooter>
    </Card>
  ),
};
```

## Naming Conventions

| Pattern | Example |
|---------|---------|
| Single variant | `Primary`, `Secondary`, `Danger` |
| State variant | `Disabled`, `Loading`, `ReadOnly` |
| Showcase grid | `"Showcase — All 6 Color Variants"` |
| Icon variant | `"Icon Only — All Sizes"` |
| Compound | `"Compound — Header + Body + Footer"` |
| Dark mode | `"Dark Mode — Primary Variants"` |
| Interaction | `"Interactive — Hover and Focus States"` |

## Inline Styles in Stories

Use CSS tokens directly in `style` props — this matches the library's theming.

```tsx
// ✅ Correct — uses design tokens
<p style={{ color: "var(--ui-fg-muted)", fontSize: "0.875rem" }}>

// ❌ Avoid — hardcoded values
<p style={{ color: "#6b7280", fontSize: "14px" }}>
```

## argTypes Patterns

```tsx
argTypes: {
  // Select control
  color: {
    control: "select",
    options: ["default", "primary", "secondary", "success", "warning", "danger"],
    description: "Visual color variant",
    table: { defaultValue: { summary: "primary" } },
  },
  // Boolean toggle
  isDisabled: {
    control: "boolean",
    description: "Disables the component",
    table: { defaultValue: { summary: "false" } },
  },
  // Action (event callback)
  onClick: { action: "clicked" },
  onPress: { action: "pressed" },
  // Hide internal/technical props from controls
  testId: { table: { disable: true } },
  className: { table: { disable: true } },
}
```

## Parameters

```tsx
parameters: {
  layout: "centered",    // Most components
  // layout: "fullscreen",  // Layout/page-level components
  backgrounds: {
    default: "light",
    values: [
      { name: "light", value: "var(--ui-bg-surface)" },
      { name: "dark",  value: "#0f0f0f" },
      { name: "gradient", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    ],
  },
}
```

## Story Organization Order

Within a stories file, order stories from simple to complex:

1. Default / Primary (most common usage)
2. Individual color variants
3. Size variants
4. Radius variants
5. State variants (disabled, loading, error)
6. Composition / compound stories
7. Showcase (all-at-once grids)
8. Edge cases (icon-only, very long text, etc.)
