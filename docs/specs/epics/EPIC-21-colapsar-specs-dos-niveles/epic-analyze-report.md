---
type: epic-analyze
id: EPIC-21
slug: EPIC-21-colapsar-specs-dos-niveles-analyze-report
title: "Epic analyze: Colapsar specs/ a dos niveles y eliminar 01-projects/"
epic: EPIC-21
verdict: BLOCKED
errors: 6
warnings: 2
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
| Veredicto | BLOCKED |
| Hallazgos ERROR | 6 |
| Hallazgos WARNING | 2 |
| Contrato de salida | Contrato de salida: 7/14 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 15/15 listas |
| Fecha | 2026-10-13 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `.claude/skills/epic-analyze/assets/epic-analyze-report-template.md` |

**Veredicto:** BLOCKED — informativo; este análisis no cambia el estado de la épica.

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
| STORY-118 | 46 | sí | `docs/specs/stories/STORY-118-requirements-srs-unico-primero/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |
| STORY-119 | — | no | `docs/specs/stories/STORY-119-story-plan-un-subagente-por-paso/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | INT-02 |
| STORY-123 | 45 | sí | `docs/specs/stories/STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo/story.md` | `EPIC-21-colapsar-specs-dos-niveles` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `` `docs/specs/01-projects/` no existe en el repositorio del framework. `` | 60 | — | STORY-108: AC-3 · story.md:56 `Entonces "docs/specs/01-projects/" <resultado>` (solo la fila `ningún archivo` → `ya no existe`; la otra fila la conserva) — parcial | SAL-01 |
| CS-2 | `` `docs/specs/` contiene exactamente dos carpetas de artefactos: `epics/` y `stories/` (más `README.md`). `` | 61 | — | STORY-108: AC-1 · story.md:37 `Entonces existen "docs/specs/epics/" y "docs/specs/stories/" con el mismo número de directorios y archivos que tenían las carpetas originales` (no afirma «exactamente dos» ni `README.md`) — parcial | SAL-01 |
| CS-3 | `` `docs/product/` contiene `vision.md`, `stakeholders.md`, `roadmap.md` y `story-map.md`. `` | 62 | — | STORY-104: AC-1 · story.md:34 `Entonces "docs/product/vision.md" contiene el contenido de las seis secciones de origen` — parcial; STORY-105: AC-1 · story.md:36 `Entonces "Usuarios y roles" de "docs/product/stakeholders.md" contiene los seis perfiles con su ID, nombre y descripción originales` — parcial; STORY-106: AC-1 · story.md:36 `Entonces "docs/product/roadmap.md" lista las 22 épicas ordenadas por ID` — parcial; STORY-107: AC-1 · story.md:35 `Entonces "docs/product/story-map.md" existe con el mismo cuerpo que el original (personas, mapa ASCII, backbone, walking skeleton, user tasks, release slices y notas)` — parcial | SAL-01 |
| CS-4 | `` `docs/architecture/c4/` contiene `context-diagram.puml` y su render `context-diagram.png`. `` | 63 | STORY-107 | AC-2 · story.md:45 `Y "docs/architecture/c4/context-diagram.puml" y "docs/architecture/c4/context-diagram.png" quedan sin cambios` | ✓ |
| CS-5 | `` `docs/requirements/` contiene `functional/` y `non-functional/` poblados o un documento srs de especificación de requerimientos. `` | 64 | STORY-105 | AC-2 · story.md:45 `Entonces "docs/requirements/functional/" contiene 53 archivos "FR-NNN-<slug>.md", uno por requisito y con el mismo ID` · story.md:46 `Y "docs/requirements/non-functional/" contiene 24 archivos "NFR-NNN-<slug>.md", uno por requisito y con el mismo ID` | ✓ |
| CS-6 | `` Ningún skill ni agente referencia `specs/01-projects/`, `specs/02-epics/` ni `specs/03-stories/`. `` | 65 | — | STORY-108: AC-2 · story.md:46 `Entonces no aparece ninguna coincidencia` (busca solo `02-epics` y `03-stories`) — parcial; STORY-113: AC-3 · story.md:57 `Entonces solo aparece en la lógica de migración de "memory-system" que detecta la estructura antigua` (busca solo `01-projects`) — parcial | SAL-01 |
| CS-7 | `` `memory-system migrate --from=specs-3-levels --dry-run` reporta "0 cambios pendientes" tras la migración. `` | 66 | STORY-114 | AC-2 · story.md:51 `Entonces la última línea del informe dice "<resumen>"` · story.md:56 `\| ya migrado con AC-1          \| --dry-run \| cambios pendientes: 0           \| ningún archivo del repositorio cambia             \|` | ✓ |
| CS-8 | `` `memory-system check` devuelve exit code 0. `` | 67 | STORY-114 | AC-1 · story.md:43 `Y "memory-system check" devuelve exit code 0 sin wikilinks rotos` | ✓ |
| CS-9 | `Todas las épicas e historias existentes siguen siendo navegables por wikilinks.` | 68 | STORY-114 | AC-1 · story.md:43 `Y "memory-system check" devuelve exit code 0 sin wikilinks rotos` | ✓ |
| CS-10 | `` `CHANGELOG.md` documenta el breaking change con guía de migración. `` | 69 | STORY-116 | mención · story.md:73 ``- **Origen:** [[ADR-0013-eliminar-specs-01-projects]], consecuencias "Actualización de documentación" y "Breaking change: ... documentarse en el CHANGELOG con guía de migración". Cubre el criterio de salida de EPIC-21 "`CHANGELOG.md` documenta el breaking change con guía de migración".`` | ✓ |
| CS-11 | `Los modos SDD Spec-First y Spec-Anchored funcionan con la nueva estructura.` | 70 | — | — | SAL-01 |
| SMOKE-1 | `Scaffolding limpio crea solo dos niveles en specs/` | 75 | STORY-115 | AC-1 · story.md:36 `Entonces existen "docs/specs/epics/" y "docs/specs/stories/"` (+ `Y`/`Pero` de story.md:37-39: `product/`, `requirements/{functional,non-functional}/` y sin `01-projects/`, `02-epics/` ni `03-stories/`) | ✓ |
| SMOKE-2 | `Migración de un repo de tres niveles` | 83 | — | STORY-114: AC-1 · story.md:40 `Entonces el contenido de "01-projects/" queda en "docs/product/" y "docs/requirements/" según ADR-0013, con un archivo por FR y NFR` (no menciona `architecture/`) — parcial | SAL-02 |
| SMOKE-3 | `Navegabilidad intacta tras el colapso` | 91 | — | STORY-114: AC-1 · story.md:43 `Y "memory-system check" devuelve exit code 0 sin wikilinks rotos` (sin `parent`/`related` ni regeneración de `docs/index.md`) — parcial | SAL-02 |

## Hallazgos

### H-001 [ERROR] — INT-02: Historia huérfana (declara la épica como `parent` pero no está en el índice)

- **Elemento:** `STORY-119`
- **Evidencia:** `docs/specs/stories/STORY-119-story-plan-un-subagente-por-paso/story.md` (`parent: EPIC-21-colapsar-specs-dos-niveles`; `status: CANCELED`)
- **Acción sugerida:** Añadir la línea F2/F3 al índice de historias de `epic.md` o corregir `parent` en el `story.md`.

### H-002 [ERROR] — SAL-01: Criterio de salida sin cobertura

- **Elemento:** `` `docs/specs/01-projects/` no existe en el repositorio del framework. ``
- **Evidencia:** epic.md:60 · evidencia parcial: STORY-108 AC-3 (`docs/specs/stories/STORY-108-renombrar-specs-sin-prefijos/story.md:56`)
- **Acción sugerida:** Crear o ajustar una historia que lo verifique (STORY-123, que lo cubría, está cancelada); si una historia ya lo cubre, citar el criterio en su `story.md`; o retirar el criterio si es obsoleto.

### H-003 [ERROR] — SAL-01: Criterio de salida sin cobertura

- **Elemento:** `` `docs/specs/` contiene exactamente dos carpetas de artefactos: `epics/` y `stories/` (más `README.md`). ``
- **Evidencia:** epic.md:61 · evidencia parcial: STORY-108 AC-1 (`docs/specs/stories/STORY-108-renombrar-specs-sin-prefijos/story.md:37`)
- **Acción sugerida:** Crear o ajustar una historia que lo verifique; si una historia ya lo cubre, citar el criterio en su `story.md`; o retirar el criterio si es obsoleto.

### H-004 [ERROR] — SAL-01: Criterio de salida sin cobertura

- **Elemento:** `` `docs/product/` contiene `vision.md`, `stakeholders.md`, `roadmap.md` y `story-map.md`. ``
- **Evidencia:** epic.md:62 · evidencias parciales (una por archivo, no se suman): STORY-104 AC-1, STORY-105 AC-1, STORY-106 AC-1, STORY-107 AC-1
- **Acción sugerida:** Crear o ajustar una historia que lo verifique, o citar el criterio en el `story.md` que lo cubra (p. ej. mencionándolo en STORY-107, que cierra la capa `product/`); o retirar el criterio si es obsoleto.

### H-005 [ERROR] — SAL-01: Criterio de salida sin cobertura

- **Elemento:** `` Ningún skill ni agente referencia `specs/01-projects/`, `specs/02-epics/` ni `specs/03-stories/`. ``
- **Evidencia:** epic.md:65 · evidencias parciales: STORY-108 AC-2 (`02-epics`, `03-stories`) y STORY-113 AC-3 (`01-projects`)
- **Acción sugerida:** Crear o ajustar una historia que afirme las tres búsquedas sin coincidencias; si una historia ya lo cubre, citar el criterio en su `story.md`; o retirar el criterio si es obsoleto.

### H-006 [ERROR] — SAL-01: Criterio de salida sin cobertura

- **Elemento:** `Los modos SDD Spec-First y Spec-Anchored funcionan con la nueva estructura.`
- **Evidencia:** epic.md:70 (sin evidencia, ni parcial, en historias activas)
- **Acción sugerida:** Crear o ajustar una historia que lo verifique (STORY-117, que lo cubría, está cancelada y su verificación se trasladó a la fase QUALITY de la épica); o retirar de los criterios de salida lo que se valide solo en QUALITY.

### H-007 [WARNING] — SAL-02: Smoke test sin cobertura

- **Elemento:** `SMOKE-2` — `Migración de un repo de tres niveles`
- **Evidencia:** epic.md:83 · evidencia parcial: STORY-114 AC-1 (`docs/specs/stories/STORY-114-migrate-specs-3-levels/story.md:40`)
- **Acción sugerida:** Ajustar el `Entonces` de STORY-114 AC-1 para incluir `architecture/` o citar `SMOKE-2` en su `story.md`; o retirar el smoke test si es obsoleto.

### H-008 [WARNING] — SAL-02: Smoke test sin cobertura

- **Elemento:** `SMOKE-3` — `Navegabilidad intacta tras el colapso`
- **Evidencia:** epic.md:91 · evidencia parcial: STORY-114 AC-1 (`docs/specs/stories/STORY-114-migrate-specs-3-levels/story.md:43`)
- **Acción sugerida:** Añadir a una historia un AC que afirme la conservación de `parent`/`related` y la regeneración de `docs/index.md`, citando `SMOKE-3` en su `story.md`; o retirar el smoke test si es obsoleto.

## Notas del análisis

- `STORY-117` cancelada: no cuenta como cobertura de `CS-2`, `CS-3`, `CS-6`, `CS-8`, `CS-9`, `CS-11`, `SMOKE-1`, `SMOKE-2` ni `SMOKE-3` (`docs/specs/stories/STORY-117-verificar-cierre-epic-21/story.md:50-52,82-85`).
- `STORY-123` cancelada: no cuenta como cobertura de `CS-1` (`docs/specs/stories/STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo/story.md:76`).
- `STORY-119` cancelada: no forma parte del universo de cobertura ni de madurez (sí se evalúa en el índice: INT-02).
- Universo de cobertura y madurez: 15 historias (`STORY-103` a `STORY-116` y `STORY-118`); se excluyen las canceladas `STORY-117`, `STORY-119` y `STORY-123`.
- ⚠️ Usando template seed del skill: no existe `docs/templates/epic-analyze-report-template.md`. Copia `assets/epic-analyze-report-template.md` a `docs/templates/` para personalizarlo.
