## 1. Setup y estructura

- [ ] T001: Crear archivo `src/utils/slug.ts` con la firma de la función `toSlug` exportada (stub vacío)
- [ ] T002: Crear archivo `src/utils/slug.test.ts` con la estructura de tests (describe + its vacíos)

## 2. Implementación TDD de `toSlug`

- [ ] T003: AC-1 — Escribir test para conversión básica de título a slug (minúsculas + espacios a guiones) y generar implementación mínima
- [ ] T004: AC-2 — Escribir test para eliminación de caracteres especiales y diacríticos; extender implementación con NFD + regex
- [ ] T005: AC-3 — Escribir test para espacios múltiples y guiones duplicados; extender implementación con collapse + trim
- [ ] T006: AC-4 — Escribir test para entrada vacía o solo espacios; verificar que la implementación actual ya lo satisface o ajustar

## 3. Integración en el módulo de utilidades

- [ ] T007: Exportar `toSlug` desde `src/utils/index.ts` como parte de la API pública de utilidades
