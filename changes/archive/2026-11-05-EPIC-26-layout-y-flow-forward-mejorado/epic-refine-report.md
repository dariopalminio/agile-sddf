---
type: epic-refine-report
id: EPIC-26
slug: EPIC-26-layout-y-flow-forward-mejorado-refine-report
title: "Epic refine: Layout y flow-forward mejorado"
epic: EPIC-26
analyze-updated: 2026-10-22
analyze-verdict: NEEDS-REFINEMENT
analyze-errors: 9
analyze-warnings: 0
files-modified: [epic.md, STORY-147/story.md, STORY-148/story.md, STORY-149/story.md, STORY-150/story.md, STORY-151/story.md, STORY-153/story.md, STORY-155/story.md, STORY-157/story.md]
findings-total: 9
findings-applied: 9
findings-resolved: 0
findings-out-of-scope: 0
coherence-changes: 7
created: 2026-10-22
updated: 2026-10-22
related:
  - EPIC-26-layout-y-flow-forward-mejorado
---
<!-- Referencias -->
[[EPIC-26-layout-y-flow-forward-mejorado]]

# Epic refine: Layout y flow-forward mejorado

## Resumen

| Métrica | Valor |
|---|---|
| Estado previo (epic-analyze-report.md) | verdict `NEEDS-REFINEMENT` · ERROR 9 · WARNING 0 · 2026-10-22 |
| Modo | manual (refinamiento previo al skill `epic-refine`, que formaliza este proceso) |
| Hallazgos extraídos | 9 (INT 4 · SAL 5 · MAD 0) |
| Aplicados | 9 |
| Ya resueltos | 0 |
| Fuera de alcance | 0 |
| Cambios de coherencia derivada | 7 |
| Archivos modificados | `epic.md` y 8 `story.md` (STORY-147, 148, 149, 150, 151, 153, 155, 157) |
| Backups | No se generaron `.bak`; el estado previo está en el índice de git |
| Verificación | `/epic-analyze EPIC-26` → `APPROVED`, 0 ERROR, 0 WARNING, contrato de salida 20/20 |

## Hallazgos

| Origen | Severidad | Código | Elemento | Diagnóstico | Clasificación | Corrección | Cambios |
|---|---|---|---|---|---|---|---|
| H-001 | ERROR | INT-02 | STORY-155 | Nacida del split de STORY-150; nunca se añadió al índice | Aplicable — epic.md | Añadir línea F2 | C-01 |
| H-002 | ERROR | INT-02 | STORY-156 | Nacida del split de STORY-150 y redividida (STORY-158) | Aplicable — epic.md | Añadir línea F2 | C-01 |
| H-003 | ERROR | INT-02 | STORY-157 | Nacida del split de STORY-153 | Aplicable — epic.md | Añadir línea F2 | C-01 |
| H-004 | ERROR | INT-02 | STORY-158 | Nacida del split de STORY-156 | Aplicable — epic.md | Añadir línea F2 | C-01 |
| H-005 | ERROR | SAL-01 | CS-1 | STORY-147 lo verifica completo entre AC-1 y AC-2, pero solo lo citaba por etiqueta | Aplicable — STORY-147 | Dueño único: cita E1 | C-03 |
| H-006 | ERROR | SAL-01 | CS-2 | Criterio global repartido entre historias de migración, sin historia que verifique el grep sobre `skills/`; además `skills/sddf-init/` (5 archivos) no estaba en el alcance de ninguna historia | Aplicable — STORY-149, STORY-157 | Hueco real (AC-4 en STORY-149) + criterio global (AC-3 de cierre en STORY-157) | C-04, C-05 |
| H-007 | ERROR | SAL-01 | CS-3 | Compuesto: STORY-149 cubre `sddf-init`; nadie verificaba que ningún skill lee `root` | Aplicable — STORY-157 | Criterio global: AC-3 de cierre + cita E1 | C-05 |
| H-008 | ERROR | SAL-01 | CS-11 | Solo lo afirmaban CNF de STORY-153 y STORY-157; STORY-153 es dueña del único script de movimiento | Aplicable — STORY-153 | Dueño único: cita E1 | C-06 |
| H-009 | ERROR | SAL-01 | CS-12 | Cinco historias afirman partes del gate; ninguna `npm test` + `verify:repository` al cierre | Aplicable — STORY-157 | Criterio global: AC-3 de cierre + cita E1 | C-05 |

## Plan de cambios aplicado

### C-01 — epic.md › Historias

- **Origen:** H-001, H-002, H-003, H-004 [ERROR] INT-02
- **Operación:** añadir
- **Antes:** —
- **Después:** líneas F2 de STORY-155, STORY-156, STORY-157 y STORY-158, en orden de ID, con el `title` y el alcance de cada historia.

### C-02 — epic.md › Historias (líneas de STORY-149, STORY-150, STORY-151 y STORY-153)

- **Origen:** COH-1, COH-2 y H-006
- **Operación:** modificar
- **Antes:** STORY-150 «Migrar los skills de historia» (todos los `story-*`); STORY-153 «Migración única de work items… y corrige los enlaces rotos»; STORY-149 sin mención de `SPECS_BASE`; STORY-151 sin `epic-refine`.
- **Después:** STORY-150 limitada a los skills de especificación; STORY-153 con su título vigente y sin la reparación de enlaces (pasó a STORY-157); STORY-149 incluye retirar `SPECS_BASE`/`SDDF_ROOT` de su skill; STORY-151 incluye `epic-refine`.

### C-03 — STORY-147 › Notas

- **Origen:** H-005 [ERROR] SAL-01
- **Operación:** modificar
- **Antes:** `Cubre CS-1 de la épica. Debe completarse antes…`
- **Después:** bloque «Criterio de salida de la épica que cubre» con la línea literal de CS-1.

### C-04 — STORY-149 › AC-4, CNF y Notas

- **Origen:** H-006 [ERROR] SAL-01 (hueco real)
- **Operación:** añadir
- **Antes:** —
- **Después:** AC-4 «sddf-init sin resolución legada» (grep vacío sobre `skills/sddf-init/`, assets sin `root`, `.env.template` sin `SDDF_ROOT`), CNF-3 de contrato, CNF-2 ampliado a los evals legados, inventario de los 5 archivos y dependencia de STORY-148.

### C-05 — STORY-157 › Como/Quiero/Para, AC-3, Notas y precondición

- **Origen:** H-006, H-007, H-009 [ERROR] SAL-01 (criterio global)
- **Operación:** añadir / modificar
- **Antes:** precondición «STORY-153 entregada y el gate acepta `specs/flow/`»; sin AC de cierre.
- **Después:** AC-3 «cierre del contrato de salida global» (grep sobre `skills/` solo con diagnóstico en `skill-preflight`, lista transitoria vacía, ningún skill lee `root` y `sddf-init` no la escribe, `npm test` y `verify:repository` en verde); citas E1 de CS-2, CS-3 y CS-12; precondición «es la última historia de EPIC-26»; Quiero/Para ampliados al cierre.

### C-06 — STORY-153 › Notas

- **Origen:** H-008 [ERROR] SAL-01
- **Operación:** añadir
- **Antes:** —
- **Después:** bloque de cita literal de CS-11.

### C-07 — coherencia derivada (ver tabla)

- **Origen:** COH-3 … COH-7
- **Operación:** modificar
- **Antes / Después:** ver «Coherencia derivada».

## Coherencia derivada

| ID | Archivo | Referencia obsoleta | Corrección | Cambio |
|---|---|---|---|---|
| COH-1 | epic.md | Línea de STORY-150 con el alcance previo al split | Alcance de especificación | C-02 |
| COH-2 | epic.md | Línea de STORY-153 con título y reparación de enlaces previos al split | Título vigente, sin enlaces | C-02 |
| COH-3 | STORY-150, STORY-155 | `related` → `STORY-156-migrar-skills-implementacion-verificacion-specs-flow` | `STORY-156-migrar-skills-implementacion-specs-flow` + `STORY-158-…` | C-07 |
| COH-4 | STORY-150, STORY-155 | `Fuera de alcance` nombraba solo STORY-156 para implementación y verificación | STORY-156 y STORY-158 | C-07 |
| COH-5 | STORY-150 | Nota: STORY-156 «cierra con el grep global sobre `skills/story-*`» | El grep global lo verifica STORY-157 AC-3 | C-07 |
| COH-6 | STORY-148 | Lista de historias de migración (solo 150-152) | 149, 150, 151, 152, 155, 156 y 158; cierre en STORY-157 | C-07 |
| COH-7 | STORY-153 | Precondición «después de STORY-150 a STORY-152» | Todas las historias de migración de skills | C-07 |

## Alternativas descartadas

| Origen | Alternativa descartada | Motivo |
|---|---|---|
| H-006, H-007, H-009 | Crear una historia de cierre nueva | STORY-157 ya valida el gate tras la migración y depende de las demás; añadir un AC no rompe su tamaño |
| H-006, H-007, H-009 | AC de cierre en STORY-148 | STORY-148 es precondición de las migraciones: no puede verificar su resultado final |
| H-006 | Citar CS-2 en cada historia de migración | Cada una cubre solo su porción; la cita falsearía la cobertura |

## Fuera de alcance

Ninguno.

## Siguiente paso

`/epic-analyze EPIC-26` ya se ejecutó tras el refinamiento: `APPROVED`. La épica puede pasar a la decisión del PO para `READY-FOR-DEV`.
