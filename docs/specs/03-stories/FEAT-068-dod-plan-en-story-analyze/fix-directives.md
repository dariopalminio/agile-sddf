---
type: fix-directives
story: FEAT-068
title: "Fix Directives: FEAT-068"
review-status: needs-changes
date: 2026-05-14
max-severity: MEDIUM
based-on: code-review-report.md
---

# Fix Directives: FEAT-068

## Resumen de bloqueantes

- **Story:** FEAT-068 — DoD PLAN en story-analyze
- **Review status:** needs-changes
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 2

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---|---|---|---|---|
| 1 | `.claude/skills/story-analyze/SKILL.md:444-530` | Coherencia template fallback | MEDIUM | El Template de Fallback interno (al final del skill, usado cuando Paso 7 no localiza ningún template externo) no incluye: (a) la fila `Cumplimiento DoD — Fase PLAN` en la tabla Resumen Ejecutivo, ni (b) la sección `## Cumplimiento DoD — Fase PLAN`. Si el fallback se activa, la Correlación 5 ejecuta y calcula `$DOD_ERROR_COUNT` correctamente, pero el output omite toda referencia al DoD — AC-1 no se satisface en ese escenario. | Agregar al Resumen Ejecutivo del Template de Fallback la fila: `\| Cumplimiento DoD — Fase PLAN \| {dod_status} \| {dod_n}/{dod_total} criterios ✓ \|`. Agregar al final del Template de Fallback la sección `## Cumplimiento DoD — Fase PLAN` con comentario condicional y tabla `\| Criterio DoD \| Estado \| Severidad \| Evidencia \|` idéntica al template externo en `assets/analyze-report-template.md`. |
| 2 | `.claude/skills/story-analyze/SKILL.md:427-434` | Usabilidad interactiva | MEDIUM | El bloque `⛔` de Paso 10 (mostrado al usuario cuando hay ERROREs) no incluye una línea específica para DoD-ERRORs (TIPO E). El Paso 9a registra internamente `DoD PLAN: N criterios ❌ — transición bloqueada` pero esta información no se expone al usuario en el resumen interactivo del bloque `⛔`. El usuario ve el mensaje genérico de inconsistencias bloqueantes sin saber cuántos son de tipo DoD. | En el bloque `⛔` de Paso 10, después de la línea que muestra el conteo de ERROREs/WARNINGs, agregar: `DoD PLAN: <$DOD_ERROR_COUNT> criterios ❌ — revisar artefactos de planning`. Esta línea solo debe mostrarse cuando `$DOD_ERROR_COUNT > 0`. |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

- `.claude/skills/story-analyze/SKILL.md` — hallazgo #1 y #2 (hallazgos #1, #2)

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Aplica las correcciones indicadas en la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review FEAT-068`.
4. Si el resultado es `approved`, la historia avanza a READY-FOR-VERIFY.
