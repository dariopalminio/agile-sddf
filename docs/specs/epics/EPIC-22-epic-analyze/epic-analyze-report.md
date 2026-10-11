---
type: epic-analyze
id: EPIC-22
slug: EPIC-22-epic-analyze-analyze-report
title: "Epic analyze: Skill `epic-analyze`: análisis de una épica antes de desarrollarla"
epic: EPIC-22
verdict: APPROVED
errors: 0
warnings: 0
created: 2026-10-09
updated: 2026-10-09
related:
  - EPIC-22-epic-analyze
---
<!-- Referencias -->
[[EPIC-22-epic-analyze]]

# Análisis de épica: `Skill epic-analyze: análisis de una épica antes de desarrollarla`

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-22 (`docs/specs/02-epics/EPIC-22-epic-analyze/epic.md`) |
| Veredicto | APPROVED |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 0 |
| Contrato de salida | Contrato de salida: 8/8 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 3/3 listas |
| Fecha | 2026-10-09 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `skills/epic-analyze/assets/epic-analyze-report-template.md` |

**Veredicto:** APPROVED — informativo; este análisis no cambia el estado de la épica.

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-120 | 26 | sí | `docs/specs/03-stories/STORY-120-epic-analyze-integridad-historias/story.md` | `EPIC-22-epic-analyze` | ✓ |
| STORY-121 | 27 | sí | `docs/specs/03-stories/STORY-121-epic-analyze-cobertura-criterios-salida/story.md` | `EPIC-22-epic-analyze` | ✓ |
| STORY-122 | 28 | sí | `docs/specs/03-stories/STORY-122-epic-analyze-madurez-historias-hijas/story.md` | `EPIC-22-epic-analyze` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `` `skills/epic-analyze/SKILL.md` existe, resuelve `REPO_ROOT`/`SPECS_BASE` con la precedencia `SDDF_ROOT` → `sddf.config.yaml.root` → `docs` y tiene `evals/evals.json`. `` | 31 | STORY-120 | mención · story.md:89 `` - Cubre el criterio de salida de EPIC-22: `skills/epic-analyze/SKILL.md` existe, resuelve `REPO_ROOT`/`SPECS_BASE` con la precedencia `SDDF_ROOT` → `sddf.config.yaml.root` → `docs` y tiene `evals/evals.json`. `` | ✓ |
| CS-2 | `El reporte detecta historias faltantes, huérfanas y duplicadas entre la sección "Historias" de epic.md y los story.md que la declaran como parent (STORY-120).` | 32 | STORY-120 | AC-2 · story.md:44 `Entonces el reporte contiene hallazgos "<severidad>" que citan "<elemento>"` (Ejemplos: listada sin directorio, no listada con parent, listada dos veces) | ✓ |
| CS-3 | `El reporte incluye una tabla de cobertura de criterios de salida y smoke tests, con un hallazgo por cada elemento sin cubrir (STORY-121).` | 33 | STORY-121 | mención · story.md:70 `- Cubre el criterio de salida de EPIC-22: El reporte incluye una tabla de cobertura de criterios de salida y smoke tests, con un hallazgo por cada elemento sin cubrir (STORY-121).` | ✓ |
| CS-4 | `El reporte señala con WARNING las historias hijas no especificadas o con referencias rotas (STORY-122).` | 34 | STORY-122 | AC-2 · story.md:41 `Entonces el reporte contiene un hallazgo WARNING que cita "<elemento>"` (Ejemplos: `SPECIFY/IN-PROGRESS`, `related` a `STORY-999` inexistente) | ✓ |
| CS-5 | `Ante una épica inexistente, el skill informa la ruta buscada y no escribe reporte.` | 35 | STORY-120 | AC-3 · story.md:59 `Entonces el skill informa que "EPIC-77" no se encontró e indica la ruta buscada` · story.md:60 `Pero no escribe ningún "epic-analyze-report.md"` | ✓ |
| CS-6 | `` `skills/epic-analyze/` está incluido en el arreglo `files` de `package.json`. `` | 36 | STORY-120 | mención · story.md:90 `` - Cubre el criterio de salida de EPIC-22: `skills/epic-analyze/` está incluido en el arreglo `files` de `package.json`. `` | ✓ |
| SMOKE-1 | `Épica consistente obtiene veredicto APPROVED` | 41 | STORY-121 | STORY-120 · AC-1 · story.md:34 `Entonces se escribe "epic-analyze-report.md" en el directorio de "EPIC-30-ejemplo"` · story.md:35 `Y el reporte declara el veredicto "APPROVED" con 0 hallazgos ERROR` — parcial · STORY-121 · mención · story.md:30 `Dado la épica "EPIC-30-ejemplo" con 2 criterios de salida y "SMOKE-1"` | ✓ |
| SMOKE-2 | `Épica inexistente` | 49 | STORY-120, STORY-121 | STORY-120 · AC-3 · story.md:59 `Entonces el skill informa que "EPIC-77" no se encontró e indica la ruta buscada` · story.md:60 `Pero no escribe ningún "epic-analyze-report.md"` · STORY-121 · mención · story.md:47 `\| "SMOKE-2" sin historia que lo cubra \| WARNING \| SMOKE-2 \|` | ✓ |

## Hallazgos

Sin hallazgos.

## Notas del análisis

- `docs/specs/03-stories/STORY-121-epic-analyze-cobertura-criterios-salida/story.md:30` y `:47`: las menciones E1 de `SMOKE-1` y `SMOKE-2` pertenecen a los escenarios de ejemplo de `EPIC-30-ejemplo`, no al contrato de EPIC-22; cuentan como evidencia por la regla determinista de mención. `SMOKE-2` está además cubierto por E2 en STORY-120 › AC-3; `SMOKE-1` solo tiene E2 `parcial` (STORY-120 › AC-1 afirma `0 hallazgos ERROR`, no `sin hallazgos`).
