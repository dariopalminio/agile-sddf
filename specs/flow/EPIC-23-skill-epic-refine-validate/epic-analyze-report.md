---
type: epic-analyze
id: EPIC-23
slug: EPIC-23-skill-epic-validate-analyze-report
title: "Epic analyze: Skill epic-validate"
epic: EPIC-23
verdict: APPROVED
errors: 0
warnings: 0
created: 2026-10-17
updated: 2026-10-17
related:
  - EPIC-23-skill-epic-validate
---
<!-- Referencias -->
[[EPIC-23-skill-epic-validate]]

# Análisis de épica: Skill epic-validate

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-23 (`docs/specs/epics/EPIC-23-skill-epic-validate/epic.md`) |
| Veredicto | APPROVED |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 0 |
| Contrato de salida | Contrato de salida: 12/12 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 5/5 listas |
| Fecha | 2026-10-17 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `.claude/skills/epic-analyze/assets/epic-analyze-report-template.md` |

**Veredicto:** APPROVED — informativo; este análisis no cambia el estado de la épica.

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-124 | 24 | sí | `docs/specs/stories/STORY-124-validar-preparacion-estructural-epica/story.md` | `EPIC-23-skill-epic-validate` | ✓ |
| STORY-125 | 25 | sí | `docs/specs/stories/STORY-125-validar-evidencia-operativa-epica/story.md` | `EPIC-23-skill-epic-validate` | ✓ |
| STORY-126 | 26 | sí | `docs/specs/stories/STORY-126-operar-validacion-epica-segura/story.md` | `EPIC-23-skill-epic-validate` | ✓ |
| STORY-127 | 27 | sí | `docs/specs/stories/STORY-127-integrar-adoptar-gateway-epica/story.md` | `EPIC-23-skill-epic-validate` | ✓ |
| STORY-128 | 28 | sí | `docs/specs/stories/STORY-128-evaluar-validacion-epica-repetible/story.md` | `EPIC-23-skill-epic-validate` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `` **CS-1** — `skills/epic-validate/SKILL.md` existe y resuelve `REPO_ROOT` y `SPECS_BASE` con la precedencia vigente. `` | 32 | STORY-124 | mención · story.md:69 `` - Cubre el criterio de salida de EPIC-23: **CS-1** — `skills/epic-validate/SKILL.md` existe y resuelve `REPO_ROOT` y `SPECS_BASE` con la precedencia vigente. `` | ✓ |
| CS-2 | `` **CS-2** — `skills/epic-validate/assets/epic-validate-report-template.md` existe, declara en cada sección su marcador `sección obligatoria · clave · escritor` y tiene `## Veredicto` como primera sección tras el título. `` | 33 | STORY-124 | mención · story.md:70 `` - Cubre el criterio de salida de EPIC-23: **CS-2** — `skills/epic-validate/assets/epic-validate-report-template.md` existe, declara en cada sección su marcador `sección obligatoria · clave · escritor` y tiene `## Veredicto` como primera sección tras el título. `` | ✓ |
| CS-3 | ``**CS-3** — Se verifican el estado terminal de las historias y el veredicto APPROVED del análisis de la épica.`` | 34 | STORY-124 | mención · story.md:71 ``- Cubre el criterio de salida de EPIC-23: **CS-3** — Se verifican el estado terminal de las historias y el veredicto APPROVED del análisis de la épica.`` | ✓ |
| CS-4 | `` **CS-4** — Se verifican los smoke tests, `verify:release` y el DoD de épica cuando exista. `` | 35 | STORY-125 | mención · story.md:69 `` - Cubre el criterio de salida de EPIC-23: **CS-4** — Se verifican los smoke tests, `verify:release` y el DoD de épica cuando exista. `` | ✓ |
| CS-5 | `` **CS-5** — El reporte se genera desde su plantilla sin marcadores sin resolver, declara el veredicto en su primera sección y en el campo `verdict` del frontmatter con el vocabulario único `APPROVED` o `BLOCKED`. `` | 36 | STORY-124 | mención · story.md:72 `` - Cubre el criterio de salida de EPIC-23: **CS-5** — El reporte se genera desde su plantilla sin marcadores sin resolver, declara el veredicto en su primera sección y en el campo `verdict` del frontmatter con el vocabulario único `APPROVED` o `BLOCKED`. `` | ✓ |
| CS-6 | ``**CS-6** — Una épica inexistente informa la ruta buscada y no genera reporte.`` | 37 | STORY-124 | mención · story.md:73 ``- Cubre el criterio de salida de EPIC-23: **CS-6** — Una épica inexistente informa la ruta buscada y no genera reporte.`` | ✓ |
| CS-7 | `` **CS-7** — El skill solo escribe `epic-validate-report.md`; no modifica código, fuentes ni otros documentos. `` | 38 | STORY-126 | mención · story.md:65 `` - Cubre el criterio de salida de EPIC-23: **CS-7** — El skill solo escribe `epic-validate-report.md`; no modifica código, fuentes ni otros documentos. `` | ✓ |
| CS-8 | `` **CS-8** — `skills/epic-validate/` figura en el arreglo `files` de `package.json`. `` | 39 | STORY-127 | mención · story.md:68 `` - Cubre el criterio de salida de EPIC-23: **CS-8** — `skills/epic-validate/` figura en el arreglo `files` de `package.json`. `` | ✓ |
| CS-9 | `` **CS-9** — `skills/epic-validate/evals/evals.json` incluye al menos una épica consistente que resulte APPROVED y una inconsistente que resulte BLOCKED. `` | 40 | STORY-128 | mención · story.md:66 `` - Cubre el criterio de salida de EPIC-23: **CS-9** — `skills/epic-validate/evals/evals.json` incluye al menos una épica consistente que resulte APPROVED y una inconsistente que resulte BLOCKED. `` | ✓ |
| SMOKE-1 | `Épica consistente obtiene APPROVED` | 44 | STORY-125 | mención · story.md:70 `- Cubre SMOKE-1 de EPIC-23 (AC-1).` | ✓ |
| SMOKE-2 | `Épica inexistente no escribe reporte` | 54 | STORY-124 | mención · story.md:74 `- Cubre SMOKE-2 de EPIC-23 (AC-3) y SMOKE-3 de EPIC-23 (AC-2).` | ✓ |
| SMOKE-3 | `Historia no terminal bloquea la épica` | 62 | STORY-124 | mención · story.md:74 `- Cubre SMOKE-2 de EPIC-23 (AC-3) y SMOKE-3 de EPIC-23 (AC-2).` | ✓ |

## Hallazgos

Sin hallazgos.

## Notas del análisis

Sin notas.
