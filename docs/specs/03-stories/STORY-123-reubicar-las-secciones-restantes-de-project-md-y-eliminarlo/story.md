---
alwaysApply: false
type: story
id: STORY-123
kind: chore
slug: STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo
title: "Reubicar las secciones restantes de project.md y eliminarlo"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-09
updated: 2026-10-09
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-105-migrar-stakeholders-y-requisitos
  - STORY-108-renombrar-specs-sin-prefijos
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# ðŸ“– Historia: Reubicar las secciones restantes de `project.md` y eliminarlo

**Como** mantenedor de SDDF que colapsa `specs/` a dos niveles  
**Quiero** trasladar a su capa las secciones de `project.md` que ADR-0013 no asigna y despuÃ©s eliminar `project.md` y `docs/specs/01-projects/`  
**Para** que el repositorio del framework cumpla el criterio de salida de EPIC-21 (`docs/specs/01-projects/` no existe), sin una segunda fuente de verdad del proyecto, y STORY-108 encuentre `01-projects/` vacÃ­a al renombrar `specs/`

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Escenario principal â€“ Secciones reubicadas y `01-projects/` eliminada
```gherkin
Dado que "docs/specs/01-projects/PROJ-01-agile-sddf/" solo contiene "project.md"
  Y "project.md" ya no contiene Â§1.8 ni Â§2.1â€“2.2 como texto propio
Cuando el mantenedor reubica las secciones restantes de "project.md" y lo elimina
Entonces "docs/specs/01-projects/" ya no existe
  Y cada secciÃ³n restante de "project.md" queda en un documento de "docs/product/", "docs/requirements/", "docs/architecture/" o "docs/domains/", o figura en "reubicacion-report.md" como descartada por duplicar contenido que ya vive en una capa
```

### AC-2 â€” Escenario de cierre â€“ RedirecciÃ³n y sin wikilinks rotos
```gherkin
Dado que ADR-0006, el story map migrado por STORY-107 y 14 "epic.md" contienen el wikilink "[[PROJ-01-agile-sddf]]"
Cuando el mantenedor elimina "project.md"
Entonces un Ãºnico documento de "docs/product/" declara "slug: PROJ-01-agile-sddf"
  Y su cuerpo es solo la tabla "secciÃ³n antigua â†’ hogar actual", con un enlace por fila y sin texto de las secciones
  Y "docs/runbooks/actualizar-spec-de-proyecto.md" ya no existe
  Y "memory-system check" no reporta "broken-wikilink"
```

### AC-3 â€” Escenario de error â€“ SecciÃ³n sin hogar
```gherkin
Dado que una secciÃ³n de "project.md" no tiene una capa de destino ni un equivalente en otra capa
Cuando el mantenedor intenta eliminar "project.md"
Entonces "project.md" no se elimina
  Y "reubicacion-report.md" lista la secciÃ³n sin hogar para que el PO decida su destino
  Pero las secciones que sÃ­ tienen destino quedan reubicadas y registradas en "reubicacion-report.md"
```

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Sin pÃ©rdida semÃ¡ntica:** ningÃºn Ã­tem de una secciÃ³n reubicada se resume ni se omite; `reubicacion-report.md`, en el directorio de esta historia, enumera cada secciÃ³n de origen con su destino o el motivo de su descarte.

## Fuera de alcance (Non-Goals)

- Migrar Â§1.8 y Â§2.1â€“2.2 (perfiles de usuario, FR y NFR): ya los traslada STORY-105.
- Renombrar `specs/02-epics/` y `specs/03-stories/`: STORY-108.
- Reescribir el wikilink `[[PROJ-01-agile-sddf]]` en ADR-0006, en los `epic.md` o en el story map: lo resuelve la pÃ¡gina de redirecciÃ³n.
- Cambiar `memory-system` para tolerar slugs retirados, o la regla de inmutabilidad de los ADR.

## ðŸ“Ž Notas / contexto adicional

Generado automÃ¡ticamente desde la Ã©pica: [[EPIC-21-colapsar-specs-dos-niveles]]
Feature origen: STORY-123 â€” Reubicar las secciones restantes de `project.md` y eliminarlo

- **Origen:** las Notas de STORY-105 piden esta historia explÃ­citamente ("Reubicar las secciones restantes de `project.md` y eliminarlo"); sin ella, STORY-108 AC-3 conserva `01-projects/` porque `project.md` sigue ahÃ­.
- **Criterio de salida que cubre:** `docs/specs/01-projects/` no existe en el repositorio del framework.
- **Secciones a reubicar** (las que ADR-0013 no asigna): Â§1.1â€“1.7, Â§2.3, Â§3 (UI/UX: design vibe, inspiraciÃ³n visual, mapas de navegaciÃ³n, wireframe), Â§4.1 stack tecnolÃ³gico, Â§11 referencias, Â§12 definiciones y acrÃ³nimos, apÃ©ndices A y B. Destinos candidatos, a decidir en diseÃ±o: Â§1.2â€“1.7 ya estÃ¡n en `product/vision.md` por STORY-104; Â§4.1 â†’ `docs/architecture/tech-stack.md`; el apÃ©ndice A (inventario de Ã©picas e historias) lo sustituye `docs/index.md`.
- **Dependencias:** solo puede iniciarse cuando STORY-104 a STORY-107 estÃ©n implementadas (al 2026-10-09 estÃ¡n planificadas, en `READY-FOR-IMPLEMENT/DONE`); la precondiciÃ³n de AC-1 lo hace verificable sin nombrarlas. Orden: STORY-104â€¦107 â†’ STORY-123 â†’ STORY-108.
- **QuiÃ©n enlaza `[[PROJ-01-agile-sddf]]` hoy** (slug de `project.md`, nodos que `memory-system check` escanea): `docs/index.md`; `docs/runbooks/actualizar-spec-de-proyecto.md`; los `epic.md` de EPIC-00 a EPIC-12 y EPIC-20 (14); `story-map.md`, cuya reescritura STORY-107 deja explÃ­citamente para esta historia; y `docs/adr/ADR-0006-migracion-retroactiva-de-estados-de-epica.md`. Las menciones entre backticks (p. ej. en STORY-107) no son wikilinks, y los derivados de historia (`design.md`, `tasks.md`, `*-report.md`) no se escanean.
- **DecisiÃ³n del PO (2026-10-09) â€” pÃ¡gina de redirecciÃ³n:** ADR-0006 es `ACCEPTED` e inmutable, pero contiene `[[PROJ-01-agile-sddf]]`. Para no editarlo, el slug pasa a una pÃ¡gina de redirecciÃ³n en `docs/product/`, que solo mapea cada secciÃ³n antigua a su hogar actual. No es una segunda fuente de verdad, porque no repite contenido. Con ella tambiÃ©n resuelven los 14 `epic.md` y el story map sin tocarlos. `docs/index.md` se regenera con `memory-system index`.
- **DecisiÃ³n del PO (2026-10-09) â€” runbook:** `actualizar-spec-de-proyecto.md` se retira en esta historia porque su Ãºnico objeto, resincronizar `project.md`, desaparece.
- **RelaciÃ³n entre el informe y la redirecciÃ³n:** `reubicacion-report.md` es un derivado de la historia, registra destinos y descartes con su motivo y `memory-system` no lo escanea; la pÃ¡gina de redirecciÃ³n es un documento vivo que solo conserva el slug y los enlaces.
