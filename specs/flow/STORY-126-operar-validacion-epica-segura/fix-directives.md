---
type: fix-directives
story: STORY-126
title: "Fix Directives: STORY-126"
date: 2026-10-31
max-severity: HIGH
round: 1
based-on: code-review-report.md
---

# Fix Directives: STORY-126

## Resumen de bloqueantes

- **Story:** STORY-126 — Operar la validación de épicas de manera segura
- **Veredicto de origen:** `NEEDS-CHANGES` (`code-review-report.md`)
- **Severidad máxima:** HIGH
- **Total de hallazgos bloqueantes:** 5
- **Ronda:** 1

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | skills/epic-validate/SKILL.md:349 | code-quality | HIGH | El gateway escribe el frontmatter de `epic.md`, aunque STORY-126 declara que la única escritura es `epic-validate-report.md`. | Alinear la responsabilidad con STORY-127: retirar el gateway del contrato de STORY-126 o actualizar la especificación y sus contratos de forma trazable, sin mezclar ambas responsabilidades. |
| 2 | skills/epic-validate/evals/evals.json:1109,1206 | requirements-coverage | MEDIUM | TC-014 y TC-015 no cubren el estado `VALIDATE` ni observan la política real de escrituras. | Añadir fixtures en `VALIDATE` para `auto` y `manual`, con aserciones exactas de los archivos y campos que puedan modificarse según el contrato acordado. |
| 3 | skills/epic-validate/evals/evals.json:1429-1541 | requirements-coverage | MEDIUM | TC-018 no compara los reportes equivalentes completos tras normalizar únicamente los campos volátiles y no repite desde `VALIDATE`. | Comparar ambas salidas normalizando solo `updated`, fecha de evaluación y duraciones; incorporar la repetición desde `VALIDATE` y sus efectos acordados. |
| 4 | docs/guardrails/dod-story-code-review.md:21 | DoD-CODE-REVIEW | HIGH | Hay hallazgos bloqueantes HIGH o MEDIUM en esta revisión. | Resolver los hallazgos 1–3 y repetir `/story-code-review STORY-126`; no modificar el guardrail. |
| 5 | docs/guardrails/dod-story-code-review.md:25 | DoD-CODE-REVIEW | HIGH | El reporte actual tiene `verdict: NEEDS-CHANGES`. | Obtener un nuevo `code-review-report.md` con `verdict: APPROVED` después de resolver los hallazgos funcionales. |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

- `skills/epic-validate/SKILL.md` — hallazgo #1
- `skills/epic-validate/evals/evals.json` — hallazgos #2 y #3
- `docs/guardrails/dod-story-code-review.md` — hallazgos #4 y #5; referencia del criterio, no se requiere cambiar el guardrail para cumplirlo

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Ejecuta `/story-implement STORY-126` (o `/story-implement-tasks STORY-126` si la historia tiene `tasks.md`) para aplicar las correcciones de la tabla.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review STORY-126`.
4. Si el veredicto es `APPROVED`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`.
