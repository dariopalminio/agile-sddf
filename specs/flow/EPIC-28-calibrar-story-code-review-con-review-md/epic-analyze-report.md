---
type: epic-analyze
id: EPIC-28
slug: EPIC-28-calibrar-story-code-review-con-review-md-analyze-report
title: "Epic analyze: Calibrar story-code-review con REVIEW.md"
epic: EPIC-28
verdict: APPROVED
errors: 0
warnings: 0
created: 2026-11-12
updated: 2026-11-12
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# Análisis de épica: Calibrar story-code-review con REVIEW.md

## Veredicto

**Veredicto:** `APPROVED` — sin hallazgos ERROR y 0 WARNING (umbral: 3)
Informativo: este análisis no cambia el estado de la épica.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-28 (`specs/flow/EPIC-28-calibrar-story-code-review-con-review-md/epic.md`) |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 0 |
| Contrato de salida | Contrato de salida: 17/17 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 9/9 listas |
| Fecha | 2026-11-12 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `.claude/skills/epic-analyze/assets/epic-analyze-report-template.md` (seed) |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-177 | 29 | sí | `specs/flow/STORY-177-corregir-rutas-story-code-review/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-178 | 30 | sí | `specs/flow/STORY-178-adr-guia-de-revision/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-179 | 31 | sí | `specs/flow/STORY-179-review-md-de-agile-sddf/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-180 | 32 | sí | `specs/flow/STORY-180-story-code-review-lee-review-md/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-181 | 33 | sí | `specs/flow/STORY-181-hallazgos-preexistentes/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-182 | 34 | sí | `specs/flow/STORY-182-verificar-y-deduplicar-hallazgos/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-183 | 35 | sí | `specs/flow/STORY-183-dod-code-review-sin-criterios-circulares/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-184 | 36 | sí | `specs/flow/STORY-184-review-md-semilla-para-proyectos-consumidores/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-185 | 37 | sí | `specs/flow/STORY-185-tope-de-low-y-arrastres/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | ``**CS-1a** — Un ADR nuevo, registrado en `docs/adr/README.md`, fija la ubicación, la precedencia, la fuente de lectura y el vocabulario de `REVIEW.md`.`` | 41 | STORY-178 | mención · story.md:75 ``- Cubre el criterio de salida de EPIC-28 **CS-1a** — Un ADR nuevo, registrado en `docs/adr/README.md`, fija la ubicación, la precedencia, la fuente de lectura y el vocabulario de `REVIEW.md`. El `REVIEW.md` con sus cuatro secciones (**CS-1b**) corresponde a la historia «REVIEW.md de agile-sddf».`` | ✓ |
| CS-2 | ``**CS-1b** — `REVIEW.md` existe en la raíz con las secciones qué es importante, tope de Minor, qué no reportar y qué verificar siempre.`` | 42 | STORY-179 | mención · story.md:82 ``- Cubre el criterio de salida de EPIC-28 **CS-1b** — `REVIEW.md` existe en la raíz con las secciones qué es importante, tope de Minor, qué no reportar y qué verificar siempre. La parte del ADR (**CS-1a**) corresponde a STORY-178.`` | ✓ |
| CS-3 | ``**CS-2** — `story-code-review` pasa `REVIEW.md` a los cuatro revisores y al árbitro; sin `REVIEW.md` emite una advertencia y el contrato de `code-review-report.md` (frontmatter, secciones y veredicto) no cambia.`` | 43 | STORY-180 | mención · story.md:87 ``- Cubre el criterio de salida de EPIC-28 **CS-2** — `story-code-review` pasa `REVIEW.md` a los cuatro revisores y al árbitro; sin `REVIEW.md` emite una advertencia y el contrato de `code-review-report.md` (frontmatter, secciones y veredicto) no cambia.`` | ✓ |
| CS-4 | ``**CS-3** — `grep -rE "Principio 6\|teléfono descompuesto\|un solo nivel de delegación" skills/story-code-review/agents/` no devuelve resultados.`` | 44 | STORY-180 | AC-5 · story.md:68 `Entonces no devuelve resultados` | ✓ |
| CS-5 | ``**CS-4a** — Un hallazgo PREEXISTENTE no cambia el veredicto ni entra en `fix-directives.md`.`` | 45 | STORY-181 | mención · story.md:72 ``- Cubre el criterio de salida de EPIC-28 **CS-4a** — Un hallazgo PREEXISTENTE no cambia el veredicto ni entra en `fix-directives.md`.`` | ✓ |
| CS-6 | ``**CS-4b** — Un HIGH/MEDIUM sin `Archivo:Línea` y escenario de fallo no cambia el veredicto ni entra en `fix-directives.md`, y un hallazgo repetido entre revisores aparece una sola vez.`` | 46 | STORY-182 | mención · story.md:74 ``- Cubre el criterio de salida de EPIC-28 **CS-4b** — Un HIGH/MEDIUM sin `Archivo:Línea` y escenario de fallo no cambia el veredicto ni entra en `fix-directives.md`, y un hallazgo repetido entre revisores aparece una sola vez. El control de ruido (tope y arrastres de LOW, **CS-4c**) es STORY-185. …`` | ✓ |
| CS-7 | ``**CS-4c** — Ningún revisor supera el tope de LOW.`` | 47 | STORY-185 | mención · story.md:79 ``- Cubre el criterio de salida de EPIC-28 **CS-4c** — Ningún revisor supera el tope de LOW. También cubre los arrastres de LOW entre rondas.`` | ✓ |
| CS-8 | ``**CS-5** — `dod-story-code-review.md` y su plantilla en `skills/sddf-constitution/assets/dod-story/` no contienen criterios que el orquestador satisface por sí mismo (informe creado, veredicto `APPROVED`, ausencia de bloqueantes), y `memory-system check` pasa.`` | 48 | STORY-183 | mención · story.md:76 ``- Cubre el criterio de salida de EPIC-28 **CS-5** — `dod-story-code-review.md` y su plantilla en `skills/sddf-constitution/assets/dod-story/` no contienen criterios que el orquestador satisface por sí mismo (informe creado, veredicto `APPROVED`, ausencia de bloqueantes), y `memory-system check` pasa.`` | ✓ |
| CS-9 | ``**CS-6** — `/sddf-constitution` crea `REVIEW.md` desde una plantilla cuando no existe y no lo modifica si ya existe.`` | 49 | STORY-184 | AC-3 · story.md:51 `Entonces la primera ejecución crea "REVIEW.md"` `Y la segunda no lo modifica` (STORY-184 › AC-1 · story.md:33 `Entonces se crea "REVIEW.md" en la raíz desde la plantilla del skill` es `parcial`) | ✓ |
| CS-10 | ``**CS-7** — Los cuatro informes parciales se escriben en `.tmp/story-code-review/{story_id}/`, y el Security-Reviewer descubre los checklists `docs/guardrails/gr-*security*` sin depender de los enlaces de `constitution.md`.`` | 50 | STORY-177 | mención · story.md:67 ``- Cubre el criterio de salida de EPIC-28 **CS-7** — Los cuatro informes parciales se escriben en `.tmp/story-code-review/{story_id}/`, y el Security-Reviewer descubre los checklists `docs/guardrails/gr-*security*` sin depender de los enlaces de `constitution.md`.`` | ✓ |
| CS-11 | ``**CS-8a** — `skills/story-code-review/evals/evals.json` incluye los casos de calibración `REVIEW.md` presente, `REVIEW.md` ausente y secreto falso en `examples/`.`` | 51 | STORY-180 | mención · story.md:88 ``- Cubre el criterio de salida de EPIC-28 **CS-8a** — `skills/story-code-review/evals/evals.json` incluye los casos de calibración `REVIEW.md` presente, `REVIEW.md` ausente y secreto falso en `examples/`.`` | ✓ |
| CS-12 | ``**CS-8b** — `skills/story-code-review/evals/evals.json` incluye el caso de calibración hallazgo preexistente.`` | 52 | STORY-181 | mención · story.md:73 ``- Cubre el criterio de salida de EPIC-28 **CS-8b** — `skills/story-code-review/evals/evals.json` incluye el caso de calibración hallazgo preexistente.`` | ✓ |
| CS-13 | ``**CS-8c** — `skills/story-code-review/evals/evals.json` incluye el caso de calibración tope de LOW.`` | 53 | STORY-185 | mención · story.md:80 ``- Cubre el criterio de salida de EPIC-28 **CS-8c** — `skills/story-code-review/evals/evals.json` incluye el caso de calibración tope de LOW. Nace de dividir la STORY-182 original (patrón 4, complejidad de criterios de aceptación).`` | ✓ |
| SMOKE-1 | `Revisión calibrada por REVIEW.md` | 57 | STORY-180 | mención · story.md:86 `- Cubre **CS-3** de EPIC-28, y el escenario **SMOKE-1** y **SMOKE-3**.` | ✓ |
| SMOKE-2 | `Un defecto preexistente no bloquea` | 65 | STORY-181 | mención · story.md:71 `- Cubre el escenario **SMOKE-2** de EPIC-28.` | ✓ |
| SMOKE-3 | `Proyecto consumidor sin REVIEW.md` | 73 | STORY-180 | mención · story.md:86 `- Cubre **CS-3** de EPIC-28, y el escenario **SMOKE-1** y **SMOKE-3**.` | ✓ |
| SMOKE-4 | `REVIEW.md semilla` | 81 | STORY-184 | mención · story.md:69 `- Cubre **CS-6** de EPIC-28 y el escenario **SMOKE-4**.` | ✓ |

## Hallazgos

Sin hallazgos.

## Notas del análisis

- ⚠️ Usando template seed del skill. Copia assets/epic-analyze-report-template.md a docs/templates/ para personalizarlo.
- Las etiquetas `CS-<n>` de la tabla de cobertura son posicionales del reporte (CS-1 … CS-13) y no coinciden con los IDs de la épica (`CS-1a` … `CS-8c`); el texto literal de cada fila incluye el ID de la épica.
