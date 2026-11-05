---
type: fix-directives
story: STORY-151
title: "Fix Directives: STORY-151"
date: 2026-10-23
max-severity: MEDIUM
round: 2
based-on: code-review-report.md
---

# Fix Directives: STORY-151

## Resumen de bloqueantes

- **Story:** STORY-151 — Migrar los skills de épica a specs/flow
- **Veredicto de origen:** `NEEDS-CHANGES` (`code-review-report.md`)
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 1
- **Ronda:** 2

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | docs/guardrails/dod-story-code-review.md:22 | DoD-CODE-REVIEW | MEDIUM | Sin tareas pendientes en `tasks.md` (si existe el archivo). T022 sigue en `[~]` (`tasks.md:56`). `npm test` ya pasa (290/290), pero `npm run verify:repository` sigue en exit 1 por 71 errores del gate de layout fijo, todos en `skills/memory-system/SKILL.md` y `skills/skill-preflight/SKILL.md` (migración de STORY-152 en curso) y ninguno en `skills/epic-*`. | Cerrar T022 por una de dos vías. (a) Cuando STORY-152 termine la migración de `memory-system` y `skill-preflight`, reejecutar `npm run verify:repository` hasta exit 0 y marcar T022 `[x]`. (b) Registrar en `tasks.md` (T022) e `implement-report.md` («Tareas Bloqueadas») la dispensa explícita del responsable, con fecha y alcance (errores del gate ajenos a la historia), y marcar T022 según esa decisión. No modificar los skills `epic-*`: los cuatro revisores los aprobaron. Opcional (LOW): anotar en T023 la excepción aprobada sobre `test/epic-template.test.js` y los `expected.md` de `memory-system`. |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

- docs/guardrails/dod-story-code-review.md (hallazgo #1; referencia del criterio, no se edita)
- docs/specs/stories/STORY-151-migrar-los-skills-de-epica-a-specs-flow/tasks.md (hallazgo #1; T022 y nota opcional en T023)
- docs/specs/stories/STORY-151-migrar-los-skills-de-epica-a-specs-flow/implement-report.md (hallazgo #1; registro de la decisión)

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Ejecuta `/story-implement STORY-151` (o `/story-implement-tasks STORY-151` si la historia tiene `tasks.md`) para aplicar las correcciones de la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review STORY-151`.
4. Si el veredicto es `APPROVED`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`.
