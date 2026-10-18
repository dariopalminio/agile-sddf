---
type: requirement
kind: functional
id: FR-038
slug: FR-038-analisis-transversal-de-coherencia-gate-del-dod
title: "Análisis transversal de coherencia (gate del DoD PLAN)"
status: active
created: 2026-10-10
updated: 2026-10-18
related: []
---

# FR-038 — Análisis transversal de coherencia (gate del DoD PLAN)

## Descripción

El sistema SHALL auditar la coherencia entre `story.md`, `design.md`,
`testcases.md` y `tasks.md`, detectando inconsistencias, omisiones y ambigüedades técnicas no
resueltas, y verificando el cumplimiento del DoD del estado PLAN. Produce `analyze.md`.
Declara el veredicto `APPROVED` o `NEEDS-CHANGES` en `verdict` y en `## Veredicto`.
Con `APPROVED` (sin hallazgos `ERROR`) SHALL promover la historia a `READY-FOR-IMPLEMENT/DONE`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-004
- **Fuente**: `story-analyze` · STORY-059, STORY-068 · EPIC-12, EPIC-13
- **Categoría de origen**: 2.1.6 Planificación de historia (nivel L1 · fase PLAN)
