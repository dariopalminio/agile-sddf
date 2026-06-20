---
type: design
id: FEAT-099
slug: feat-099-generador-de-slugs-design
title: "Design: Generador de Slugs"
story: FEAT-099
created: 2026-05-01
updated: 2026-05-01
---

# Design: Generador de Slugs

## Contexto

Función utilitaria pura para transformar títulos en slugs URL-seguros. No requiere dependencias externas; usa solo operaciones de string nativas del lenguaje.

## Componentes Afectados

### `toSlug` (función utilitaria)

- **Tipo:** Función pura exportada
- **Ubicación:** `src/utils/slug.ts`
- **Responsabilidad:** Transformar un string en un slug válido siguiendo los pasos definidos en el diseño
- **Satisface:** AC-1, AC-2, AC-3, AC-4

### `SlugUtils` (módulo de exportación)

- **Tipo:** Módulo de re-exportación
- **Ubicación:** `src/utils/index.ts`
- **Responsabilidad:** Exportar `toSlug` como parte de la API pública de utilidades
- **Satisface:** AC-1 (accesibilidad)

## Algoritmo de Transformación

La función `toSlug` aplica los pasos en este orden:

1. Normalizar Unicode: `NFD` decomposition → eliminar diacríticos (`̀-ͯ`)
2. Convertir a minúsculas
3. Reemplazar espacios con guiones
4. Eliminar caracteres que no sean alfanuméricos ni guiones
5. Colapsar guiones múltiples en uno solo
6. Eliminar guiones al inicio y al fin (trim)
7. Retornar la cadena resultante (puede ser vacía)

## Decisiones Técnicas

### Decisión: NFD + eliminación de diacríticos vs. librería de transliteración

**Elegida:** NFD decomposition nativo para eliminar acentos (ej. `á` → `a`). No requiere dependencias externas y cubre los casos de uso del proyecto (títulos en español/inglés).

Alternativa descartada: usar `slugify` npm. Añade dependencia por funcionalidad trivial implementable en 10 líneas.

## Interfaces

```typescript
// src/utils/slug.ts
export function toSlug(title: string): string
```

## Tests

- Archivo de test: `src/utils/slug.test.ts`
- Framework: Jest (existente en el proyecto)
- Un `describe` con un `it` por AC
