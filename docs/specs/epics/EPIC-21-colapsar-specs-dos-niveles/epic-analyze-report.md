---
type: epic-analyze
id: EPIC-21
slug: EPIC-21-colapsar-specs-dos-niveles-analyze-report
title: "Epic analyze: Colapsar specs/ a dos niveles y eliminar 01-projects/"
epic: EPIC-21
verdict: APPROVED
errors: 0
warnings: 0
created: 2026-10-09
updated: 2026-10-13
related:
  - EPIC-21-colapsar-specs-dos-niveles
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]

# Análisis de épica: Colapsar `specs/` a dos niveles y eliminar `01-projects/`

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-21 (`docs/specs/epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`) |
| Veredicto | APPROVED |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 0 |
| Contrato de salida | Contrato de salida: 13/13 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 16/16 listas |
| Fecha | 2026-10-13 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `skills/epic-analyze/assets/epic-analyze-report-template.md` (seed del skill) |

**Veredicto:** APPROVED — informativo; este análisis no cambia el estado de la épica.

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-103 | 30 | sí | `docs/specs/stories/STORY-103-replace-the-epic-template/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-104 | 31 | sí | `docs/specs/stories/STORY-104-migrar-project-intent-a-vision/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-105 | 32 | sí | `docs/specs/stories/STORY-105-migrar-stakeholders-y-requisitos/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-106 | 33 | sí | `docs/specs/stories/STORY-106-migrar-plan-a-roadmap/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-107 | 34 | sí | `docs/specs/stories/STORY-107-migrar-story-map-y-diagrama-contexto/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-108 | 35 | sí | `docs/specs/stories/STORY-108-renombrar-specs-sin-prefijos/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-109 | 36 | sí | `docs/specs/stories/STORY-109-project-begin-escribe-vision/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-110 | 37 | sí | `docs/specs/stories/STORY-110-discovery-escribe-stakeholders-y-requisitos/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-111 | 38 | sí | `docs/specs/stories/STORY-111-planning-escribe-roadmap/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-112 | 39 | sí | `docs/specs/stories/STORY-112-story-map-y-diagrama-en-sus-capas/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-113 | 40 | sí | `docs/specs/stories/STORY-113-project-flow-sin-01-projects/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-114 | 41 | sí | `docs/specs/stories/STORY-114-migrate-specs-3-levels/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-115 | 42 | sí | `docs/specs/stories/STORY-115-scaffold-dos-niveles-y-capas-destino/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-116 | 43 | sí | `docs/specs/stories/STORY-116-documentar-modelo-dos-niveles/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-117 | 44 | sí | `docs/specs/stories/STORY-117-verificar-cierre-epic-21/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-118 | 47 | sí | `docs/specs/stories/STORY-118-requirements-srs-unico-primero/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-119 | 46 | sí | `docs/specs/stories/STORY-119-story-plan-un-subagente-por-paso/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-123 | 45 | sí | `docs/specs/stories/STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `docs/specs/01-projects/` no existe en el repositorio del framework. | 61 | STORY-108; STORY-123 | mención · story.md:85 `**Criterios de salida de EPIC-21 que cubre:** docs/specs/01-projects/ no existe en el repositorio del framework (AC-3, fila de directorio vacío).`; mención · story.md:76 `**Criterio de salida que cubre:** docs/specs/01-projects/ no existe en el repositorio del framework.` | ✓ |
| CS-2 | `docs/specs/` contiene exactamente dos carpetas de artefactos: epics/ y stories/ (más README.md). | 62 | STORY-108 | mención · story.md:86 `**Criterios de salida de EPIC-21 que cubre:** docs/specs/ contiene exactamente dos carpetas de artefactos: epics/ y stories/ (más README.md) (AC-1 y AC-3).` | ✓ |
| CS-3 | `docs/product/ contiene vision.md, stakeholders.md, roadmap.md y story-map.md.` | 63 | STORY-107 | mención · story.md:77 `**Criterio de salida de EPIC-21 que cubre:** docs/product/ contiene vision.md, stakeholders.md, roadmap.md y story-map.md. Lo entregan STORY-104 a STORY-107; …` | ✓ |
| CS-4 | `docs/architecture/c4/ contiene context-diagram.puml y su render context-diagram.png.` | 64 | STORY-107 | AC-2 · story.md:45 `Y "docs/architecture/c4/context-diagram.puml" y "docs/architecture/c4/context-diagram.png" quedan sin cambios` | ✓ |
| CS-5 | `docs/requirements/ contiene functional/ y non-functional/ poblados o un documento srs de especificación de requerimientos.` | 65 | STORY-105 | AC-2 · story.md:45-46 `Entonces "docs/requirements/functional/" contiene 53 archivos "FR-NNN-<slug>.md", uno por requisito y con el mismo ID` / `Y "docs/requirements/non-functional/" contiene 24 archivos "NFR-NNN-<slug>.md", uno por requisito y con el mismo ID` | ✓ |
| CS-6 | `Ningún skill ni agente referencia specs/01-projects/, specs/02-epics/ ni specs/03-stories/.` | 66 | STORY-113 | mención · story.md:79 `**Criterio de salida de EPIC-21 que cubre:** Ningún skill ni agente referencia specs/01-projects/, specs/02-epics/ ni specs/03-stories/ (salvo la lógica de migración de memory-system y las a…` | ✓ |
| CS-7 | `memory-system migrate --from=specs-3-levels --dry-run reporta "0 cambios pendientes" tras la migración.` | 67 | STORY-114 | AC-2 · story.md:57 `\| ya migrado con AC-1 \| --dry-run \| cambios pendientes: 0 \| ningún archivo del repositorio cambia \|` | ✓ |
| CS-8 | `memory-system check devuelve exit code 0.` | 68 | STORY-114 | AC-1 · story.md:43 `Y "memory-system check" devuelve exit code 0 sin wikilinks rotos` | ✓ |
| CS-9 | `Todas las épicas e historias existentes siguen siendo navegables por wikilinks.` | 69 | STORY-114 | AC-1 · story.md:43-44 `Y "memory-system check" devuelve exit code 0 sin wikilinks rotos` / `Y los frontmatters conservan sus referencias "parent" y "related", y "memory-system index" regenera "docs/index.md" sin nodos pendientes` | ✓ |
| CS-10 | `CHANGELOG.md documenta el breaking change con guía de migración.` | 70 | STORY-116 | mención · story.md:73 `Cubre el criterio de salida de EPIC-21 "CHANGELOG.md documenta el breaking change con guía de migración".` | ✓ |
| SMOKE-1 | `Scaffolding limpio crea solo dos niveles en specs/` | 75 | STORY-115 | AC-1 · story.md:36-39 `Entonces existen "docs/specs/epics/" y "docs/specs/stories/"` / `Y existen "docs/product/vision.md", "docs/product/stakeholders.md", "docs/product/objectives.md" y "docs/product/roadmap.md"` / `Y existe "docs/requirements/srs-<project-slug>.md" y no existen "docs/requirements/functional/" ni "docs/requirements/non-functional/" …` / `Pero no existen "docs/specs/01-projects/", "docs/specs/02-epics/" ni "docs/specs/03-stories/"` | ✓ |
| SMOKE-2 | `Migración de un repo de tres niveles` | 83 | STORY-114 | AC-1 · story.md:40-43 `Entonces el contenido de "01-projects/" queda en "docs/product/", "docs/requirements/" y "docs/architecture/c4/" según ADR-0013, con un archivo por FR y NFR` / `Y "02-epics/" pasa a "docs/specs/epics/" y "03-stories/" a "docs/specs/stories/" con el mismo número de archivos` / `Y "memory-system check" devuelve exit code 0 sin wikilinks rotos` | ✓ |
| SMOKE-3 | `Navegabilidad intacta tras el colapso` | 91 | STORY-114 | AC-1 · story.md:43-44 `Y "memory-system check" devuelve exit code 0 sin wikilinks rotos` / `Y los frontmatters conservan sus referencias "parent" y "related", y "memory-system index" regenera "docs/index.md" sin nodos pendientes` | ✓ |

## Hallazgos

Sin hallazgos.

## Notas del análisis

- `STORY-117` cancelada: no cuenta como cobertura de `SMOKE-1`, `SMOKE-2` ni `SMOKE-3` (`docs/specs/stories/STORY-117-verificar-cierre-epic-21/story.md:50-52`), ni del contrato de salida (`story.md:33`, `### AC-1`).
- `STORY-119` cancelada: excluida del universo de cobertura y madurez (Paso 4.6); su `parent` apunta a esta épica, por lo que el índice es consistente.
- Referencias `related` fuera de alcance (`ADR-…`, slug libre `eliminar-specs-01-projects` en `STORY-112`) no se evaluaron. Todas las referencias `STORY-NNN` y `EPIC-NN` del universo resuelven.
