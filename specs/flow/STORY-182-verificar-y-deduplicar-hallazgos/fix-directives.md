---
type: fix-directives
story: STORY-182
title: "Fix Directives: STORY-182"
date: 2026-11-10
max-severity: MEDIUM
round: 1
based-on: code-review-report.md
---

# Fix Directives: STORY-182

## Resumen de bloqueantes

- **Story:** STORY-182 — Verificación y deduplicación de hallazgos del árbitro
- **Veredicto de origen:** `NEEDS-CHANGES` (`code-review-report.md`)
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 1 (reportado por 2 revisores) + 3 criterios DoD que se derivan de él
- **Ronda:** 1

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | skills/story-code-review/SKILL.md:696 | code-quality, integration-architecture | MEDIUM | El Paso 5b da dos instrucciones contradictorias para `{{SECURITY_FINDINGS}}`. La línea 693 dice que los cuatro placeholders reciben solo las filas consolidadas de `$FINDINGS`, con prefijo de estado y fusión. La línea 696, que no se actualizó, sigue mandando insertar la tabla cruda de la sección «Hallazgos» de `security-report.md` (contradice I-9 de design.md). Fallo: con TC-036, la fila del representante Security sale sin `Reportado por:` y AC-2 no se cumple; con TC-034, el `HIGH` `no verificado` de seguridad sale sin su prefijo. Reportado por: Tech-Lead-Reviewer, Integration-Reviewer | Reescribir la línea 696 para que `{{SECURITY_FINDINGS}}` reciba las filas consolidadas de `$FINDINGS` de la dimensión `security` (Pasos 4a.3 y 4a.4, con prefijo de estado, fusionados, exclusiones de 4a.1 y PREEXISTENTE, según 693-695), precedidas por la línea `**Fuentes de checklist:** <checklist-sources> (<rules-evaluated> reglas evaluadas)`. Si conviene, añadir a `test/story-code-review-evidence-dedup.test.js` una aserción que impida volver a la tabla cruda |
| 2 | docs/guardrails/dod-story-code-review.md:20 | DoD-CODE-REVIEW | MEDIUM | Los componentes respetan la arquitectura de `design.md` | Se resuelve con #1 (contrato I-9) |
| 3 | docs/guardrails/dod-story-code-review.md:21 | DoD-CODE-REVIEW | MEDIUM | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | Se resuelve con #1 |
| 4 | docs/guardrails/dod-story-code-review.md:25 | DoD-CODE-REVIEW | MEDIUM | Revisión de código aprobada (`verdict: APPROVED`) | Se resuelve con #1 y una nueva ejecución de `/story-code-review STORY-182` |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

- `skills/story-code-review/SKILL.md` (hallazgo #1)
- `test/story-code-review-evidence-dedup.test.js` (hallazgo #1, aserción opcional)

`docs/guardrails/dod-story-code-review.md` (hallazgos #2-#4) no se modifica: esos criterios se cumplen al corregir #1.

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Ejecuta `/story-implement STORY-182` (o `/story-implement-tasks STORY-182` si la historia tiene `tasks.md`) para aplicar las correcciones de la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review STORY-182`.
4. Si el veredicto es `APPROVED`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`.
