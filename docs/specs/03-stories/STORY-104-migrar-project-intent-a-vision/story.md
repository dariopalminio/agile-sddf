---
alwaysApply: false
type: story
id: STORY-104
kind: chore
slug: STORY-104-migrar-project-intent-a-vision
title: "Migrar project-intent.md a product/vision.md"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-07
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# ðŸ“– Historia: Migrar `project-intent.md` a `product/vision.md`

**Como** mantenedor del framework SDDF que consulta o actualiza la visiÃ³n del producto  
**Quiero** encontrar el problema, la visiÃ³n, los beneficios, los criterios de Ã©xito, las restricciones y los non-goals del proyecto en un Ãºnico documento `docs/product/vision.md`  
**Para** dejar de mantener dos fuentes de verdad que divergen (`project-intent.md` y `vision.md`) y que humanos y agentes lean siempre la misma visiÃ³n

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Escenario principal â€“ La visiÃ³n consolida toda la intenciÃ³n del proyecto
```gherkin
Dado que "docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md" contiene las secciones "DefiniciÃ³n del Problema", "VisiÃ³n (elevator pitch)", "Beneficios Clave", "Criterios de Ã‰xito", "Restricciones" y "Fuera de alcance (Non-Goals)"
  Y "docs/product/vision.md" solo contiene marcadores "[Por completar"
Cuando el mantenedor consolida la intenciÃ³n del proyecto en "docs/product/vision.md"
Entonces "docs/product/vision.md" contiene el contenido de las seis secciones de origen
  Y "docs/product/vision.md" no contiene ningÃºn marcador "[Por completar"
  Y su frontmatter conserva "type: product" y "slug: vision"
```

### AC-2 â€” Escenario alternativo â€“ SecciÃ³n de origen sin equivalente en la visiÃ³n
```gherkin
Dado que "Criterios de Ã‰xito" de "project-intent.md" no tiene una secciÃ³n equivalente en "docs/product/vision.md"
Cuando el mantenedor consolida la intenciÃ³n del proyecto
Entonces "docs/product/vision.md" incluye los tres criterios de Ã©xito originales en una secciÃ³n propia
  Pero ningÃºn Ã­tem de "Criterios de Ã‰xito", "Restricciones" ni "Fuera de alcance (Non-Goals)" se omite ni se resume
```

### AC-3 â€” Escenario de cierre â€“ Original eliminado sin wikilinks rotos
```gherkin
Dado que la visiÃ³n ya estÃ¡ consolidada en "docs/product/vision.md"
  Y "docs/index.md" y "project.md" referencian "[[PROJ-01-agile-sddf-project-intent]]"
Cuando el mantenedor elimina "docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md"
Entonces ningÃºn archivo de "docs/" fuera de "docs/specs/03-stories/" contiene el wikilink "[[PROJ-01-agile-sddf-project-intent]]"
  Y esas referencias apuntan a "[[vision]]"
  Y "memory-system check" no reporta wikilinks rotos
```

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Trazabilidad:** `docs/product/vision.md` declara que su contenido fue consolidado desde `project-intent.md` por [[ADR-0013-eliminar-specs-01-projects]], para que un lector sepa de dÃ³nde viene la visiÃ³n.
- **CNF-2 â€” Encoding:** `docs/product/vision.md` queda guardado en UTF-8 sin BOM, sin caracteres corruptos (`ÃƒÂ³`, `Ã°Å¸â€œâ€“`).

## Fuera de alcance (Non-Goals)

- Cambiar los skills (`project-begin`, `project-flow`, `project-discovery`, etc.) y los templates (`project-intent-template.md`) que generan o leen `project-intent.md`: lo cubre la historia "Actualizar skills que referencian rutas de `specs/`" de EPIC-21.
- Automatizar la migraciÃ³n para otros repos: lo cubre `memory-system migrate --from=specs-3-levels`.
- Migrar `project.md`, `project-plan.md`, `story-map.md` y `context-diagram.puml`, o eliminar la carpeta `01-projects/`: cada uno tiene su propia historia en EPIC-21.
- Reescribir las menciones textuales a `project-intent.md` en Ã©picas e historias histÃ³ricas (`02-epics/`, `03-stories/`) y en la documentaciÃ³n canÃ³nica (`architecture/`, `domains/`, `guides/`): son registro histÃ³rico o pertenecen a "Actualizar documentaciÃ³n canÃ³nica".

## ðŸ“Ž Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]] decide `project-intent.md â†’ docs/product/vision.md`.
- **Correspondencia orientativa de secciones** (se decide en diseÃ±o): "DefiniciÃ³n del Problema" â†’ "Problema que resolvemos"; "VisiÃ³n (elevator pitch)" + "Beneficios Clave" â†’ "Propuesta de valor"; "Restricciones" + "Fuera de alcance (Non-Goals)" â†’ "Alcance y lÃ­mites"; "Criterios de Ã‰xito" â†’ secciÃ³n nueva.
- **Referencias actuales al wikilink:** `docs/index.md` (lÃ­nea del Ã­ndice de `01-projects/`) y `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` (2 apariciones). `project.md` se migra en otra historia, pero mientras exista no debe quedar con un wikilink roto.
- **Independencia:** la historia no depende de otras de EPIC-21. Tras eliminar el original, `project-discovery` ya no encontrarÃ¡ `project-intent.md` en este repo; se acepta porque PROJ-01 estÃ¡ `COMPLETED` y la historia de skills corrige la ruta.
