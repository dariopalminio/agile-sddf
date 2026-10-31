---
type: fix-directives
story: STORY-174
title: "Fix Directives: STORY-174"
date: 2026-10-30
max-severity: MEDIUM
round: 1
based-on: code-review-report.md
---

# Fix Directives: STORY-174

## Resumen de bloqueantes

- **Story:** STORY-174 — Skill epic-refine: corregir referencias obsoletas tras un split
- **Veredicto de origen:** `NEEDS-CHANGES` (`code-review-report.md`)
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 3 (1 de agente, 2 DoD)
- **Ronda:** 1

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | skills/epic-refine/evals/evals.json:225 | code-quality | MEDIUM | El oráculo de TC-014 (happy path de AC-1) no verifica los efectos persistidos: todos sus `contains` ya aparecen en la consola (plan, `Recibirán .bak:`, `Archivos modificados:`), así que el caso pasaría sin escribir `epic.md`, el `story.md` de STORY-302 ni ningún `.bak`, y no comprueba en el archivo que el `related` de STORY-302 cite `STORY-301-exportar-informe-csv`. No sigue la convención de marcadores `<ruta> ===` de los bloques FILE de TC-001 y TC-022. | En el `context` de TC-014 pedir los bloques FILE con ruta relativa a specs/flow/ del fixture, incluidos los `.bak`. En `contains` usar `EPIC-30-ejemplo/epic.md.bak ===`, `EPIC-30-ejemplo/epic.md ===`, `STORY-302-programar-envio-informe/story.md.bak ===`, `STORY-302-programar-envio-informe/story.md ===` y la entrada reemplazada `  - STORY-301-exportar-informe-csv`. En TC-015 y TC-016 añadir a `not_contains` `STORY-302-programar-envio-informe/story.md ===` y `EPIC-30-ejemplo/epic.md ===`. |
| 2 | docs/guardrails/dod-story-code-review.md:21 | DoD-CODE-REVIEW | MEDIUM | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | Se cumple al resolver el hallazgo #1. |
| 3 | docs/guardrails/dod-story-code-review.md:25 | DoD-CODE-REVIEW | MEDIUM | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | Se cumple al resolver el hallazgo #1 y obtener `APPROVED` al volver a ejecutar `/story-code-review STORY-174`. |

Opcional, en la misma pasada (LOW, no bloqueantes; ver `code-review-report.md`): reforzar las aserciones de TC-015, TC-016 y TC-018 (`evals.json:241`, `:257`, `:290`) y acotar los `not_contains` frágiles (`"COH"` en TC-018, `"MAD-02"` en TC-014).

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

- `skills/epic-refine/evals/evals.json` — hallazgo #1

Los hallazgos #2 y #3 apuntan a `docs/guardrails/dod-story-code-review.md` como fuente del criterio; ese archivo **no** se modifica.

No deben modificarse archivos fuera de esta lista sin previa aprobación.

> ⚠️ Otra sesión trabaja en paralelo en STORY-173 y tiene cambios sin commit en `skills/epic-refine/evals/evals.json`. Edita solo los casos TC-014…TC-016 y no reviertas ni reformatees el resto del archivo.

## Ciclo de corrección

1. Ejecuta `/story-implement STORY-174` (o `/story-implement-tasks STORY-174` si la historia tiene `tasks.md`) para aplicar las correcciones de la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review STORY-174`.
4. Si el veredicto es `APPROVED`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`.
