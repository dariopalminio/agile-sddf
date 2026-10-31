---
type: fix-directives
story: STORY-173
title: "Fix Directives: STORY-173"
date: 2026-10-30
max-severity: MEDIUM
round: 1
based-on: code-review-report.md
---

# Fix Directives: STORY-173

## Resumen de bloqueantes

- **Story:** STORY-173 — Skill epic-refine: asignar la cobertura de criterios de salida
- **Veredicto de origen:** `NEEDS-CHANGES` (`code-review-report.md`)
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 3
- **Ronda:** 1

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | skills/epic-refine/evals/evals.json:209 | code-quality | MEDIUM | TC-013 exige `"status: IMPLEMENT"` en `expected.contains` con `threshold: 1.0`, pero en modo dry-run (sin `sandbox`) `scripts/run-evals.js` solo califica la consola y los bloques FILE de archivos escritos; el skill no escribe ningún `story.md` en este caso ni emite ese status literal, así que el caso falla aunque el comportamiento sea correcto. | Quitar `"status: IMPLEMENT"` de `contains`. Para seguir verificando que STORY-303 queda intacta, añadir a `not_contains` `"STORY-303-totalizar-comisiones/story.md ==="` (patrón de TC-001) o convertir el caso a `sandbox` con `expected.files`. Ajustar la `description` de TC-013 si deja de afirmar algo no verificado. |
| 2 | docs/guardrails/dod-story-code-review.md:21 | DoD-CODE-REVIEW | MEDIUM | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | Se resuelve al corregir el hallazgo #1; no requiere editar el DoD. |
| 3 | docs/guardrails/dod-story-code-review.md:25 | DoD-CODE-REVIEW | MEDIUM | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | Re-ejecutar `/story-code-review STORY-173` tras corregir el hallazgo #1; no requiere editar el DoD. |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

- `skills/epic-refine/evals/evals.json` — hallazgo #1

Los hallazgos #2 y #3 (DoD) apuntan a `docs/guardrails/dod-story-code-review.md` solo como referencia del criterio: se cumplen al resolver el #1 y ese archivo **no** debe modificarse.

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Ejecuta `/story-implement STORY-173` (o `/story-implement-tasks STORY-173` si la historia tiene `tasks.md`) para aplicar las correcciones de la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review STORY-173`.
4. Si el veredicto es `APPROVED`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`.
