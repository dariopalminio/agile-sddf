---
alwaysApply: false
type: story
id: STORY-104
kind: chore
slug: STORY-104-migrar-project-intent-a-vision
title: "Migrar project-intent.md a product/vision.md"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-05
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# 📖 Historia: Migrar `project-intent.md` a `product/vision.md`

**Como** mantenedor del framework SDDF que consulta o actualiza la visión del producto  
**Quiero** encontrar el problema, la visión, los beneficios, los criterios de éxito, las restricciones y los non-goals del proyecto en un único documento `docs/product/vision.md`  
**Para** dejar de mantener dos fuentes de verdad que divergen (`project-intent.md` y `vision.md`) y que humanos y agentes lean siempre la misma visión

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – La visión consolida toda la intención del proyecto
```gherkin
Dado que "docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md" contiene las secciones "Definición del Problema", "Visión (elevator pitch)", "Beneficios Clave", "Criterios de Éxito", "Restricciones" y "Fuera de alcance (Non-Goals)"
  Y "docs/product/vision.md" solo contiene marcadores "[Por completar"
Cuando el mantenedor consolida la intención del proyecto en "docs/product/vision.md"
Entonces "docs/product/vision.md" contiene el contenido de las seis secciones de origen
  Y "docs/product/vision.md" no contiene ningún marcador "[Por completar"
  Y su frontmatter conserva "type: product" y "slug: vision"
```

### AC-2 — Escenario alternativo – Sección de origen sin equivalente en la visión
```gherkin
Dado que "Criterios de Éxito" de "project-intent.md" no tiene una sección equivalente en "docs/product/vision.md"
Cuando el mantenedor consolida la intención del proyecto
Entonces "docs/product/vision.md" incluye los tres criterios de éxito originales en una sección propia
  Pero ningún ítem de "Criterios de Éxito", "Restricciones" ni "Fuera de alcance (Non-Goals)" se omite ni se resume
```

### AC-3 — Escenario de cierre – Original eliminado sin wikilinks rotos
```gherkin
Dado que la visión ya está consolidada en "docs/product/vision.md"
  Y "docs/index.md" y "project.md" referencian "[[PROJ-01-agile-sddf-project-intent]]"
Cuando el mantenedor elimina "docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md"
Entonces ningún archivo de "docs/" fuera de "docs/specs/03-stories/" contiene el wikilink "[[PROJ-01-agile-sddf-project-intent]]"
  Y esas referencias apuntan a "[[vision]]"
  Y "memory-system check" no reporta wikilinks rotos
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Trazabilidad:** `docs/product/vision.md` declara que su contenido fue consolidado desde `project-intent.md` por [[ADR-0013-eliminar-specs-01-projects]], para que un lector sepa de dónde viene la visión.
- **CNF-2 — Encoding:** `docs/product/vision.md` queda guardado en UTF-8 sin BOM, sin caracteres corruptos (`Ã³`, `ðŸ“–`).

## Fuera de alcance (Non-Goals)

- Cambiar los skills (`project-begin`, `project-flow`, `project-discovery`, etc.) y los templates (`project-intent-template.md`) que generan o leen `project-intent.md`: lo cubre la historia "Actualizar skills que referencian rutas de `specs/`" de EPIC-21.
- Automatizar la migración para otros repos: lo cubre `memory-system migrate --from=specs-3-levels`.
- Migrar `project.md`, `project-plan.md`, `story-map.md` y `context-diagram.puml`, o eliminar la carpeta `01-projects/`: cada uno tiene su propia historia en EPIC-21.
- Reescribir las menciones textuales a `project-intent.md` en épicas e historias históricas (`02-epics/`, `03-stories/`) y en la documentación canónica (`architecture/`, `domains/`, `guides/`): son registro histórico o pertenecen a "Actualizar documentación canónica".

## 📎 Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]] decide `project-intent.md → docs/product/vision.md`.
- **Correspondencia orientativa de secciones** (se decide en diseño): "Definición del Problema" → "Problema que resolvemos"; "Visión (elevator pitch)" + "Beneficios Clave" → "Propuesta de valor"; "Restricciones" + "Fuera de alcance (Non-Goals)" → "Alcance y límites"; "Criterios de Éxito" → sección nueva.
- **Referencias actuales al wikilink:** `docs/index.md` (línea del índice de `01-projects/`) y `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` (2 apariciones). `project.md` se migra en otra historia, pero mientras exista no debe quedar con un wikilink roto.
- **Independencia:** la historia no depende de otras de EPIC-21. Tras eliminar el original, `project-discovery` ya no encontrará `project-intent.md` en este repo; se acepta porque PROJ-01 está `COMPLETED` y la historia de skills corrige la ruta.
