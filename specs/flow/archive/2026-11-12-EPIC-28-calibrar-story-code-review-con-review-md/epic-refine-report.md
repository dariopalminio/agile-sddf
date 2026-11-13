---
type: epic-refine-report
id: EPIC-28
slug: EPIC-28-calibrar-story-code-review-con-review-md-refine-report
title: "Epic refine: Calibrar story-code-review con REVIEW.md"
epic: EPIC-28
analyze-verdict: NEEDS-REFINEMENT
analyze-updated: 2026-11-12
mode: manual
findings-total: 6
findings-applied: 0
findings-resolved: 1
findings-out-of-scope: 5
files-modified: []
created: 2026-11-12
updated: 2026-11-12
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
---
<!-- Referencias -->
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# Refinamiento de épica: Calibrar story-code-review con REVIEW.md

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-28 (`specs/flow/EPIC-28-calibrar-story-code-review-con-review-md/epic.md`) |
| Análisis de origen | `NEEDS-REFINEMENT` · 2026-11-12 |
| Modo | manual |
| Hallazgos aplicados | 0 |
| Hallazgos ya resueltos | 1 |
| Hallazgos fuera de alcance | 5 |
| Archivos modificados | ninguno |
| Fecha | 2026-11-12 |

## Hallazgos

| Origen | Código | Severidad | Elemento | Clasificación | Responsable | Cambios |
|---|---|---|---|---|---|---|
| H-001 · SAL-01 | SAL-01 | ERROR | `SAL-01 · CS-1` | fuera de alcance | PO: `Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con /epic-generate-stories); si una historia ya lo cubre, citar el criterio en su story.md; o retirar el criterio si es obsoleto` — varias candidatas sin dependientes: STORY-178, STORY-179 | — |
| H-002 · SAL-01 | SAL-01 | ERROR | `SAL-01 · CS-2` | fuera de alcance | PO: `Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con /epic-generate-stories); si una historia ya lo cubre, citar el criterio en su story.md; o retirar el criterio si es obsoleto` — STORY-180 ya está implementada: añadir un AC reabre su alcance | — |
| H-003 · SAL-01 | SAL-01 | ERROR | `SAL-01 · CS-4` | fuera de alcance | PO: `Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con /epic-generate-stories); si una historia ya lo cubre, citar el criterio en su story.md; o retirar el criterio si es obsoleto` — varias candidatas sin dependientes: STORY-181, STORY-182, STORY-185 | — |
| H-004 · SAL-01 | SAL-01 | ERROR | `SAL-01 · CS-5` | ya resuelto | — | — |
| H-005 · SAL-01 | SAL-01 | ERROR | `SAL-01 · CS-7` | fuera de alcance | PO: `Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con /epic-generate-stories); si una historia ya lo cubre, citar el criterio en su story.md; o retirar el criterio si es obsoleto` — STORY-177 ya está implementada: añadir un AC reabre su alcance | — |
| H-006 · SAL-01 | SAL-01 | ERROR | `SAL-01 · CS-8` | fuera de alcance | PO: `Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con /epic-generate-stories); si una historia ya lo cubre, citar el criterio en su story.md; o retirar el criterio si es obsoleto` — sin evidencia parcial | — |

## Cambios aplicados

Sin cambios.

## Notas

- ⚠️ Usando template seed del skill. Copia assets/epic-refine-report-template.md a docs/templates/ para personalizarlo.
- Detección COH: sin referencias obsoletas. El índice de `epic.md` no contiene slugs de historia y todas las entradas `related` de STORY-177..185 resuelven a un directorio existente en `specs/flow/`.
- H-001 · SAL-01 · CS-1: varias candidatas sin dependientes: STORY-178, STORY-179 (ninguna declara `depends-on:`).
- H-002 · SAL-01 · CS-2: STORY-180 ya está implementada: añadir un AC reabre su alcance (`status: ACCEPTANCE`).
- H-003 · SAL-01 · CS-4: varias candidatas sin dependientes: STORY-181, STORY-182, STORY-185 (ninguna declara `depends-on:`).
- H-004 · SAL-01 · CS-5: el elemento ya no figura en epic.md. Aclaración: el criterio CS-5 sigue en `epic.md:45`, pero con otro texto. El **Elemento** de `epic-analyze-report.md:90` añade «y los criterios cubiertos por un revisor toman su resultado en lugar de crear hallazgos nuevos», que no está en `epic.md:45`. El hallazgo no está resuelto en el fondo: el próximo `/epic-analyze` volverá a evaluar CS-5 con su texto real, y su única candidata es STORY-183 (`status: ACCEPTANCE`).
- H-005 · SAL-01 · CS-7: STORY-177 ya está implementada: añadir un AC reabre su alcance (`status: ACCEPTANCE`).
- H-006 · SAL-01 · CS-8: sin evidencia parcial: crea o ajusta una historia con /epic-generate-stories o retira el elemento de epic.md.
