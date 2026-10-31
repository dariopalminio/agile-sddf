---
type: fix-directives
story: STORY-170
title: "Fix Directives: STORY-170"
date: 2026-10-30
max-severity: MEDIUM
round: 1
based-on: code-review-report.md
---

# Fix Directives: STORY-170

## Resumen de bloqueantes

- **Story:** STORY-170 — Skill epic-ship
- **Veredicto de origen:** `NEEDS-CHANGES` (`code-review-report.md`)
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 8
- **Ronda:** 1

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | skills/epic-ship/references/release-content.md:73 | code-quality | MEDIUM | La reejecución puede reemplazar un bloque de `CHANGELOG.md` ya ubicado en una versión publicada. | Comprobar que el bloque existente está en `[Unreleased]` antes de reemplazarlo; si está en una versión publicada, detenerse sin escritura. Cubrir la reejecución con un caso de evaluación. |
| 2 | skills/epic-ship/evals/evals.json:71 | requirements-coverage | MEDIUM | TC-001/SMOKE-7 comprueba cadenas en la salida, pero no observa si hubo commit, tag, merge, push, publicación o despliegue. | Añadir una comprobación observable de efectos prohibidos; la ausencia de cadenas en la salida no prueba la ausencia de operaciones. |
| 3 | specs/flow/STORY-170-skill-epic-ship/implement-report.md:74 | requirements-coverage | MEDIUM | El recorrido manual SMOKE-7 sigue pendiente y no hay evidencia de ejecución ni de encoding. | Cuando un humano ejecute SMOKE-7, registrar fecha, fixture, comprobaciones y resultado; mantenerlo pendiente hasta entonces. |
| 4 | skills/epic-ship/SKILL.md:99 | integration-architecture | MEDIUM | El gate permite `DEVELOP` con `APPROVED`, mientras el gateway canónico exige `VALIDATE/DONE` para pasar a `SHIP`. | Alinear el gate del skill con `VALIDATE/DONE` y actualizar D-7, o actualizar explícitamente el gateway canónico con la excepción justificada. |
| 5 | specs/flow/STORY-170-skill-epic-ship/design.md:249 | integration-architecture | MEDIUM | D-7 conserva la premisa obsoleta de que `epic-validate` no escribe estado, aunque las notas reconocen `VALIDATE/DONE`. | Actualizar D-7 y sus notas para exigir `VALIDATE/DONE`, o propagar una excepción aprobada en arquitectura y guías. |
| 6 | skills/epic-ship/assets/release-notes-template.md:6 | security | MEDIUM | El título de la épica se inserta sin escape dentro de un escalar YAML entre comillas y puede inyectar claves en el frontmatter generado. | Serializar el título como escalar YAML seguro o escapar comillas, barras inversas y saltos de línea antes de sustituir `{title}`; cubrir un título adversarial. |
| 7 | docs/guardrails/dod-story-code-review.md:21 | DoD-CODE-REVIEW | MEDIUM | Hay hallazgos bloqueantes `MEDIUM` en los cuatro informes parciales. | Resolver los hallazgos 1–6 y repetir `/story-code-review STORY-170`. |
| 8 | docs/guardrails/dod-story-code-review.md:25 | DoD-CODE-REVIEW | MEDIUM | El reporte de revisión tiene `verdict: NEEDS-CHANGES`, por lo que aún no cumple el criterio de aprobación. | Resolver los hallazgos 1–6 y obtener un nuevo `code-review-report.md` con `verdict: APPROVED`. |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

- `skills/epic-ship/references/release-content.md` — hallazgo #1
- `skills/epic-ship/evals/evals.json` — hallazgo #2
- `specs/flow/STORY-170-skill-epic-ship/implement-report.md` — hallazgo #3; registrar evidencia solo cuando exista ejecución humana
- `skills/epic-ship/SKILL.md` — hallazgo #4
- `specs/flow/STORY-170-skill-epic-ship/design.md` — hallazgo #5
- `skills/epic-ship/assets/release-notes-template.md` — hallazgo #6
- `docs/guardrails/dod-story-code-review.md` — hallazgos #7, #8; referencia del criterio, no se requiere cambiar el guardrail para cumplirlo

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Ejecuta `/story-implement STORY-170` (o `/story-implement-tasks STORY-170` si la historia tiene `tasks.md`) para aplicar las correcciones de la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review STORY-170`.
4. Si el veredicto es `APPROVED`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`.
