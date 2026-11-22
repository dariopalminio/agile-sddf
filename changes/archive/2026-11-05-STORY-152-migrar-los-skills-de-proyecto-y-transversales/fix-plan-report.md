---
type: fix-plan-report
id: STORY-152
slug: STORY-152-fix-plan-report
title: "Fix plan: Migrar los skills de proyecto y transversales"
story: STORY-152
analyze-updated: 2026-10-22
analyze-verdict: APPROVED
mode: advertencias
analyze-status: "sin ERROR; WARNING de tipo D, E"
plan-files: [design.md, tasks.md]
files-modified: [design.md, tasks.md]
findings-total: 3
findings-applied: 2
findings-resolved: 1
findings-out-of-scope: 0
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-152-migrar-los-skills-de-proyecto-y-transversales
---

# Fix plan: Migrar los skills de proyecto y transversales

## Resumen

| Métrica | Valor |
|---|---|
| Estado previo (analyze.md) | verdict `APPROVED` · sin ERROR; WARNING de tipo D, E |
| Modo | corrige advertencias |
| Archivos del plan | design.md, tasks.md (testcases.md no existe) |
| Hallazgos extraídos | 3 (INC 2 · HAL 0 · REC 1 · DOD 0; la fila DoD ⚠️ de atomicidad se adjuntó a INC-002) |
| Aplicados | 2 |
| Ya resueltos | 1 |
| Fuera de alcance | 0 |
| Archivos modificados | design.md, tasks.md |

## Hallazgos

| Origen | Severidad | Descripción breve | Clasificación | Cambios |
|---|---|---|---|---|
| INC-001 | WARNING | La Verificación 2 de `skill-preflight` sugiere `/sddf-init` también en un repo legado, donde no tiene efecto (CS-13) | Aplicable — design.md, tasks.md | C-01, C-02, C-03, C-04 |
| INC-002 (+ DOD atomicidad) | WARNING | T026 no es atómica: mezcla sustitución de rutas con comportamiento documentado del motor | Aplicable — tasks.md | C-05, C-06 |
| REC-3 | WARNING | Confirmar las precondiciones de CR-001 antes de implementar | Ya resuelto: T001 ya las comprueba | — |

## Plan de cambios aplicado

### C-01 — design.md › D-9 › fila «Verificación 2 — Layout fijo (AC-3)»

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** `[WARNING] <ruta> no encontrado — ejecuta /sddf-init` siempre
- **Después:** `[WARNING] <ruta> no encontrado`, con el sufijo `— ejecuta /sddf-init` solo si la Verificación 3 no detecta señales legadas; con alguna de L1–L3, la remisión la da la línea `ℹ️ Guía de migración`
- **Referencias actualizadas:** C-04 (T029)

### C-02 — design.md › D-12 › tabla de evals de `skill-preflight` › TC-007

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** `contains` con las tres señales y la guía; sin escrituras
- **Después:** se añade `not_contains`: `ejecuta /sddf-init`
- **Referencias actualizadas:** T032 implementa la tabla de D-12 sin necesidad de cambios

### C-03 — design.md › Flujos clave › F-2, paso 1

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** «Verificación 2: avisa por cada ruta fija ausente.»
- **Después:** «Verificación 2: avisa por cada ruta fija ausente, sin sugerir `/sddf-init`.»
- **Referencias actualizadas:** ninguna

### C-04 — tasks.md › T029

- **Origen:** INC-001 [WARNING]
- **Operación:** modificar
- **Antes:** «Verificación 2 (cinco rutas fijas con `[OK]`/`[WARNING] … — ejecuta /sddf-init`)»
- **Después:** «Verificación 2 (… `[WARNING] <ruta> no encontrado`, con el sufijo `— ejecuta /sddf-init` solo cuando la Verificación 3 no detecta ninguna señal legada)»
- **Referencias actualizadas:** espejo de C-01

### C-05 — tasks.md › T026

- **Origen:** INC-002 [WARNING]
- **Operación:** modificar
- **Antes:** T026 cubría el Paso 0, `--root docs`, la sustitución de `$SPECS_BASE`, el catálogo de diez capas, el origen flow, los migradores legados y la l. 327 (R4)
- **Después:** T026 se limita al Paso 0 y la línea `CLI_ROOT`, las invocaciones `--root docs`, la sustitución de `$SPECS_BASE`/`<SPECS_BASE>` y el input `REPO_ROOT` de `ensure --fix-frontmatter`; trazas D-1, D-3, D-7
- **Referencias actualizadas:** el resto pasa a T041 (C-06)

### C-06 — tasks.md › grupo «5. `memory-system`» › T041 (nueva, después de T026)

- **Origen:** INC-002 [WARNING]
- **Operación:** añadir
- **Antes:** —
- **Después:** T041 documenta en `memory-system/SKILL.md` el catálogo de diez capas, el origen flow, los migradores legados como layout legado y la reformulación de la l. 327 (R4); depende de T026; trazas D-4, D-5, D-6
- **Referencias actualizadas:** T041 es el siguiente ID libre; ninguna otra tarea citaba T026, así que no hay más dependencias que ajustar

## Alternativas descartadas

| Origen | Alternativa descartada | Motivo |
|---|---|---|
| INC-001 | Sufijo `— ver la guía de migración` en cada ruta ausente | Repite cinco veces la remisión que ya da la línea `ℹ️ Guía de migración`; sin sufijo es el cambio mínimo |
| INC-002 | Dividir también T016 (`sddf-constitution`) | La recomendación la marca como opcional: es una sustitución mecánica en un solo archivo |

## Fuera de alcance

Ninguno.

## Siguiente paso

Ejecutar `/story-analyze STORY-152` para verificar la coherencia del plan corregido.
