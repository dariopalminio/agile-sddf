---
type: code-review-report
story: STORY-167
title: "Code Review Report: Skill epic-improve"
verdict: NEEDS-CHANGES
date: 2026-10-30
max-severity: MEDIUM
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-167

## Veredicto

**Veredicto:** `NEEDS-CHANGES` — 2 hallazgos bloqueantes únicos (severidad máxima: MEDIUM).

La inserción de secciones carece de una estrategia para un ancla ausente y los evals no comprueban los efectos persistentes de los escenarios esenciales. Los hallazgos coincidentes de calidad y requisitos se consolidan como uno.

## Resumen

| Campo | Valor |
|---|---|
| Historia | STORY-167 — Skill epic-improve |
| Severidad máxima detectada | MEDIUM |
| Revisores | Tech-Lead, Product-Owner, Integration y Security |
| testcases.md | No encontrado; cobertura canónica omitida |
| Fecha | 2026-10-30 |

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Hallazgo | Recomendación |
|---|---|---|---|
| MEDIUM | `skills/epic-improve/evals/evals.json:16` | Las aserciones comprueban texto, no el backup, la cancelación ni los límites de escritura. `scripts/run-evals.js:648` evalúa la respuesta textual. | Verificar los efectos sobre archivos, el backup y los estados anterior y posterior. |

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Hallazgo | Recomendación |
|---|---|---|---|
| MEDIUM | `skills/epic-improve/evals/evals.json:13` | TC-001 a TC-004 no comprueban los efectos en disco ni la revalidación de AC-1. El smoke integral está pendiente. Es el mismo hallazgo de calidad de pruebas, no un bloqueante adicional. | Comprobar los archivos y la revalidación sobre una copia aislada. |

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Hallazgo | Recomendación |
|---|---|---|---|
| MEDIUM | `skills/epic-improve/references/correction-rules.md:50` | La ubicación que entrega el validador usa el título anterior del template, que también puede faltar. Si Historias falta y requiere decisión del PO, una sección Criterios de salida inferible no tiene el ancla exigida. | Resolver la posición usando secciones presentes o inserciones planificadas, conservando el orden, y cubrir el caso de secciones contiguas ausentes. |

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** `docs/guardrails/gr-ai-security-checklist.md`, `docs/guardrails/gr-code-security-checklist.md`, `.agents/skills/security-audit/assets/security-checklist.md`, `.claude/skills/security-audit/assets/security-checklist.md` (55 reglas evaluadas, duplicadas contadas una vez).

| Severidad | Archivo:Línea | Hallazgo | Recomendación |
|---|---|---|---|
| — | — | Sin hallazgos de seguridad en el análisis estático. | La prueba dinámica de instrucciones incrustadas sigue pendiente. |

### Nota de Tamaño de Cambio

La implementación comprende más de 12 archivos entre skill, fixtures e integración. El tamaño es informativo y no cambia el veredicto.

### Cobertura de Casos de Prueba (testcases.md)

`testcases.md` no encontrado; análisis de cobertura canónica omitido. Los evals y el smoke se encuentran pendientes de ejecución humana según `implement-report.md`.

## Siguiente acción

Aplicar `fix-directives.md` con `/story-implement STORY-167` o `/story-implement-tasks STORY-167`, y repetir la revisión. Los evals se ejecutan a criterio humano.

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|---|---|---|---|
| 1 | Se cumple DoD IMPLEMENT | ⚠️ | — | Pruebas y CI requieren ejecución; además hay brechas de cobertura y de integración descritas arriba. |
| 2 | Estándares de constitution.md | ✓ | — | Revisión estática de convenciones y seguridad. |
| 3 | Correspondencia de escenarios Gherkin | ⚠️ | — | Existen instrucciones para los escenarios; sus efectos persistentes no se verifican en los evals. |
| 4 | Componentes respetan design.md | ❌ | MEDIUM | Ancla inexistente en inserción de secciones; mismo hallazgo de integración. |
| 5 | Sin hallazgos HIGH o MEDIUM | ❌ | MEDIUM | Dos hallazgos únicos ya registrados; no se contabilizan otra vez. |
| 6 | Sin tareas pendientes | ✓ | — | `tasks.md`: 30 tareas completadas según reporte. |
| 7 | Frontmatter completo y estado actualizado | ✓ | — | Historia identificada y devuelta a `READY-FOR-IMPLEMENT/DONE`. |
| 8 | Reporte creado o actualizado | ✓ | — | Este archivo. |
| 9 | Revisión aprobada | ❌ | MEDIUM | El veredicto es NEEDS-CHANGES por los dos hallazgos existentes; no es un hallazgo adicional. |

**Resumen:** 4/9 criterios ✓; 2 con evidencia insuficiente y 3 incumplidos como consecuencia de los hallazgos anteriores.
