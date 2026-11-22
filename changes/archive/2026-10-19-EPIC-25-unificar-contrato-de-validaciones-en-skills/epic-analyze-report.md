---
type: epic-analyze
id: EPIC-25
slug: EPIC-25-unificar-contrato-de-validaciones-en-skills-analyze-report
title: "Epic analyze: Unificar contrato de validaciones en skills"
epic: EPIC-25
verdict: APPROVED
errors: 0
warnings: 0
created: 2026-10-17
updated: 2026-10-17
related:
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
---
<!-- Referencias -->
[[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# Análisis de épica: Unificar contrato de validaciones en skills

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-25 (`docs/specs/epics/EPIC-25-unificar-contrato-de-validaciones-en-skills/epic.md`) |
| Veredicto | APPROVED |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 0 |
| Contrato de salida | Contrato de salida: 14/14 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 8/8 listas |
| Fecha | 2026-10-17 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `skills/epic-analyze/assets/epic-analyze-report-template.md` |

**Veredicto:** APPROVED — informativo; este análisis no cambia el estado de la épica.

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-138 | 22 | sí | `docs/specs/stories/STORY-138-contrato-de-validacion/story.md` | `EPIC-25-unificar-contrato-de-validaciones-en-skills` | ✓ |
| STORY-139 | 23 | sí | `docs/specs/stories/STORY-139-alinear-epic-analyze/story.md` | `EPIC-25-unificar-contrato-de-validaciones-en-skills` | ✓ |
| STORY-140 | 24 | sí | `docs/specs/stories/STORY-140-alinear-story-evaluation/story.md` | `EPIC-25-unificar-contrato-de-validaciones-en-skills` | ✓ |
| STORY-141 | 25 | sí | `docs/specs/stories/STORY-141-alinear-story-code-review/story.md` | `EPIC-25-unificar-contrato-de-validaciones-en-skills` | ✓ |
| STORY-142 | 26 | sí | `docs/specs/stories/STORY-142-alinear-story-verify/story.md` | `EPIC-25-unificar-contrato-de-validaciones-en-skills` | ✓ |
| STORY-143 | 27 | sí | `docs/specs/stories/STORY-143-validacion-end-to-end/story.md` | `EPIC-25-unificar-contrato-de-validaciones-en-skills` | ✓ |
| STORY-144 | 28 | sí | `docs/specs/stories/STORY-144-alinear-story-analyze/story.md` | `EPIC-25-unificar-contrato-de-validaciones-en-skills` | ✓ |
| STORY-145 | 29 | sí | `docs/specs/stories/STORY-145-alinear-story-acceptance/story.md` | `EPIC-25-unificar-contrato-de-validaciones-en-skills` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `` **CS-1** — `docs/policies/validation-contract-policy.md` existe y describe la estructura común de reporte y el vocabulario por fase, con ejemplos para cada skill. `` | 33 | STORY-138 | mención · story.md:103 `` - Cubre el criterio de salida de EPIC-25: **CS-1** — `docs/policies/validation-contract-policy.md` existe y describe la estructura común de reporte y el vocabulario por fase, con ejemplos para cada skill. `` | ✓ |
| CS-2 | `` **CS-2** — Los seis skills de validación (`epic-analyze`, `story-evaluation`, `story-analyze`, `story-code-review`, `story-verify`, `story-acceptance`) tienen una sección `## Veredicto` como primera sección tras el título en sus templates de reporte. `` | 34 | STORY-143 | mención · story.md:70 `` - Cubre el criterio de salida de EPIC-25: **CS-2** — Los seis skills de validación (`epic-analyze`, `story-evaluation`, `story-analyze`, `story-code-review`, `story-verify`, `story-acceptance`) tienen una sección `## Veredicto` como primera sección tras el título en sus templates de reporte. `` | ✓ |
| CS-3 | `` **CS-3** — Los seis templates de reporte declaran `verdict` en el frontmatter con valores del vocabulario controlado. `` | 35 | STORY-143 | mención · story.md:71 `` - Cubre el criterio de salida de EPIC-25: **CS-3** — Los seis templates de reporte declaran `verdict` en el frontmatter con valores del vocabulario controlado. `` | ✓ |
| CS-4 | `` **CS-4** — `epic-analyze` produce un veredicto explícito `APPROVED` \| `NEEDS-REFINEMENT`, sin `BLOCKED`. `` | 36 | STORY-139 | mención · story.md:67 `` - Cubre el criterio de salida de EPIC-25: **CS-4** — `epic-analyze` produce un veredicto explícito `APPROVED` \| `NEEDS-REFINEMENT`, sin `BLOCKED`. Contribuye además a la sección `## Veredicto` como primera sección y a `verdict` en el frontmatter. `` | ✓ |
| CS-5 | `` **CS-5** — `story-evaluation` produce un veredicto explícito `APPROVED` \| `NEEDS-REFINEMENT` \| `SPLIT`, y `RECHAZAR` se mapea a `NEEDS-REFINEMENT`. `` | 37 | STORY-140 | mención · story.md:73 `` - Cubre el criterio de salida de EPIC-25: **CS-5** — `story-evaluation` produce un veredicto explícito `APPROVED` \| `NEEDS-REFINEMENT` \| `SPLIT`, y `RECHAZAR` se mapea a `NEEDS-REFINEMENT`. Contribuye además a `## Veredicto` como primera sección, a `verdict` en el frontmatter y a que no quede ninguna variante `APROBADA`. `` | ✓ |
| CS-6 | `` **CS-6** — `story-analyze` produce un veredicto explícito `APPROVED` \| `NEEDS-CHANGES`. `` | 38 | STORY-144 | mención · story.md:65 `` - Cubre el criterio de salida de EPIC-25: **CS-6** — `story-analyze` produce un veredicto explícito `APPROVED` \| `NEEDS-CHANGES`. Contribuye además a `## Veredicto` como primera sección y a `verdict` en el frontmatter. `` | ✓ |
| CS-7 | `` **CS-7** — `story-code-review` produce un veredicto explícito `APPROVED` \| `NEEDS-CHANGES`. `` | 39 | STORY-141 | mención · story.md:63 `` - Cubre el criterio de salida de EPIC-25: **CS-7** — `story-code-review` produce un veredicto explícito `APPROVED` \| `NEEDS-CHANGES`. Contribuye además a `## Veredicto` como primera sección, a `verdict` en el frontmatter y a que no quede ninguna variante `approved` ni `review-status`. `` | ✓ |
| CS-8 | `` **CS-8** — `story-verify` produce un veredicto explícito `APPROVED` \| `NEEDS-CHANGES` \| `BLOCKED`, sin `RECHAZAR`, `RECHAZADO` ni `REJECTED`. `` | 40 | STORY-142 | mención · story.md:66 `` - Cubre el criterio de salida de EPIC-25: **CS-8** — `story-verify` produce un veredicto explícito `APPROVED` \| `NEEDS-CHANGES` \| `BLOCKED`, sin `RECHAZAR`, `RECHAZADO` ni `REJECTED`. Verifica SMOKE-2. `` | ✓ |
| CS-9 | `` **CS-9** — `story-acceptance` produce un veredicto explícito `APPROVED` \| `NEEDS-CHANGES` \| `BLOCKED`, y `PENDING` mientras la sesión está a medias, sin `ACCEPTANCE-REJECTED`. `` | 41 | STORY-145 | mención · story.md:72 `` - Cubre el criterio de salida de EPIC-25: **CS-9** — `story-acceptance` produce un veredicto explícito `APPROVED` \| `NEEDS-CHANGES` \| `BLOCKED`, y `PENDING` mientras la sesión está a medias, sin `ACCEPTANCE-REJECTED`. Contribuye además a `## Veredicto` como primera sección y a `verdict` en el frontmatter. `` | ✓ |
| CS-10 | `` **CS-10** — No existe ninguna variante `APROBADA`, `Aprobada`, `review-status` ni el valor de veredicto `approved` en skills, templates ni documentación vigente del framework (se excluyen los artefactos históricos de `docs/specs/` y las versiones publicadas del CHANGELOG). `` | 42 | STORY-143 | mención · story.md:72 `` - Cubre el criterio de salida de EPIC-25: **CS-10** — No existe ninguna variante `APROBADA`, `Aprobada`, `review-status` ni el valor de veredicto `approved` en skills, templates ni documentación vigente del framework (se excluyen los artefactos históricos de `docs/specs/` y las versiones publicadas del CHANGELOG). `` | ✓ |
| CS-11 | `` **CS-11** — El README del framework apunta a `docs/policies/validation-contract-policy.md` como fuente de verdad del contrato de validación. `` | 43 | STORY-143 | mención · story.md:73 `` - Cubre el criterio de salida de EPIC-25: **CS-11** — El README del framework apunta a `docs/policies/validation-contract-policy.md` como fuente de verdad del contrato de validación. `` | ✓ |
| SMOKE-1 | `Veredicto uniforme en los seis reportes` | 47 | STORY-143 | mención · story.md:74 `- Verifica SMOKE-1 y SMOKE-3.` | ✓ |
| SMOKE-2 | `story-verify emite veredicto consumible por CI` | 56 | STORY-142 | mención · story.md:66 `` - Cubre el criterio de salida de EPIC-25: **CS-8** — `story-verify` produce un veredicto explícito `APPROVED` \| `NEEDS-CHANGES` \| `BLOCKED`, sin `RECHAZAR`, `RECHAZADO` ni `REJECTED`. Verifica SMOKE-2. `` | ✓ |
| SMOKE-3 | `Vocabulario canónico sin variantes` | 65 | STORY-143 | mención · story.md:74 `- Verifica SMOKE-1 y SMOKE-3.` | ✓ |

## Hallazgos

Sin hallazgos.

## Notas del análisis

Sin notas.
