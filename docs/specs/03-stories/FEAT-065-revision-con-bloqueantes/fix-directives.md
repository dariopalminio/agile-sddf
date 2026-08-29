---
type: fix-directives
story: FEAT-065
title: "Fix Directives: FEAT-065"
review-status: needs-changes
date: 2026-05-09
max-severity: MEDIUM
based-on: code-review-report.md
---

# Fix Directives: FEAT-065

## Resumen de bloqueantes

- **Story:** FEAT-065 — Skill story-code-review: instrucciones de corrección cuando la revisión detecta bloqueantes
- **Review status:** needs-changes
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 1

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | docs/specs/stories/FEAT-065-revision-con-bloqueantes/story.md:39 | code-quality | MEDIUM | AC-1 especifica que story.md permanece en `status: IMPLEMENT / substatus: IN-PROGRESS` tras needs-changes, pero SKILL.md Paso 4g implementa `CODE-REVIEW/DONE`. El criterio de aceptación no se satisface según su definición literal. | Actualizar el Gherkin AC-1 de story.md línea 39 para reflejar `status: CODE-REVIEW / substatus: DONE`, alineándose con el ciclo de vida real implementado en SKILL.md. Revisar también tasks.md T2.4 que referencia `IMPLEMENT/IN-PROGRESS` en el mensaje de aviso. |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

- `docs/specs/stories/FEAT-065-revision-con-bloqueantes/story.md` (hallazgo #1)

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Aplica las correcciones indicadas en la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review FEAT-065`.
4. Si el resultado es `approved`, la historia avanza a READY-FOR-VERIFY.
