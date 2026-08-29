---
type: fix-directives
story: FEAT-067
title: "Fix Directives: FEAT-067"
review-status: needs-changes
date: 2026-05-09
max-severity: MEDIUM
based-on: code-review-report.md
---

# Fix Directives: FEAT-067

## Resumen de bloqueantes

- **Story:** FEAT-067 — skill story-implement: continuar implementación parcial con tareas pendientes y fix-directives
- **Review status:** needs-changes
- **Severidad máxima:** MEDIUM
- **Total de hallazgos bloqueantes:** 2

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | `.claude/skills/story-implement/SKILL.md:325-329` | Calidad de Código | MEDIUM | La detección de tarea especial usa comparación de cadena exacta (`descripción_tarea.trim().toLowerCase() == "implementar fix-directives.md"`). Si la tarea en `tasks.md` tiene cualquier variación de redacción (sin extensión, con acento, etc.) el sub-flujo nunca se activa, produciendo falla silenciosa donde la tarea se ejecuta como TDD estándar. | Agregar después de la comparación exacta una nota explícita: "El literal exacto esperado es 'Implementar fix-directives.md' tal como lo genera story-code-review Paso 4g.1. Si el nombre difiere, la tarea se tratará como TDD estándar (degradación controlada, no falla fatal)." Alternativamente, cambiar a detección por subcadena `includes("fix-directives")` para mayor robustez. En cualquier caso, la decisión debe quedar explícitamente documentada en el Paso 3c. |
| 2 | `docs/specs/stories/FEAT-067-story-implement-continuar-parcial/story.md:89-91` | Calidad de Código | MEDIUM | Contradicción entre la nota final de `story.md` ("El skill no debe exigir que el estado sea exactamente `IMPLEMENT/IN-PROGRESS` — la condición de reanudación es la existencia de al menos una tarea `[x]`, no el estado del frontmatter") y el Paso 1d implementado que sí exige uno de dos estados específicos. Un usuario que siga la nota esperaría que cualquier historia con `[x]` tasks sea aceptada, pero el skill la rechazará si el estado no es `READY-FOR-IMPLEMENT/DONE` o `IMPLEMENT/IN-PROGRESS`. | Reconciliar los dos documentos eligiendo UNA de estas opciones: (A) Eliminar/actualizar la nota contradictoria de `story.md` para reflejar la decisión de diseño D-1 (restricción a dos estados explícitos, con justificación de seguridad); (B) Actualizar SKILL.md Paso 1d para aceptar cualquier estado cuando `N_completadas > 0` sea detectado en Paso 2c (alinear con la nota original). La opción A es preferible porque D-1 documenta explícitamente por qué la restricción es correcta. |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:

- `.claude/skills/story-implement/SKILL.md` — hallazgos #1, #2
- `docs/specs/stories/FEAT-067-story-implement-continuar-parcial/story.md` — hallazgo #2

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Aplica las correcciones indicadas en la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review FEAT-067`.
4. Si el resultado es `approved`, la historia avanza a READY-FOR-VERIFY.
