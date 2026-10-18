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

El sistema SHALL auditar la coherencia, completitud y ausencia de ambigüedades no resueltas 
entre los artefactos de planificación de una historia, verificando el cumplimiento del DoD 
vigente para la fase PLAN. El sistema SHALL producir un informe de análisis persistido y emitir 
un veredicto (`verdict`) explícito de aprobación o rechazo con necesidad de cambios (`APPROVED` 
o `NEEDS-CHANGES`), expuesto tanto de forma estructurada como en el propio informe.
Cuando el veredicto sea aprobado (`APPROVED`) y no existan hallazgos de severidad error, 
el sistema SHALL promover la historia al siguiente estado habilitado del flujo.

Los nombres canónicos de artefactos, campos, valores de estado y formato del informe 
se especifican en el Contrato de Artefactos de Planificación.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-004
- **Fuente**: `story-analyze` · STORY-059, STORY-068 · EPIC-12, EPIC-13
- **Categoría de origen**: 2.1.6 Planificación de historia (nivel L1 · fase PLAN)
