---
name: code-frontend-library-react
description: |
  Implement React components for React UI Library: CSS pure + BEM + design tokens, TypeScript strict, tsup build, Turborepo monorepo. Use when creating new components, adding variants, or integrating with demo/storybook apps.

---

#  Code Front-end Library-React Components (React UI Library)

Implement production-ready components for `packages/ui` following the project's strict conventions: plain CSS + CSS variables, BEM naming, two-layer token system, TypeScript strict, and Next.js App Router compatibility.

> **Testing is out of scope for this skill.** For unit tests use `test-react-testing-library`; for E2E use `test-e2e-playwright-cucumber`.

## When to Use This Skill

- Creating a new UI component in `packages/ui/src/components/`
- Adding a new variant or size to an existing component
- IMPLEMENT compound component sub-parts (e.g., `CardHeader`, `CardBody`)
- Adding a component page/demo to `apps/demo`
- Adding Storybook stories to `apps/storybook`
- Refactoring a component to use the `--ui-*` token system
- Making a component Next.js App Router compatible (`"use client"`)

## Reference Guide

Load the relevant reference based on what you're IMPLEMENT:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Component Structure | `references/component-structure.md` | Creating or scaffolding any component |
| Design Tokens | `references/design-tokens.md` | Writing CSS, choosing colors, spacing, radius |
| Component Patterns | `references/component-patterns.md` | Compound components, forwardRef, controlled/uncontrolled |
| Storybook Patterns | `references/storybook-patterns.md` | Writing `.stories.tsx` files |
| Accessibility | `references/accessibility-patterns.md` | ARIA, keyboard nav, focus management |
| CSS Styling | `references/css-styling-approaches.md` | CSS conventions, BEM, CSS variable usage |
| Web Component Design | `references/web-component-design.md` | Component API design, composition, TypeScript typing |
| Responsive Design | `references/responsive-design.md` | Adaptive components (container queries), demo layouts, touch targets, fluid values |
| Visual Design Principles | `references/visual-design-principles.md` | Design decisions: spacing grid, color philosophy, typography hierarchy, shadows, border radius, anti-patterns |
| Animation & Transitions | `references/animation-transitions.md` | CSS transition standards, prefers-reduced-motion, spinner, hover/press patterns |
| Theming & Dark Mode | `references/theming-dark-mode.md` | ThemeProvider, useTheme(), themeScript, dark mode integration |
| Icons & SVG | `references/icons-svg.md` | Icon components, inline SVG, aria-hidden, decorative vs semantic |

## Stack & Architecture

| Concern | Technology |
|---------|-----------|
| Framework | React 18.2+ (plain functions, no `React.FC`) |
| Language | TypeScript strict mode — no `any` |
| Styling | Plain CSS + CSS Variables (`--ui-*` prefix) |
| Class naming | BEM: `.ui-component`, `.ui-component--modifier`, `.ui-component__element` |
| Build | tsup → ESM + CJS + DTS + styles.css |
| Monorepo | Turborepo with `packages/ui`, `apps/demo`, `apps/storybook` |
| Theming | `ThemeProvider` + `useTheme()` + `data-theme="dark"` |
| Next.js | App Router compatible, `"use client"` on interactive components |

## Non-Negotiable Rules

1. **No CSS-in-JS, no Tailwind, no CSS Modules** — plain `.css` files only
2. **Only semantic tokens** in component CSS (`--ui-action-primary`, not `--ui-palette-brand-500`)
3. **No external runtime dependencies** in `packages/ui` (only exception: `focus-trap-react`)
4. **TypeScript strict** — export all public types, JSDoc on public props, no `any`
5. **`"use client"`** directive required on interactive components in `index.ts`
6. **`testId` prop** is part of the public API — render `data-testid={testId ?? "ui-{name}-{variant}"}`
7. **Validate prop values** at runtime with `VALID_*` const arrays + `console.warn` in dev

## Checklist for a New Component

- [ ] `ComponentName/ComponentName.tsx` — component function with typed props
- [ ] `ComponentName/ComponentName.css` — BEM classes using `--ui-*` semantic tokens
- [ ] `ComponentName/ComponentName.stories.tsx` — Storybook v8 stories
- [ ] `ComponentName/ComponentName.test.tsx` — Vitest unit tests (separate skill)
- [ ] `ComponentName/index.ts` — re-export with `"use client"` if interactive
- [ ] `ComponentName/types.ts` — if props are complex (optional)
- [ ] Export added to `packages/ui/src/index.ts`
- [ ] `ComponentNameDemo.tsx` in `apps/demo/src/components/`
- [ ] `ComponentNamePage.tsx` in `apps/demo/src/pages/`
- [ ] Route added in `apps/demo/src/App.tsx`
- [ ] Entry added in `apps/demo/src/components/SidebarDemo.tsx`

## Resources

- Constitution: `.specify/memory/constitution.md`
- Design tokens: `packages/ui/src/tokens/`
- CSS entry: `packages/ui/src/styles.css`
- Public API: `packages/ui/src/index.ts`
- Button reference implementation: `packages/ui/src/components/Button/`
- Input reference implementation: `packages/ui/src/components/Input/`
- Card reference implementation: `packages/ui/src/components/Card/`
