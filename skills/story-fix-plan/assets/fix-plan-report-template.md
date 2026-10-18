---
type: fix-plan-report
id: <STORY-NNN>
slug: <STORY-NNN>-fix-plan-report
title: "Fix plan: <título de la historia>"
story: <STORY-NNN>
analyze-updated: <YYYY-MM-DD>
analyze-verdict: <NEEDS-CHANGES | APPROVED>
mode: <estándar | advertencias>
analyze-status: "<estado general de analyze.md>"
plan-files: [design.md, <tasks.md>, <testcases.md>]
files-modified: [<archivos de plan-files que el plan modificó>]
findings-total: <N>
findings-applied: <N>
findings-resolved: <N>
findings-out-of-scope: <N>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
related:
  - <STORY-NNN>-<nombre>
---

# Fix plan: <título de la historia>

## Resumen

| Métrica | Valor |
|---|---|
| Estado previo (analyze.md) | verdict `<NEEDS-CHANGES | APPROVED>` · <estado general> |
| Modo | <estándar | corrige advertencias> |
| Archivos del plan | <design.md, tasks.md, testcases.md — los que existen> |
| Hallazgos extraídos | <N> (INC <n> · HAL <n> · REC <n> · DOD <n>) |
| Aplicados | <N> |
| Ya resueltos | <N> |
| Fuera de alcance | <N> |
| Archivos modificados | <archivos del plan que se modificaron> |

## Hallazgos

<!-- Una fila por hallazgo unificado. Clasificación: Aplicable | Ya resuelto | Fuera de alcance -->

| Origen | Severidad | Descripción breve | Clasificación | Cambios |
|---|---|---|---|---|
| <INC-001> | <ERROR> | <descripción> | <Aplicable — tasks.md / testcases.md / …> | <C-01> |

## Plan de cambios aplicado

<!-- Una subsección por cambio C-NN, en el orden en que se aplicaron. -->

### C-01 — <archivo> › <sección o ID>

- **Origen:** <INC-001 [ERROR]>
- **Operación:** <añadir | modificar | eliminar>
- **Antes:** <texto o resumen del contenido previo; «—» si es nuevo>
- **Después:** <texto o resumen del contenido nuevo; «—» si se eliminó>
- **Referencias actualizadas:** <IDs y ubicaciones ajustadas en ambos archivos, o «ninguna»>

## Alternativas descartadas

<!-- Solo si el reporte ofrecía más de una corrección. Si no, escribir: Ninguna. -->

| Origen | Alternativa descartada | Motivo |
|---|---|---|
| <INC-001> | <declarar T026 en design.md> | <la recomendación prefiere eliminarla> |

## Fuera de alcance

<!-- Hallazgos que exigen tocar otros archivos. Si no hay, escribir: Ninguno. -->

| Origen | Archivo afectado | Acción pendiente | Responsable sugerido |
|---|---|---|---|
| <INC-004> | <epic.md> | <acción> | <PO> |

## Siguiente paso

Ejecutar `/story-analyze <STORY-NNN>` para verificar la coherencia del plan corregido.
