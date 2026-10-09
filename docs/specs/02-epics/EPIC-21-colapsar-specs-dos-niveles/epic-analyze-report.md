---
type: epic-analyze
id: EPIC-21
slug: EPIC-21-colapsar-specs-dos-niveles-analyze-report
title: "Epic analyze: Colapsar specs/ a dos niveles y eliminar 01-projects/"
epic: EPIC-21
verdict: APPROVED
errors: 0
warnings: 1
created: 2026-10-09
updated: 2026-10-09
related:
  - EPIC-21-colapsar-specs-dos-niveles
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]

# Análisis de épica: Colapsar specs/ a dos niveles y eliminar 01-projects/

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-21 (`docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`) |
| Veredicto | APPROVED |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 1 |
| Contrato de salida | Contrato de salida: 14/14 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 17/18 listas |
| Fecha | 2026-10-09 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `.claude/skills/epic-analyze/assets/epic-analyze-report-template.md` |

**Veredicto:** APPROVED — informativo; este análisis no cambia el estado de la épica.

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-103 | 34 | sí | `docs/specs/03-stories/STORY-103-replace-the-epic-template/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-104 | 35 | sí | `docs/specs/03-stories/STORY-104-migrar-project-intent-a-vision/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-105 | 36 | sí | `docs/specs/03-stories/STORY-105-migrar-stakeholders-y-requisitos/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-106 | 37 | sí | `docs/specs/03-stories/STORY-106-migrar-plan-a-roadmap/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-107 | 38 | sí | `docs/specs/03-stories/STORY-107-migrar-story-map-y-diagrama-contexto/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-108 | 39 | sí | `docs/specs/03-stories/STORY-108-renombrar-specs-sin-prefijos/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-109 | 40 | sí | `docs/specs/03-stories/STORY-109-project-begin-escribe-vision/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-110 | 41 | sí | `docs/specs/03-stories/STORY-110-discovery-escribe-stakeholders-y-requisitos/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-111 | 42 | sí | `docs/specs/03-stories/STORY-111-planning-escribe-roadmap/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-112 | 43 | sí | `docs/specs/03-stories/STORY-112-story-map-y-diagrama-en-sus-capas/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-113 | 44 | sí | `docs/specs/03-stories/STORY-113-project-flow-sin-01-projects/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-114 | 45 | sí | `docs/specs/03-stories/STORY-114-migrate-specs-3-levels/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-115 | 46 | sí | `docs/specs/03-stories/STORY-115-scaffold-dos-niveles-y-capas-destino/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-116 | 47 | sí | `docs/specs/03-stories/STORY-116-documentar-modelo-dos-niveles/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-117 | 48 | sí | `docs/specs/03-stories/STORY-117-verificar-cierre-epic-21/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-118 | 49 | sí | `docs/specs/03-stories/STORY-118-requirements-srs-unico-primero/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-119 | 31 | sí | `docs/specs/03-stories/STORY-119-story-plan-un-subagente-por-paso/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-123 | 50 | sí | `docs/specs/03-stories/STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `` `docs/specs/01-projects/` no existe en el repositorio del framework. `` | 54 | STORY-123 | STORY-108: AC-3 · story.md:56 `Entonces "docs/specs/01-projects/" <resultado>` (fila `ningún archivo` → `ya no existe`) — parcial; STORY-123: mención · story.md:71 ``- **Criterio de salida que cubre:** `docs/specs/01-projects/` no existe en el repositorio del framework.`` | ✓ |
| CS-2 | `` `docs/specs/` contiene exactamente dos carpetas de artefactos: `epics/` y `stories/` (más `README.md`). `` | 55 | STORY-117 | STORY-108: AC-1 · story.md:37 `Entonces existen "docs/specs/epics/" y "docs/specs/stories/" con el mismo número de directorios y archivos que tenían las carpetas originales` — parcial; STORY-117: mención · story.md:82 ``  - `docs/specs/` contiene exactamente dos carpetas de artefactos: `epics/` y `stories/` (más `README.md`) (lo entregan STORY-108 y STORY-123).`` | ✓ |
| CS-3 | `` `docs/product/` contiene `vision.md`, `stakeholders.md`, `roadmap.md` y `story-map.md`. `` | 56 | STORY-117 | STORY-104: AC-1 · story.md:34 `Entonces "docs/product/vision.md" contiene el contenido de las seis secciones de origen` — parcial; STORY-105: AC-1 · story.md:36 `Entonces "Usuarios y roles" de "docs/product/stakeholders.md" contiene los seis perfiles con su ID, nombre y descripción originales` — parcial; STORY-106: AC-1 · story.md:36 `Entonces "docs/product/roadmap.md" lista las 22 épicas ordenadas por ID` — parcial; STORY-107: AC-1 · story.md:35 `Entonces "docs/product/story-map.md" existe con el mismo cuerpo que el original (personas, mapa ASCII, backbone, walking skeleton, user tasks, release slices y notas)` — parcial; STORY-117: mención · story.md:83 ``  - `docs/product/` contiene `vision.md`, `stakeholders.md`, `roadmap.md` y `story-map.md` (lo entregan STORY-104 a STORY-107).`` | ✓ |
| CS-4 | `` `docs/architecture/c4/` contiene `context-diagram.puml`. `` | 57 | STORY-107 | AC-2 · story.md:45 `Y "docs/architecture/c4/context-diagram.puml" y "docs/architecture/c4/context-diagram.png" quedan sin cambios` | ✓ |
| CS-5 | `` `docs/requirements/` contiene `functional/` y `non-functional/` poblados o un documento srs de especificación de requerimientos. `` | 58 | STORY-105 | AC-2 · story.md:45 `Entonces "docs/requirements/functional/" contiene 53 archivos "FR-NNN-<slug>.md", uno por requisito y con el mismo ID` · story.md:46 `Y "docs/requirements/non-functional/" contiene 24 archivos "NFR-NNN-<slug>.md", uno por requisito y con el mismo ID` | ✓ |
| CS-6 | `` Ningún skill ni agente referencia `specs/01-projects/`, `specs/02-epics/` ni `specs/03-stories/`. `` | 59 | STORY-117 | STORY-108: AC-2 · story.md:46 `Entonces no aparece ninguna coincidencia` (búsqueda de `"02-epics"` y `"03-stories"`, sin `01-projects`) — parcial; STORY-113: AC-3 · story.md:57 `Entonces solo aparece en la lógica de migración de "memory-system" que detecta la estructura antigua` (solo `01-projects`) — parcial; STORY-117: mención · story.md:84 ``  - Ningún skill ni agente referencia `specs/01-projects/`, `specs/02-epics/` ni `specs/03-stories/` (lo entregan STORY-108 y STORY-113).`` | ✓ |
| CS-7 | `` `memory-system migrate --from=specs-3-levels --dry-run` reporta "0 cambios pendientes" tras la migración. `` | 60 | STORY-114 | AC-2 · story.md:51 `Entonces la última línea del informe dice "<resumen>"` · story.md:56 `\| ya migrado con AC-1          \| --dry-run \| cambios pendientes: 0           \| ningún archivo del repositorio cambia             \|` | ✓ |
| CS-8 | `` `memory-system check` devuelve exit code 0. `` | 61 | STORY-114, STORY-117 | STORY-114: AC-1 · story.md:43 `Y "memory-system check" devuelve exit code 0 sin wikilinks rotos`; STORY-117: AC-2 · story.md:46 `Entonces se cumple "<resultado esperado>"` · story.md:54 `"story.md" sigue en "specs/stories/", indexado, y "check" devuelve exit code 0` | ✓ |
| CS-9 | `Todas las épicas e historias existentes siguen siendo navegables por wikilinks.` | 62 | STORY-114, STORY-117 | STORY-114: AC-1 · story.md:43 `Y "memory-system check" devuelve exit code 0 sin wikilinks rotos`; STORY-117: AC-2 · story.md:46 `Entonces se cumple "<resultado esperado>"` · story.md:52 `todos los "[[EPIC-*]]" y "[[STORY-*]]" resuelven y "index.md" se regenera` | ✓ |
| CS-10 | `` `CHANGELOG.md` documenta el breaking change con guía de migración. `` | 63 | STORY-116 | mención · story.md:73 ``- **Origen:** [[ADR-0013-eliminar-specs-01-projects]], consecuencias "Actualización de documentación" y "Breaking change: ... documentarse en el CHANGELOG con guía de migración". Cubre el criterio de salida de EPIC-21 "`CHANGELOG.md` documenta el breaking change con guía de migración".`` | ✓ |
| CS-11 | `Los modos SDD Spec-First y Spec-Anchored funcionan con la nueva estructura.` | 64 | STORY-117 | mención · story.md:85 `  - Los modos SDD Spec-First y Spec-Anchored funcionan con la nueva estructura (AC-2, filas Spec-First y Spec-Anchored).` | ✓ |
| SMOKE-1 | `` Scaffolding limpio crea solo dos niveles en `specs/` `` | 69 | STORY-115, STORY-117 | STORY-115: AC-1 · story.md:36 `Entonces existen "docs/specs/epics/" y "docs/specs/stories/"` (+ `Y`/`Pero` de story.md:37-39 con `product/`, `requirements/{functional,non-functional}/` y sin `01-projects/`, `02-epics/` ni `03-stories/`); STORY-117: mención · story.md:50 `` \| sin "docs/"                     \| SMOKE-1 de EPIC-21 ("/memory-system scaffold")                            \| solo "specs/epics/" y "specs/stories/" en "specs/", con "product/" y "requirements/" sembrados   \| `` | ✓ |
| SMOKE-2 | `Migración de un repo de tres niveles` | 77 | STORY-117 | STORY-114: AC-1 · story.md:40 `Entonces el contenido de "01-projects/" queda en "docs/product/" y "docs/requirements/" según ADR-0013, con un archivo por FR y NFR` (sin `architecture/`) — parcial; STORY-117: mención · story.md:51 `` \| "specs/" de tres niveles        \| SMOKE-2 de EPIC-21 ("/memory-system migrate --from=specs-3-levels")       \| colapso sin archivos perdidos ni wikilinks rotos                                                 \| `` | ✓ |
| SMOKE-3 | `Navegabilidad intacta tras el colapso` | 85 | STORY-117 | STORY-114: AC-1 · story.md:43 `Y "memory-system check" devuelve exit code 0 sin wikilinks rotos` (sin `parent`/`related` ni regeneración de `docs/index.md`) — parcial; STORY-117: mención · story.md:52 `` \| "specs/" de tres niveles        \| SMOKE-3 de EPIC-21 (migración completa e "index")                         \| todos los "[[EPIC-*]]" y "[[STORY-*]]" resuelven y "index.md" se regenera                        \| `` | ✓ |

## Hallazgos

### H-001 [WARNING] — MAD-01: Historia sin especificar

- **Elemento:** `STORY-123` `SPECIFY/IN-PROGRESS`
- **Evidencia:** `docs/specs/03-stories/STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo/story.md:8`
- **Acción sugerida:** completar su especificación con `/story-specify`

## Notas del análisis

- `STORY-117` AC-1 (`docs/specs/03-stories/STORY-117-verificar-cierre-epic-21/story.md:37`, `Entonces "verify-report.md" de esta historia registra cada criterio de salida con resultado "PASS", el comando ejecutado y su salida`) no se cuenta como evidencia E2 de ningún criterio: afirma el contenido de otro artefacto (`verify-report.md`), no el resultado observable de cada criterio.
- CS-1 a CS-6 se refieren al estado del repositorio del framework (CS-1 lo declara explícitamente; CS-2 a CS-6 nombran sus rutas): los AC que afirman el mismo resultado sobre repositorios de prueba o recién creados (`STORY-114` AC-1, `STORY-115` AC-1, `STORY-113` AC-1, `STORY-117` AC-2) no cuentan como cobertura de esos criterios.
