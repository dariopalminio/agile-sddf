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

# 📖 Historia: Reubicar las secciones restantes de `project.md` y eliminarlo

**Como** mantenedor de SDDF que colapsa `specs/` a dos niveles  
**Quiero** trasladar a su capa las secciones de `project.md` que ADR-0013 no asigna y después eliminar `project.md` y `docs/specs/01-projects/`  
**Para** que el repositorio del framework cumpla el criterio de salida de EPIC-21 (`docs/specs/01-projects/` no existe), sin una segunda fuente de verdad del proyecto, y STORY-108 encuentre `01-projects/` vacía al renombrar `specs/`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Secciones reubicadas y `01-projects/` eliminada
```gherkin
Dado que "docs/specs/01-projects/PROJ-01-agile-sddf/" solo contiene "project.md"
  Y "project.md" ya no contiene §1.8 ni §2.1–2.2 como texto propio
Cuando el mantenedor reubica las secciones restantes de "project.md" y lo elimina
Entonces "docs/specs/01-projects/" ya no existe
  Y cada sección restante de "project.md" queda en un documento de "docs/product/", "docs/requirements/", "docs/architecture/" o "docs/domains/", o figura en "reubicacion-report.md" como descartada por duplicar contenido que ya vive en una capa
```

### AC-2 — Escenario de cierre – Redirección y sin wikilinks rotos
```gherkin
Dado que ADR-0006, el story map migrado por STORY-107 y 14 "epic.md" contienen el wikilink "[[PROJ-01-agile-sddf]]"
Cuando el mantenedor elimina "project.md"
Entonces un único documento de "docs/product/" declara "slug: PROJ-01-agile-sddf"
  Y su cuerpo es solo la tabla "sección antigua → hogar actual", con un enlace por fila y sin texto de las secciones
  Y "docs/runbooks/actualizar-spec-de-proyecto.md" ya no existe
  Y "memory-system check" no reporta "broken-wikilink"
```

### AC-3 — Escenario de error – Sección sin hogar
```gherkin
Dado que una sección de "project.md" no tiene una capa de destino ni un equivalente en otra capa
Cuando el mantenedor intenta eliminar "project.md"
Entonces "project.md" no se elimina
  Y "reubicacion-report.md" lista la sección sin hogar para que el PO decida su destino
  Pero las secciones que sí tienen destino quedan reubicadas y registradas en "reubicacion-report.md"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin pérdida semántica:** ningún ítem de una sección reubicada se resume ni se omite; `reubicacion-report.md`, en el directorio de esta historia, enumera cada sección de origen con su destino o el motivo de su descarte.

## Fuera de alcance (Non-Goals)

- Migrar §1.8 y §2.1–2.2 (perfiles de usuario, FR y NFR): ya los traslada STORY-105.
- Renombrar `specs/02-epics/` y `specs/03-stories/`: STORY-108.
- Reescribir el wikilink `[[PROJ-01-agile-sddf]]` en ADR-0006, en los `epic.md` o en el story map: lo resuelve la página de redirección.
- Cambiar `memory-system` para tolerar slugs retirados, o la regla de inmutabilidad de los ADR.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: [[EPIC-21-colapsar-specs-dos-niveles]]
Feature origen: STORY-123 — Reubicar las secciones restantes de `project.md` y eliminarlo

- **Origen:** las Notas de STORY-105 piden esta historia explícitamente ("Reubicar las secciones restantes de `project.md` y eliminarlo"); sin ella, STORY-108 AC-3 conserva `01-projects/` porque `project.md` sigue ahí.
- **Criterio de salida que cubre:** `docs/specs/01-projects/` no existe en el repositorio del framework.
- **Secciones a reubicar** (las que ADR-0013 no asigna): §1.1–1.7, §2.3, §3 (UI/UX: design vibe, inspiración visual, mapas de navegación, wireframe), §4.1 stack tecnológico, §11 referencias, §12 definiciones y acrónimos, apéndices A y B. Destinos candidatos, a decidir en diseño: §1.2–1.7 ya están en `product/vision.md` por STORY-104; §4.1 → `docs/architecture/tech-stack.md`; el apéndice A (inventario de épicas e historias) lo sustituye `docs/index.md`.
- **Dependencias:** solo puede iniciarse cuando STORY-104 a STORY-107 estén implementadas (al 2026-10-09 están planificadas, en `READY-FOR-IMPLEMENT/DONE`); la precondición de AC-1 lo hace verificable sin nombrarlas. Orden: STORY-104…107 → STORY-123 → STORY-108.
- **Quién enlaza `[[PROJ-01-agile-sddf]]` hoy** (slug de `project.md`, nodos que `memory-system check` escanea): `docs/index.md`; `docs/runbooks/actualizar-spec-de-proyecto.md`; los `epic.md` de EPIC-00 a EPIC-12 y EPIC-20 (14); `story-map.md`, cuya reescritura STORY-107 deja explícitamente para esta historia; y `docs/adr/ADR-0006-migracion-retroactiva-de-estados-de-epica.md`. Las menciones entre backticks (p. ej. en STORY-107) no son wikilinks, y los derivados de historia (`design.md`, `tasks.md`, `*-report.md`) no se escanean.
- **Decisión del PO (2026-10-09) — página de redirección:** ADR-0006 es `ACCEPTED` e inmutable, pero contiene `[[PROJ-01-agile-sddf]]`. Para no editarlo, el slug pasa a una página de redirección en `docs/product/`, que solo mapea cada sección antigua a su hogar actual. No es una segunda fuente de verdad, porque no repite contenido. Con ella también resuelven los 14 `epic.md` y el story map sin tocarlos. `docs/index.md` se regenera con `memory-system index`.
- **Decisión del PO (2026-10-09) — runbook:** `actualizar-spec-de-proyecto.md` se retira en esta historia porque su único objeto, resincronizar `project.md`, desaparece.
- **Relación entre el informe y la redirección:** `reubicacion-report.md` es un derivado de la historia, registra destinos y descartes con su motivo y `memory-system` no lo escanea; la página de redirección es un documento vivo que solo conserva el slug y los enlaces.
