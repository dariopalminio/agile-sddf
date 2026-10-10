---
alwaysApply: false
type: story
id: STORY-106
kind: chore
slug: STORY-106-migrar-plan-a-roadmap
title: "Migrar project-plan.md a product/roadmap.md"
status: IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-10
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-104-migrar-project-intent-a-vision
  - STORY-105-migrar-stakeholders-y-requisitos
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# 📖 Historia: Migrar `project-plan.md` a `product/roadmap.md`

**Como** mantenedor de SDDF que decide qué épica abordar a continuación  
**Quiero** consultar en `docs/product/roadmap.md` todas las épicas reales del framework con su estado, junto con el plan original del que partieron  
**Para** priorizar sobre datos actuales en lugar de sobre un plan de abril de 2026 que solo cubre 9 de las 22 épicas, sin perder el registro de lo que se planificó

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – El roadmap refleja las épicas reales
```gherkin
Dado que "docs/specs/02-epics/" contiene 22 épicas, de "EPIC-00" a "EPIC-21", cada una con su "epic.md"
  Y "docs/product/roadmap.md" no existe
Cuando el mantenedor crea el roadmap del producto
Entonces "docs/product/roadmap.md" lista las 22 épicas ordenadas por ID
  Y cada épica aparece con su wikilink "[[EPIC-NN-<slug>]]", su título y su "status"/"substatus" tal como figuran en su frontmatter
  Y el frontmatter de "roadmap.md" declara "type: product" y "slug: roadmap"
```

### AC-2 — Escenario alternativo – El plan original se conserva como histórico
```gherkin
Dado que "project-plan.md" propone 9 épicas ("Épica 00" a "Épica 08") que no coinciden en nombre ni en número con las épicas reales a partir de "EPIC-07"
Cuando el mantenedor migra el plan
Entonces "docs/product/roadmap.md" contiene una sección "Plan original (2026-04-20)" con el backlog de historias, las 9 épicas propuestas (objetivo, historias, ítems de soporte y criterios de éxito) y la tabla de resumen
  Pero esa sección queda identificada como histórica y no se mezcla con la lista de épicas reales de AC-1
```

### AC-3 — Escenario de cierre – Objetivo reubicado y original eliminado sin wikilinks rotos
```gherkin
Dado que el roadmap ya está creado
  Y "docs/index.md" y "project.md" referencian "[[project-plan]]"
Cuando el mantenedor reubica la sección "Objetivo" y elimina "docs/specs/01-projects/PROJ-01-agile-sddf/project-plan.md"
Entonces "Objetivos de negocio" de "docs/product/objectives.md" contiene el objetivo original y ya no contiene el marcador "[Por completar"
  Y ningún archivo de "docs/" fuera de "docs/specs/03-stories/" contiene el wikilink "[[project-plan]]"
  Y esas referencias apuntan a "[[roadmap]]"
  Y "memory-system check" no reporta wikilinks rotos
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin pérdida semántica:** todo ítem de `project-plan.md` (las 29 features del backlog, objetivos, ítems de soporte, criterios de éxito y métricas del resumen) aparece en `roadmap.md` o en `objectives.md`; nada se resume ni se descarta.
- **CNF-2 — Trazabilidad:** `roadmap.md` declara que el plan original proviene de `project-plan.md` y que la migración la decide [[ADR-0013-eliminar-specs-01-projects]], y enlaza a [[objectives]].
- **CNF-3 — Encoding:** los archivos creados o modificados quedan en UTF-8 sin BOM, sin caracteres corruptos (`Ã³`, `ðŸ“–`).

## Fuera de alcance (Non-Goals)

- Mantener el roadmap sincronizado automáticamente con los cambios de `status` de las épicas: hoy queda como una foto a la fecha de migración. Hacer que skills como `epic-creation` o `epic-from-project-plan` actualicen `roadmap.md` corresponde a "Actualizar skills que referencian rutas de `specs/`".
- Que `memory-system scaffold` cree `roadmap.md` en proyectos nuevos: lo cubre "Actualizar scaffolding de `memory-system`".
- Cambiar `project-planning` o el agente `project-architect` para que escriban en `roadmap.md`.
- Completar "Métricas de éxito" y "Prioridades" de `objectives.md`: `project-plan.md` no tiene contenido de origen para ellas.
- Migrar `story-map.md` (lo referencia el frontmatter de `project-plan.md`): tiene su propia historia en EPIC-21.

## 📎 Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]] decide "`project-plan.md` (epic slicing) → `docs/product/roadmap.md` (nuevo archivo en la capa `product/`)" y que "el roadmap lista los Epics planificados".
- **Desfase detectado (2026-10-05):** el plan cubre las épicas 00–08 y 29 features; el repo tiene 22 épicas (EPIC-00 a EPIC-21) y 97 historias. Las épicas 07 y 08 del plan ("Robustez y Trazabilidad", "Meta-Framework y Distribución") no corresponden a las reales EPIC-07 (`publicacion-framework-npm`) y EPIC-08 (`npm-install-locally`). Por eso el roadmap combina las épicas reales (AC-1) con el plan original conservado (AC-2), en lugar de copiarlo literalmente.
- **Capa `product/`:** `product/README.md` fija tres documentos (`vision.md`, `stakeholders.md`, `objectives.md`) y admite otros documentos de contexto en kebab-case; `roadmap.md` entra en esa regla sin cambiar el README.
- **Referencias actuales a `[[project-plan]]`:** `docs/index.md` (1) y `project.md` (2, más la entrada `project-plan` en su `related`). Mientras `project.md` exista no debe quedar con un wikilink roto.
- **Independencia:** no depende de STORY-104 ni de STORY-105; las tres tocan `project.md` y `docs/index.md` en líneas distintas.
