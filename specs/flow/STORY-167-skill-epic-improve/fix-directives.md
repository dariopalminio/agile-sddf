---
type: fix-directives
story: STORY-167
title: "Fix Directives: STORY-167"
date: 2026-10-30
max-severity: MEDIUM
round: 1
based-on: code-review-report.md
---

# Fix Directives: STORY-167

## Resumen de bloqueantes

- **Story:** STORY-167 — Skill epic-improve
- **Veredicto de origen:** `NEEDS-CHANGES`
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 2
- **Ronda:** 1

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---|---|---|---|---|
| 1 | `skills/epic-improve/evals/evals.json:16` | code-quality / requirements-coverage | MEDIUM | Las comprobaciones de texto no verifican los efectos en disco ni la revalidación. | Añadir verificación reproducible sobre copia aislada del backup y contenido previo, estado preservado, ausencia de cambios al rechazar o ante APPROVED y revalidación de la épica corregida. Mantener la ejecución de evals a criterio humano. |
| 2 | `skills/epic-improve/references/correction-rules.md:50` | integration-architecture | MEDIUM | La ubicación puede depender de una sección anterior ausente que no se insertará. | Resolver el ancla usando secciones presentes o correcciones aplicables, respetando el orden del template; cubrir el caso de secciones contiguas ausentes con predecesora pendiente de decisión. |

## Lista blanca de archivos permitidos para modificar

- `skills/epic-improve/evals/evals.json` — hallazgo #1.
- `skills/epic-improve/references/correction-rules.md` — hallazgo #2.

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Ejecutar `/story-implement STORY-167` o `/story-implement-tasks STORY-167`.
2. Limitar los cambios a la lista blanca.
3. Ejecutar de nuevo `/story-code-review STORY-167`.
4. Tras `APPROVED`, el informe de directivas se elimina y la historia queda en `CODE-REVIEW/DONE`.
