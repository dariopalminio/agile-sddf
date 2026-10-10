---
alwaysApply: false
type: story
id: STORY-106
kind: chore
slug: STORY-106-migrar-plan-a-roadmap
title: "Migrar project-plan.md a product/roadmap.md"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-07
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-104-migrar-project-intent-a-vision
  - STORY-105-migrar-stakeholders-y-requisitos
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# ðŸ“– Historia: Migrar `project-plan.md` a `product/roadmap.md`

**Como** mantenedor de SDDF que decide quÃ© Ã©pica abordar a continuaciÃ³n  
**Quiero** consultar en `docs/product/roadmap.md` todas las Ã©picas reales del framework con su estado, junto con el plan original del que partieron  
**Para** priorizar sobre datos actuales en lugar de sobre un plan de abril de 2026 que solo cubre 9 de las 22 Ã©picas, sin perder el registro de lo que se planificÃ³

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Escenario principal â€“ El roadmap refleja las Ã©picas reales
```gherkin
Dado que "docs/specs/02-epics/" contiene 22 Ã©picas, de "EPIC-00" a "EPIC-21", cada una con su "epic.md"
  Y "docs/product/roadmap.md" no existe
Cuando el mantenedor crea el roadmap del producto
Entonces "docs/product/roadmap.md" lista las 22 Ã©picas ordenadas por ID
  Y cada Ã©pica aparece con su wikilink "[[EPIC-NN-<slug>]]", su tÃ­tulo y su "status"/"substatus" tal como figuran en su frontmatter
  Y el frontmatter de "roadmap.md" declara "type: product" y "slug: roadmap"
```

### AC-2 â€” Escenario alternativo â€“ El plan original se conserva como histÃ³rico
```gherkin
Dado que "project-plan.md" propone 9 Ã©picas ("Ã‰pica 00" a "Ã‰pica 08") que no coinciden en nombre ni en nÃºmero con las Ã©picas reales a partir de "EPIC-07"
Cuando el mantenedor migra el plan
Entonces "docs/product/roadmap.md" contiene una secciÃ³n "Plan original (2026-04-20)" con el backlog de historias, las 9 Ã©picas propuestas (objetivo, historias, Ã­tems de soporte y criterios de Ã©xito) y la tabla de resumen
  Pero esa secciÃ³n queda identificada como histÃ³rica y no se mezcla con la lista de Ã©picas reales de AC-1
```

### AC-3 â€” Escenario de cierre â€“ Objetivo reubicado y original eliminado sin wikilinks rotos
```gherkin
Dado que el roadmap ya estÃ¡ creado
  Y "docs/index.md" y "project.md" referencian "[[project-plan]]"
Cuando el mantenedor reubica la secciÃ³n "Objetivo" y elimina "docs/specs/01-projects/PROJ-01-agile-sddf/project-plan.md"
Entonces "Objetivos de negocio" de "docs/product/objectives.md" contiene el objetivo original y ya no contiene el marcador "[Por completar"
  Y ningÃºn archivo de "docs/" fuera de "docs/specs/03-stories/" contiene el wikilink "[[project-plan]]"
  Y esas referencias apuntan a "[[roadmap]]"
  Y "memory-system check" no reporta wikilinks rotos
```

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Sin pÃ©rdida semÃ¡ntica:** todo Ã­tem de `project-plan.md` (las 29 features del backlog, objetivos, Ã­tems de soporte, criterios de Ã©xito y mÃ©tricas del resumen) aparece en `roadmap.md` o en `objectives.md`; nada se resume ni se descarta.
- **CNF-2 â€” Trazabilidad:** `roadmap.md` declara que el plan original proviene de `project-plan.md` y que la migraciÃ³n la decide [[ADR-0013-eliminar-specs-01-projects]], y enlaza a [[objectives]].
- **CNF-3 â€” Encoding:** los archivos creados o modificados quedan en UTF-8 sin BOM, sin caracteres corruptos (`ÃƒÂ³`, `Ã°Å¸â€œâ€“`).

## Fuera de alcance (Non-Goals)

- Mantener el roadmap sincronizado automÃ¡ticamente con los cambios de `status` de las Ã©picas: hoy queda como una foto a la fecha de migraciÃ³n. Hacer que skills como `epic-creation` o `epic-from-project-plan` actualicen `roadmap.md` corresponde a "Actualizar skills que referencian rutas de `specs/`".
- Que `memory-system scaffold` cree `roadmap.md` en proyectos nuevos: lo cubre "Actualizar scaffolding de `memory-system`".
- Cambiar `project-planning` o el agente `project-architect` para que escriban en `roadmap.md`.
- Completar "MÃ©tricas de Ã©xito" y "Prioridades" de `objectives.md`: `project-plan.md` no tiene contenido de origen para ellas.
- Migrar `story-map.md` (lo referencia el frontmatter de `project-plan.md`): tiene su propia historia en EPIC-21.

## ðŸ“Ž Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]] decide "`project-plan.md` (epic slicing) â†’ `docs/product/roadmap.md` (nuevo archivo en la capa `product/`)" y que "el roadmap lista los Epics planificados".
- **Desfase detectado (2026-10-05):** el plan cubre las Ã©picas 00â€“08 y 29 features; el repo tiene 22 Ã©picas (EPIC-00 a EPIC-21) y 97 historias. Las Ã©picas 07 y 08 del plan ("Robustez y Trazabilidad", "Meta-Framework y DistribuciÃ³n") no corresponden a las reales EPIC-07 (`publicacion-framework-npm`) y EPIC-08 (`npm-install-locally`). Por eso el roadmap combina las Ã©picas reales (AC-1) con el plan original conservado (AC-2), en lugar de copiarlo literalmente.
- **Capa `product/`:** `product/README.md` fija tres documentos (`vision.md`, `stakeholders.md`, `objectives.md`) y admite otros documentos de contexto en kebab-case; `roadmap.md` entra en esa regla sin cambiar el README.
- **Referencias actuales a `[[project-plan]]`:** `docs/index.md` (1) y `project.md` (2, mÃ¡s la entrada `project-plan` en su `related`). Mientras `project.md` exista no debe quedar con un wikilink roto.
- **Independencia:** no depende de STORY-104 ni de STORY-105; las tres tocan `project.md` y `docs/index.md` en lÃ­neas distintas.
